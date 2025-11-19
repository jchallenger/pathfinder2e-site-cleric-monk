import { Info } from 'lucide-react';
import Tooltip from './Tooltip.jsx';

/**
 * Reusable StatCard Component
 *
 * Displays a single stat with value, label, and optional tooltip breakdown.
 * Used for AC, saves, skills, attack bonuses, damage, etc.
 *
 * @param {string} label - Stat label (e.g., "Armor Class", "Fortitude")
 * @param {string|number} value - Stat value to display
 * @param {React.ReactNode} tooltipContent - Optional tooltip content with calculation breakdown
 * @param {string} size - Size variant ('small', 'medium', 'large')
 * @param {string} variant - Color variant ('default', 'primary', 'success', 'warning', 'danger')
 */
export default function StatCard({
  label,
  value,
  tooltipContent = null,
  size = 'medium',
  variant = 'default'
}) {
  // Size classes
  const sizeClasses = {
    small: {
      container: 'p-2',
      label: 'text-xs',
      value: 'text-lg'
    },
    medium: {
      container: 'p-3',
      label: 'text-sm',
      value: 'text-2xl'
    },
    large: {
      container: 'p-4',
      label: 'text-base',
      value: 'text-3xl'
    }
  };

  // Variant color classes
  const variantClasses = {
    default: {
      container: 'bg-slate-800 border-slate-600',
      label: 'text-slate-300',
      value: 'text-white'
    },
    primary: {
      container: 'bg-purple-900/40 border-purple-500',
      label: 'text-purple-300',
      value: 'text-purple-100'
    },
    success: {
      container: 'bg-green-900/40 border-green-500',
      label: 'text-green-300',
      value: 'text-green-100'
    },
    warning: {
      container: 'bg-yellow-900/40 border-yellow-500',
      label: 'text-yellow-300',
      value: 'text-yellow-100'
    },
    danger: {
      container: 'bg-red-900/40 border-red-500',
      label: 'text-red-300',
      value: 'text-red-100'
    }
  };

  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];

  return (
    <div className={`${sizeClass.container} ${variantClass.container} border rounded-lg text-center`}>
      <div className={`${sizeClass.label} ${variantClass.label} mb-1 flex items-center justify-center gap-1`}>
        {label}
        {tooltipContent && (
          <Tooltip content={tooltipContent}>
            <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
          </Tooltip>
        )}
      </div>
      <div className={`${sizeClass.value} ${variantClass.value} font-bold`}>
        {value}
      </div>
    </div>
  );
}
