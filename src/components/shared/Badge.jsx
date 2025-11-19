/**
 * Reusable Badge Component
 *
 * Small colored badge for displaying rarity, level, tags, status, etc.
 * Used for feat prerequisites, item rarity, spell ranks, proficiency levels, etc.
 *
 * @param {string} children - Badge text content
 * @param {string} variant - Color variant ('default', 'rarity-common', 'rarity-uncommon', 'rarity-rare', 'rarity-unique', 'level', 'rank', 'success', 'warning', 'danger', 'info')
 * @param {string} size - Size variant ('small', 'medium', 'large')
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'small'
}) {
  // Size classes
  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  // Variant color classes (following PF2e rarity colors)
  const variantClasses = {
    default: 'bg-slate-700 text-slate-200 border-slate-600',
    'rarity-common': 'bg-slate-700 text-slate-200 border-slate-600',
    'rarity-uncommon': 'bg-orange-900/50 text-orange-200 border-orange-500',
    'rarity-rare': 'bg-blue-900/50 text-blue-200 border-blue-500',
    'rarity-unique': 'bg-purple-900/50 text-purple-200 border-purple-500',
    level: 'bg-indigo-900/50 text-indigo-200 border-indigo-500',
    rank: 'bg-teal-900/50 text-teal-200 border-teal-500',
    success: 'bg-green-900/50 text-green-200 border-green-500',
    warning: 'bg-yellow-900/50 text-yellow-200 border-yellow-500',
    danger: 'bg-red-900/50 text-red-200 border-red-500',
    info: 'bg-blue-900/50 text-blue-200 border-blue-500'
  };

  return (
    <span
      className={`inline-block ${sizeClasses[size]} ${variantClasses[variant]} border rounded font-medium whitespace-nowrap`}
    >
      {children}
    </span>
  );
}
