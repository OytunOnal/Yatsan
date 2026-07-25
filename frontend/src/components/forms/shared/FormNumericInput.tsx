import React, { forwardRef } from 'react';

export interface FormNumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {
  label?: string;
  error?: string;
  containerClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const FormNumericInput = forwardRef<HTMLInputElement, FormNumericInputProps>(
  ({ label, error, className = '', containerClassName = '', id, name, required = false, onKeyDown, ...props }, ref) => {
    const inputId = id || name;
    
    const baseInputClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // İzin verilen tuşlar: rakamlar (0-9), backspace, delete, tab, arrow keys, enter, home, end, nokta
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', '.', ','
      ];

      // Ctrl/Cmd + A, C, V, X izin ver
      if (e.ctrlKey || e.metaKey) {
        if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
          return;
        }
      }

      // Rakam veya izin verilen tuş değilse engelle
      if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }

      // Custom onKeyDown varsa çağır
      onKeyDown?.(e);
    };
    
    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="number"
          className={`${baseInputClasses} ${errorClasses} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          onKeyDown={handleKeyDown}
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

FormNumericInput.displayName = 'FormNumericInput';
