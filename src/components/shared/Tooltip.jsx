import { useState } from 'react';

/**
 * Reusable Tooltip Component
 *
 * Displays hoverable tooltip with detailed information, breakdowns, and source attribution.
 * Used across all tabs for stat explanations, spell details, feat prerequisites, etc.
 *
 * @param {React.ReactNode} children - The element to hover over (usually an Info icon)
 * @param {React.ReactNode} content - The tooltip content (supports JSX for rich formatting)
 * @param {string} position - Position of tooltip relative to trigger ('right', 'left', 'top', 'bottom')
 * @param {string} width - Width class for tooltip (default: 'w-80')
 */
export default function Tooltip({
  children,
  content,
  position = 'right',
  width = 'w-80'
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes for tooltip placement
  const positionClasses = {
    right: 'left-full ml-2 -top-2',
    left: 'right-full mr-2 -top-2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center gap-1"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 ${width} p-4 bg-slate-800 border border-purple-500 rounded-lg shadow-2xl ${positionClasses[position]} text-sm`}
        >
          <div className="space-y-2">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
