
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
  processingMethod?: 'text_extraction' | 'vision_api' | 'hybrid_extraction';
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
      const fileName = `${uploadId}_${file.name}`;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Upload file to Supabase Storage without authentication
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setUploads(prev => ({
        ...prev,
        [uploadId]: { ...prev[uploadId], progress: 30 }
      }));

      // Create document record in database
      const { data: documentRecord, error: dbError } = await supabase
        .from('document_uploads')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
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
        [uploadId]: { ...prev[uploadId], progress: 50, status: 'processing' }
      }));

      // Get signed URL for analysis
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(uploadData.path, 3600);

      if (urlError) {
        throw new Error(`Failed to get file URL: ${urlError.message}`);
      }

      // Analyze document
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-documents', {
          body: {
            documentId: documentRecord.id,
            fileUrl: signedUrlData.signedUrl,
            documentType: type
          }
        });

      if (analysisError) {
        throw new Error(`Analysis failed: ${analysisError.message}`);
      }

      if (!analysisData.success) {
        if (analysisData.error === 'UNABLE_TO_EXTRACT_TEXT') {
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
            title: "Document Processing Failed",
            description: "We couldn't read your PDF. Please upload the document as a high-resolution image (PNG/JPG) instead.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(analysisData.error || 'Analysis failed');
      }

      // Determine processing method
      const processingMethod = analysisData.processingMethod === 'hybrid_extraction' 
        ? 'hybrid_extraction' 
        : analysisData.processingMethod === 'vision_api'
        ? 'vision_api'
        : fileExtension === 'pdf' ? 'text_extraction' : 'vision_api';

      setUploads(prev => ({
        ...prev,
        [uploadId]: {
          ...prev[uploadId],
          progress: 100,
          status: 'completed',
          extractedData: analysisData.extractedData,
          processingMethod
        }
      }));

      const methodDescription = processingMethod === 'hybrid_extraction' 
        ? 'hybrid text extraction and OCR' 
        : processingMethod === 'vision_api'
        ? 'image analysis'
        : 'text extraction';

      toast({
        title: "Document Processed Successfully",
        description: `Your ${type.replace('_', ' ')} has been analyzed using ${methodDescription}.`,
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
