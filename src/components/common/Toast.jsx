/**
 * Toast — lightweight notification banner for success/error feedback.
 * Auto-dismisses after a configurable duration.
 */

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm
        ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
        animate-in slide-in-from-bottom-4 duration-300`}
    >
      {isSuccess ? (
        <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
      ) : (
        <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
      )}
      <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X size={16} className={isSuccess ? 'text-green-800' : 'text-red-800'} />
      </button>
    </div>
  );
};
