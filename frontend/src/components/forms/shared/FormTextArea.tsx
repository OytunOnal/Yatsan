import React, { forwardRef } from 'react';

export interface FormTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'ref'> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, className = '', containerClassName = '', id, name, required = false, rows = 4, ...props }, ref) => {
    const inputId = id || name;
    
    const baseInputClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          className={`${baseInputClasses} ${errorClasses} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';
