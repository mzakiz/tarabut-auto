
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploadZoneProps {
  type: 'salary_certificate' | 'bank_statement';
  title: string;
  description: string;
  acceptedFileTypes: string[];
  onUpload: (file: File) => void;
  uploadStatus?: {
    status: 'uploading' | 'processing' | 'completed' | 'failed';
    progress: number;
    error?: string;
    errorType?: 'UNREADABLE_PDF' | 'SERVER_ERROR' | 'UPLOAD_ERROR';
    fileName?: string;
    processingMethod?: 'text_extraction' | 'vision_api';
  };
  icon?: React.ReactNode;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  type,
  title,
  description,
  acceptedFileTypes,
  onUpload,
  uploadStatus,
  icon
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: uploadStatus?.status === 'uploading' || uploadStatus?.status === 'processing'
  });

  const getStatusIcon = () => {
    if (!uploadStatus) return icon || <FileText className="w-8 h-8" />;
    
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return uploadStatus.errorType === 'UNREADABLE_PDF'
          ? <AlertTriangle className="w-8 h-8 text-orange-500" />
          : <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return icon || <FileText className="w-8 h-8" />;
    }
  };

  const getStatusText = () => {
    if (!uploadStatus) return description;
    
    switch (uploadStatus.status) {
      case 'uploading':
        return 'Uploading document...';
      case 'processing':
        return 'Analyzing document with AI...';
      case 'completed':
        const methodText = uploadStatus.processingMethod === 'vision_api'
          ? ' (image analysis)'
          : ' (text extraction)';
        return `✅ ${uploadStatus.fileName} processed successfully${methodText}`;
      case 'failed':
        if (uploadStatus.errorType === 'UNREADABLE_PDF') {
          return `⚠️ PDF processing failed. Please upload as image (PNG/JPG)`;
        }
        return `❌ ${uploadStatus.error || 'Upload failed'}`;
      default:
        return description;
    }
  };

  const getCardBorderColor = () => {
    if (!uploadStatus) {
      if (isDragActive) return "border-primary bg-primary/5";
      return "hover:border-primary/50 cursor-pointer";
    }
    
    switch (uploadStatus.status) {
      case 'completed':
        return "border-green-500 bg-green-50";
      case 'failed':
        return uploadStatus.errorType === 'UNREADABLE_PDF'
          ? "border-orange-500 bg-orange-50"
          : "border-red-500 bg-red-50";
      default:
        return "";
    }
  };

  const isCompleted = uploadStatus?.status === 'completed';
  const isProcessing = uploadStatus?.status === 'uploading' || uploadStatus?.status === 'processing';
  const isPdfReadError = uploadStatus?.status === 'failed' && uploadStatus?.errorType === 'UNREADABLE_PDF';

  return (
    <Card className={cn(
      "p-6 border-2 border-dashed transition-all duration-200",
      getCardBorderColor(),
      !isProcessing && !isCompleted && "cursor-pointer"
    )}>
      <div 
        {...getRootProps()} 
        className="flex flex-col items-center justify-center text-center space-y-4"
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          {getStatusIcon()}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className={cn(
              "text-sm mb-4",
              uploadStatus?.status === 'failed' 
                ? isPdfReadError
                  ? "text-orange-600" 
                  : "text-red-600"
                : "text-muted-foreground"
            )}>
              {getStatusText()}
            </p>
            
            {uploadStatus?.progress !== undefined && uploadStatus.progress > 0 && (
              <div className="w-full max-w-xs">
                <Progress value={uploadStatus.progress} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {uploadStatus.progress}% complete
                </p>
              </div>
            )}

            {isPdfReadError && (
              <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-md">
                <p className="text-xs text-orange-800 font-medium mb-2">
                  💡 PDF Processing Failed
                </p>
                <p className="text-xs text-orange-700">
                  The PDF could not be processed. Try uploading your document as a high-resolution PNG or JPG image instead
                </p>
              </div>
            )}
          </div>
        </div>

        {!isProcessing && !isCompleted && (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Supported formats: {acceptedFileTypes.join(', ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: 10MB
            </p>
            {isPdfReadError && (
              <p className="text-xs text-orange-600 font-medium">
                📸 For best results, use PNG/JPG images
              </p>
            )}
          </div>
        )}
        
        {(isCompleted || isPdfReadError) && (
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        )}
      </div>
    </Card>
  );
};
