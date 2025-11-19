import { ExternalLink } from 'lucide-react';

/**
 * Reusable SourceLink Component
 *
 * Displays a link to Archives of Nethys with consistent styling and icon.
 * Used throughout app for source attribution on spells, feats, equipment, rules, etc.
 *
 * @param {string} url - Archives of Nethys URL
 * @param {string} label - Optional link label (default: shows icon only)
 * @param {string} size - Icon size ('small', 'medium', 'large')
 * @param {boolean} showLabel - Whether to show "Source" label
 */
export default function SourceLink({
  url,
  label = null,
  size = 'small',
  showLabel = false
}) {
  // Size classes for icon
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
      title="View on Archives of Nethys"
    >
      {showLabel && (
        <span className="text-xs">Source:</span>
      )}
      {label && (
        <span className="text-xs">{label}</span>
      )}
      <ExternalLink className={sizeClasses[size]} />
    </a>
  );
}
