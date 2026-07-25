import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'ref'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ 
    label, 
    error, 
    options, 
    className = '', 
    containerClassName = '', 
    id, 
    name, 
    required = false, 
    placeholder,
    ...props 
  }, ref) => {
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
        <select
          ref={ref}
          id={inputId}
          name={name}
          className={`${baseInputClasses} ${errorClasses} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
