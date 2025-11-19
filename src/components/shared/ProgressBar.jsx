/**
 * Reusable ProgressBar Component
 *
 * Visual progress indicator with customizable colors and labels.
 * Used for HP tracking, spell slots, bulk capacity, level progress, etc.
 *
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {string} label - Optional label displayed above bar
 * @param {boolean} showValues - Whether to show "current/max" text
 * @param {string} variant - Color variant ('default', 'hp', 'success', 'warning', 'danger')
 * @param {string} size - Height size ('small', 'medium', 'large')
 */
export default function ProgressBar({
  current,
  max,
  label = null,
  showValues = true,
  variant = 'default',
  size = 'medium'
}) {
  // Calculate percentage (prevent division by zero)
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  // Size classes
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  };

  // Variant color classes
  const variantClasses = {
    default: {
      bg: 'bg-slate-700',
      fill: 'bg-purple-500'
    },
    hp: {
      bg: 'bg-slate-700',
      fill: percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
    },
    success: {
      bg: 'bg-slate-700',
      fill: 'bg-green-500'
    },
    warning: {
      bg: 'bg-slate-700',
      fill: 'bg-yellow-500'
    },
    danger: {
      bg: 'bg-slate-700',
      fill: 'bg-red-500'
    }
  };

  const variantClass = variantClasses[variant];

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex items-center justify-between mb-1 text-sm">
          {label && <span className="text-slate-300">{label}</span>}
          {showValues && (
            <span className="text-slate-400 font-mono">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className={`${sizeClasses[size]} ${variantClass.bg} rounded-full overflow-hidden`}>
        <div
          className={`${sizeClasses[size]} ${variantClass.fill} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
