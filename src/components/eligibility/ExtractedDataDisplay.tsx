
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

interface ExtractedDataDisplayProps {
  data: any;
  documentType: 'salary_certificate' | 'bank_statement';
  confidenceScore?: number;
}

export const ExtractedDataDisplay: React.FC<ExtractedDataDisplayProps> = ({
  data,
  documentType,
  confidenceScore
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const renderSalaryCertificateData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Employee Name</label>
          <p className="font-semibold">{data.employee_name || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Company</label>
          <p className="font-semibold">{data.company_name || 'Not specified'}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Basic Salary</label>
          <p className="text-lg font-bold text-green-600">
            {data.basic_salary ? formatCurrency(data.basic_salary) : 'Not specified'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Allowances</label>
          <p className="text-lg font-bold text-blue-600">
            {data.allowances ? formatCurrency(data.allowances) : 'Not specified'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Gross Salary</label>
          <p className="text-xl font-bold text-primary">
            {data.monthly_gross_salary ? formatCurrency(data.monthly_gross_salary) : 'Not specified'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Net Salary</label>
          <p className="text-xl font-bold text-green-700">
            {data.net_salary ? formatCurrency(data.net_salary) : 'Not specified'}
          </p>
        </div>
      </div>

      {data.total_deductions && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Total Deductions</label>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(data.total_deductions)}
          </p>
        </div>
      )}
    </div>
  );

  const renderBankStatementData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Account Holder</label>
          <p className="font-semibold">{data.account_holder_name || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Bank</label>
          <p className="font-semibold">{data.bank_name || 'Not specified'}</p>
        </div>
      </div>

      <Separator />

      <div>
        <label className="text-sm font-medium text-muted-foreground">Average Monthly Income</label>
        <p className="text-xl font-bold text-green-700">
          {data.average_monthly_income ? formatCurrency(data.average_monthly_income) : 'Not calculated'}
        </p>
      </div>

      {data.monthly_salary_deposits && data.monthly_salary_deposits.length > 0 && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Recent Salary Deposits
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.monthly_salary_deposits.map((deposit: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{formatCurrency(deposit.amount)}</p>
                  <p className="text-xs text-muted-foreground">{deposit.description}</p>
                </div>
                <p className="text-sm text-muted-foreground">{deposit.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Extracted Information</h3>
        {confidenceScore && (
          <Badge 
            variant={confidenceScore >= 0.8 ? 'default' : confidenceScore >= 0.6 ? 'secondary' : 'destructive'}
          >
            {Math.round(confidenceScore * 100)}% Confidence
          </Badge>
        )}
      </div>

      {documentType === 'salary_certificate' ? renderSalaryCertificateData() : renderBankStatementData()}
    </Card>
  );
};
