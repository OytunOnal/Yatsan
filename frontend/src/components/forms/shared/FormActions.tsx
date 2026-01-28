import React from 'react';

export interface FormActionsProps {
  loading?: boolean;
  submitLabel?: string;
  submitLoadingLabel?: string;
  showCancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  loading = false,
  submitLabel = 'Kaydet',
  submitLoadingLabel = 'Kaydediliyor...',
  showCancel = false,
  cancelLabel = 'İptal',
  onCancel,
  className = '',
}) => {
  return (
    <div className={`flex justify-end gap-3 ${className}`.trim()}>
      {showCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? submitLoadingLabel : submitLabel}
      </button>
    </div>
  );
};

FormActions.displayName = 'FormActions';
