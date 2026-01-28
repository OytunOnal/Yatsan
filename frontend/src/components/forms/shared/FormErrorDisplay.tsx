import React from 'react';

export interface FormErrorDisplayProps {
  error?: string;
  fieldErrors?: Record<string, string>;
  fieldLabels?: Record<string, string>;
}

export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ 
  error, 
  fieldErrors = {}, 
  fieldLabels = {} 
}) => {
  // Genel hata mesajı
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  // Alan hataları listesi
  const errorEntries = Object.entries(fieldErrors).filter(([_, message]) => !!message);
  
  if (errorEntries.length > 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold mb-2">Lütfen şu hataları düzeltin:</p>
        <ul className="list-disc list-inside space-y-1">
          {errorEntries.map(([field, message]) => (
            <li key={field} className="text-sm">
              {fieldLabels[field] || field}: {message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

FormErrorDisplay.displayName = 'FormErrorDisplay';
