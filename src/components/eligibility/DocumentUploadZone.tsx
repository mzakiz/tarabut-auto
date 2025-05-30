
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
    fileName?: string;
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
        return <XCircle className="w-8 h-8 text-red-500" />;
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
        return `✅ ${uploadStatus.fileName} processed successfully`;
      case 'failed':
        return `❌ ${uploadStatus.error || 'Upload failed'}`;
      default:
        return description;
    }
  };

  const isCompleted = uploadStatus?.status === 'completed';
  const isProcessing = uploadStatus?.status === 'uploading' || uploadStatus?.status === 'processing';

  return (
    <Card className={cn(
      "p-6 border-2 border-dashed transition-all duration-200",
      isDragActive && "border-primary bg-primary/5",
      isCompleted && "border-green-500 bg-green-50",
      uploadStatus?.status === 'failed' && "border-red-500 bg-red-50",
      !isProcessing && !isCompleted && "hover:border-primary/50 cursor-pointer"
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
            <p className="text-sm text-muted-foreground mb-4">
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
          </div>
        )}
        
        {isCompleted && (
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
