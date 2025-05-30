
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentUploadZone } from '@/components/eligibility/DocumentUploadZone';
import { ExtractedDataDisplay } from '@/components/eligibility/ExtractedDataDisplay';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, FileText, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Head } from '@/components/Head';

const CheckEligibility: React.FC = () => {
  const { t, language } = useTranslation();
  const { uploads, uploadDocument } = useDocumentUpload();
  const navigate = useNavigate();

  // Get upload statuses
  const salaryUpload = Object.values(uploads).find(upload => upload.type === 'salary_certificate');
  const bankUpload = Object.values(uploads).find(upload => upload.type === 'bank_statement');

  const handleGoBack = () => {
    navigate(-1);
  };

  const getSalaryUploadStatus = () => {
    if (!salaryUpload) return undefined;
    return {
      status: salaryUpload.status,
      progress: salaryUpload.progress,
      error: salaryUpload.error,
      fileName: salaryUpload.file.name
    };
  };

  const getBankUploadStatus = () => {
    if (!bankUpload) return undefined;
    return {
      status: bankUpload.status,
      progress: bankUpload.progress,
      error: bankUpload.error,
      fileName: bankUpload.file.name
    };
  };

  const hasCompletedUploads = salaryUpload?.status === 'completed' || bankUpload?.status === 'completed';

  return (
    <>
      <Head 
        title="Check Eligibility - Tarabut Auto"
        description="Upload your salary certificate and bank statement to check your financing eligibility"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Check Your Financing Eligibility</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your salary certificate and bank statement to get an instant assessment of your financing eligibility. 
                Our AI will analyze your documents to determine your qualification.
              </p>
            </div>

            {/* Upload Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DocumentUploadZone
                type="salary_certificate"
                title="Salary Certificate"
                description="Upload your official salary certificate from your employer"
                acceptedFileTypes={['PDF', 'JPG', 'PNG']}
                onUpload={(file) => uploadDocument(file, 'salary_certificate')}
                uploadStatus={getSalaryUploadStatus()}
                icon={<FileText className="w-8 h-8 text-blue-500" />}
              />

              <DocumentUploadZone
                type="bank_statement"
                title="Bank Statement"
                description="Upload your recent bank statement (last 3 months)"
                acceptedFileTypes={['PDF', 'JPG', 'PNG']}
                onUpload={(file) => uploadDocument(file, 'bank_statement')}
                uploadStatus={getBankUploadStatus()}
                icon={<CreditCard className="w-8 h-8 text-green-500" />}
              />
            </div>

            {/* Extracted Data Display */}
            {hasCompletedUploads && (
              <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-bold text-center">Document Analysis Results</h2>
                
                {salaryUpload?.status === 'completed' && salaryUpload.extractedData && (
                  <ExtractedDataDisplay
                    data={salaryUpload.extractedData}
                    documentType="salary_certificate"
                    confidenceScore={salaryUpload.extractedData.confidence_score}
                  />
                )}

                {bankUpload?.status === 'completed' && bankUpload.extractedData && (
                  <ExtractedDataDisplay
                    data={bankUpload.extractedData}
                    documentType="bank_statement"
                    confidenceScore={bankUpload.extractedData.confidence_score}
                  />
                )}
              </div>
            )}

            {/* Instructions Card */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Important Notes:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Documents should be clear and readable</li>
                <li>• Salary certificates must be officially stamped by your employer</li>
                <li>• Bank statements should cover the last 3 months</li>
                <li>• Supported formats: PDF, JPG, PNG (max 10MB)</li>
                <li>• Processing typically takes 30-60 seconds per document</li>
                <li>• All uploaded documents are encrypted and securely stored</li>
              </ul>
            </Card>

            {/* Next Steps */}
            {hasCompletedUploads && (
              <div className="mt-8 text-center">
                <Card className="p-6 bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">
                    ✅ Documents Successfully Processed
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your documents have been analyzed. Based on the extracted information, 
                    you may proceed with your financing application.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Continue to Financing Options
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckEligibility;
