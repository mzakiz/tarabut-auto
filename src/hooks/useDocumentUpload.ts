
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUpload {
  id: string;
  file: File;
  type: 'salary_certificate' | 'bank_statement';
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  extractedData?: any;
  error?: string;
  errorType?: 'UNREADABLE_PDF' | 'SERVER_ERROR' | 'UPLOAD_ERROR';
}

export const useDocumentUpload = () => {
  const [uploads, setUploads] = useState<Record<string, DocumentUpload>>({});
  const { toast } = useToast();

  const uploadDocument = async (file: File, type: 'salary_certificate' | 'bank_statement') => {
    const uploadId = crypto.randomUUID();
    
    // Initialize upload state
    setUploads(prev => ({
      ...prev,
      [uploadId]: {
        id: uploadId,
        file,
        type,
        status: 'uploading',
        progress: 0
      }
    }));

    try {
      // Upload file to Supabase Storage without authentication
      const fileName = `${uploadId}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setUploads(prev => ({
        ...prev,
        [uploadId]: { ...prev[uploadId], progress: 50 }
      }));

      // Create document record in database (without user_id for anonymous uploads)
      const { data: documentRecord, error: dbError } = await supabase
        .from('document_uploads')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for anonymous uploads
          document_type: type,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      setUploads(prev => ({
        ...prev,
        [uploadId]: { ...prev[uploadId], progress: 75, status: 'processing' }
      }));

      // Get signed URL for OpenAI analysis
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(uploadData.path, 3600); // 1 hour expiry

      if (urlError) {
        throw new Error(`Failed to get file URL: ${urlError.message}`);
      }

      // Call document analysis function
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-documents', {
          body: {
            documentId: documentRecord.id,
            fileUrl: signedUrlData.signedUrl,
            documentType: type
          }
        });

      if (analysisError) {
        // Check if this is a structured error response
        if (analysisError.message && analysisError.message.includes('UNREADABLE_PDF')) {
          setUploads(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              status: 'failed',
              error: 'This PDF could not be read properly. Please upload the document as a high-resolution image (PNG/JPG) instead.',
              errorType: 'UNREADABLE_PDF'
            }
          }));

          toast({
            title: "PDF Reading Failed",
            description: "This PDF contains unreadable text. Please upload the document as a high-resolution image (PNG/JPG) for better results.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(`Analysis failed: ${analysisError.message}`);
      }

      // Handle analysis response
      if (!analysisData.success) {
        if (analysisData.error === 'UNREADABLE_PDF') {
          setUploads(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              status: 'failed',
              error: analysisData.message,
              errorType: 'UNREADABLE_PDF'
            }
          }));

          toast({
            title: "PDF Reading Failed",
            description: analysisData.message,
            variant: "destructive",
          });
          return;
        }

        throw new Error(analysisData.error || 'Analysis failed');
      }

      setUploads(prev => ({
        ...prev,
        [uploadId]: {
          ...prev[uploadId],
          progress: 100,
          status: 'completed',
          extractedData: analysisData.extractedData
        }
      }));

      toast({
        title: "Document Processed Successfully",
        description: `Your ${type.replace('_', ' ')} has been analyzed.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      setUploads(prev => ({
        ...prev,
        [uploadId]: {
          ...prev[uploadId],
          status: 'failed',
          error: error instanceof Error ? error.message : 'Upload failed',
          errorType: 'SERVER_ERROR'
        }
      }));

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to process document',
        variant: "destructive",
      });
    }
  };

  const removeUpload = (uploadId: string) => {
    setUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[uploadId];
      return newUploads;
    });
  };

  return {
    uploads,
    uploadDocument,
    removeUpload
  };
};
