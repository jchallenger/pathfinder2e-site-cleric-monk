/**
 * Reusable StatBlock Component
 *
 * Groups multiple related stats together in a cohesive block.
 * Used for saving throws, ability scores, skill groups, etc.
 *
 * @param {string} title - Block title
 * @param {React.ReactNode} children - StatCard components or other content
 * @param {string} columns - Number of columns ('1', '2', '3', '4', '5', '6')
 * @param {string} variant - Color variant ('default', 'primary', 'accent')
 */
export default function StatBlock({
  title,
  children,
  columns = '3',
  variant = 'default'
}) {
  // Column grid classes
  const columnClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'
  };

  // Variant color classes
  const variantClasses = {
    default: {
      container: 'bg-slate-900/50 border-slate-700',
      title: 'bg-slate-800 text-slate-200'
    },
    primary: {
      container: 'bg-purple-900/30 border-purple-500/30',
      title: 'bg-purple-900/50 text-purple-200'
    },
    accent: {
      container: 'bg-blue-900/30 border-blue-500/30',
      title: 'bg-blue-900/50 text-blue-200'
    }
  };

  const variantClass = variantClasses[variant];

  return (
    <div className={`${variantClass.container} border rounded-lg overflow-hidden`}>
      {title && (
        <div className={`${variantClass.title} px-4 py-2 font-semibold`}>
          {title}
        </div>
      )}
      <div className={`p-4 grid ${columnClasses[columns]} gap-4`}>
        {children}
      </div>
    </div>
  );
}
