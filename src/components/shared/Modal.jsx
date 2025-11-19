import { X } from 'lucide-react';

/**
 * Reusable Modal Component
 *
 * Full-screen overlay dialog for detailed views, forms, and browsing interfaces.
 * Used for equipment browser, spell details, feat selection, etc.
 *
 * @param {boolean} isOpen - Whether modal is currently displayed
 * @param {function} onClose - Callback function when modal is closed
 * @param {string} title - Modal title displayed in header
 * @param {React.ReactNode} children - Modal content
 * @param {string} size - Size of modal ('small', 'medium', 'large', 'xlarge', 'full')
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'large'
}) {
  if (!isOpen) return null;

  // Size classes for different modal widths
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`bg-slate-900 border border-purple-500 rounded-lg shadow-2xl ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <h2 className="text-xl font-bold text-purple-300">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
