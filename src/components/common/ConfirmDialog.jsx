/**
 * ConfirmDialog — modal that asks user to confirm destructive actions.
 * Renders a backdrop + centered card with confirm/cancel buttons.
 */

import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
