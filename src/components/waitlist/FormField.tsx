
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  inputMode?: 'text' | 'numeric';
  prefix?: string;
  dir?: 'rtl' | 'ltr';
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  required,
  type = 'text',
  placeholder,
  className,
  maxLength,
  inputMode,
  prefix,
  dir
}) => {
  return (
    <div>
      <Label htmlFor={id} className={`text-sm font-medium block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {prefix && (
          <span className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full h-12 mt-1 ${error ? 'border-red-500' : ''} ${prefix ? (dir === 'rtl' ? 'pr-14' : 'pl-14') : ''} ${className}`}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={inputMode}
          dir={dir}
        />
      </div>
      {error && <p className={`text-sm text-red-500 mt-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{error}</p>}
    </div>
  );
};
