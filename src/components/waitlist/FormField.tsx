
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
  suffix?: string;
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
  dir,
  suffix
}) => {
  const isRTL = dir === 'rtl';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };
  
  return (
    <div>
      <Label htmlFor={id} className={`text-sm font-medium block w-full ${isRTL ? 'text-right' : 'text-left'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {prefix && (
          <span 
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${
              isRTL ? 'right-3' : 'left-3'
            }`}
          >
            {prefix}
          </span>
        )}
        
        {suffix && (
          <span 
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${
              isRTL ? 'left-3' : 'right-3'
            }`}
          >
            {suffix}
          </span>
        )}
        
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full h-12 mt-1 ${error ? 'border-red-500' : ''} 
            ${prefix ? (isRTL ? 'pr-14' : 'pl-14') : ''} 
            ${suffix ? (isRTL ? 'pl-14' : 'pr-14') : ''} 
            ${isRTL ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}
            ${className}`}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={inputMode}
          dir={dir}
          style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}
        />
      </div>
      {error && <p className={`text-sm text-red-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>}
    </div>
  );
};
