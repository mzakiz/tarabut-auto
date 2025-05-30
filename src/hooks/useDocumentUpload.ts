
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
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Upload file to Supabase Storage
      const fileName = `${user.id}/${uploadId}_${file.name}`;
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

      // Create document record in database
      const { data: documentRecord, error: dbError } = await supabase
        .from('document_uploads')
        .insert({
          user_id: user.id,
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
        throw new Error(`Analysis failed: ${analysisError.message}`);
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
          error: error instanceof Error ? error.message : 'Upload failed'
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
