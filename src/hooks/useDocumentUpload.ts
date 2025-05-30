
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePdfToImage } from '@/hooks/usePdfToImage';

interface DocumentUpload {
  id: string;
  file: File;
  type: 'salary_certificate' | 'bank_statement';
  status: 'uploading' | 'processing' | 'converting' | 'completed' | 'failed';
  progress: number;
  extractedData?: any;
  error?: string;
  errorType?: 'UNREADABLE_PDF' | 'SERVER_ERROR' | 'UPLOAD_ERROR' | 'CONVERSION_ERROR';
  processingMethod?: 'text_extraction' | 'vision_api' | 'pdf_to_image_fallback';
  conversionProgress?: number;
}

export const useDocumentUpload = () => {
  const [uploads, setUploads] = useState<Record<string, DocumentUpload>>({});
  const { toast } = useToast();
  const { convertPdfToImages, isConverting, conversionProgress } = usePdfToImage();

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
      
      // Check if it's a PDF and if we should attempt conversion
      const isPdf = fileExtension === 'pdf';
      let shouldTryConversion = false;
      let convertedImages: string[] = [];

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

      // First attempt: Try normal processing
      let analysisData;
      let analysisError;

      try {
        const { data, error } = await supabase.functions
          .invoke('analyze-documents', {
            body: {
              documentId: documentRecord.id,
              fileUrl: signedUrlData.signedUrl,
              documentType: type
            }
          });

        analysisData = data;
        analysisError = error;
      } catch (error) {
        analysisError = error;
      }

      // If PDF analysis failed and it's a PDF, try client-side conversion
      if (analysisError && isPdf && 
          (analysisError.message?.includes('UNREADABLE_PDF') || 
           analysisError.message?.includes('text extraction failed'))) {
        
        console.log('PDF text extraction failed, attempting client-side conversion...');
        
        try {
          setUploads(prev => ({
            ...prev,
            [uploadId]: { 
              ...prev[uploadId], 
              status: 'converting',
              processingMethod: 'pdf_to_image_fallback'
            }
          }));

          // Convert PDF to images
          const conversionResult = await convertPdfToImages(file, 3);
          convertedImages = conversionResult.images;

          setUploads(prev => ({
            ...prev,
            [uploadId]: { 
              ...prev[uploadId], 
              status: 'processing',
              progress: 70
            }
          }));

          // Send images to edge function for Vision API processing
          const { data: visionData, error: visionError } = await supabase.functions
            .invoke('analyze-documents', {
              body: {
                documentId: documentRecord.id,
                images: convertedImages,
                documentType: type,
                processingMethod: 'pdf_to_image_fallback'
              }
            });

          if (visionError) {
            throw new Error(`Vision analysis failed: ${visionError.message}`);
          }

          analysisData = visionData;
          analysisError = null;

        } catch (conversionError) {
          console.error('PDF conversion failed:', conversionError);
          
          setUploads(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              status: 'failed',
              error: 'Failed to convert PDF to images. Please upload as a high-resolution image (PNG/JPG) instead.',
              errorType: 'CONVERSION_ERROR'
            }
          }));

          toast({
            title: "PDF Conversion Failed",
            description: "Could not convert PDF to images. Please upload the document as a high-resolution image (PNG/JPG) for better results.",
            variant: "destructive",
          });
          return;
        }
      }

      // Handle final analysis results
      if (analysisError) {
        throw new Error(`Analysis failed: ${analysisError.message}`);
      }

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
            title: "PDF Processing Failed",
            description: analysisData.message,
            variant: "destructive",
          });
          return;
        }

        throw new Error(analysisData.error || 'Analysis failed');
      }

      const processingMethod = convertedImages.length > 0 ? 'pdf_to_image_fallback' : 
                              (isPdf ? 'text_extraction' : 'vision_api');

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

      // Show appropriate success message
      const methodMessage = processingMethod === 'pdf_to_image_fallback' 
        ? 'Document processed using advanced PDF-to-image conversion.'
        : processingMethod === 'vision_api'
        ? 'Document processed using image analysis.'
        : 'Document processed using text extraction.';

      toast({
        title: "Document Processed Successfully",
        description: `${methodMessage} Your ${type.replace('_', ' ')} has been analyzed.`,
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
