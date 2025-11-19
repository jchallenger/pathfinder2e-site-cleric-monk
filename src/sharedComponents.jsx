import React, { useState } from 'react';
import { Info, ExternalLink, X } from 'lucide-react';

/**
 * Shared Components for Talon Tracker
 *
 * Reusable UI components used across multiple tabs to reduce code duplication
 * All components follow the app's design system with purple/slate theme
 *
 * Components:
 * - Tooltip: Hover-triggered info popups
 * - InfoTooltip: Standardized info icon with tooltip
 * - Modal: Full-screen overlay dialogs
 * - StatBlock: Grouped stat container
 * - StatItem: Key-value pair display
 * - AbilityScore: Ability score display
 * - Card: General purpose card
 * - Badge: Colored label badges
 * - Button: Styled buttons
 * - SectionHeader: Section headers
 * - EmptyState: Empty state display
 * - ProgressDots: Visual progress indicator
 * - TabButton: Tab navigation button
 * - SourceLink: External link to Archives of Nethys
 * - LoadingSpinner: Loading indicator
 */

/**
 * Tooltip Component
 * Shows detailed information on hover with improved accessibility
 *
 * @param {ReactNode} children - The element that triggers the tooltip
 * @param {ReactNode} content - The tooltip content (can be JSX)
 * @param {string} position - Tooltip position (right, left, top, bottom)
 */
export function Tooltip({ children, content, position = 'right' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    right: '-top-2 left-full ml-2',
    left: '-top-2 right-full mr-2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center gap-1"
        tabIndex={0}
        role="button"
        aria-label="Show tooltip"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 w-80 p-4 bg-slate-800 border border-purple-500 rounded-lg shadow-2xl text-sm ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="space-y-2">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * InfoTooltip Component
 * Standardized info icon with tooltip
 *
 * @param {ReactNode} content - The tooltip content
 * @param {string} position - Tooltip position
 */
export function InfoTooltip({ content, position = 'right' }) {
  return (
    <Tooltip content={content} position={position}>
      <Info className="w-4 h-4 text-purple-400 hover:text-purple-300 transition-colors" />
    </Tooltip>
  );
}

/**
 * StatBlock Component
 * Container for grouped stats with title and icon
 *
 * @param {string} title - The block title
 * @param {Component} icon - Lucide icon component
 * @param {ReactNode} children - The stat content
 */
export function StatBlock({ title, icon: Icon, children }) {
  return (
    <div className="bg-slate-800/50 border border-purple-900/50 rounded-xl p-6 backdrop-blur">
      <div className="flex items-center gap-3 mb-4 border-b border-purple-900/30 pb-3">
        <Icon className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-purple-200">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/**
 * StatItem Component
 * Single stat row with label and value
 *
 * @param {string} label - The stat label
 * @param {string|number} value - The stat value
 */
export function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-purple-100 font-semibold text-sm">{value}</span>
    </div>
  );
}

/**
 * AbilityScore Component
 * Displays an ability score with its modifier
 *
 * @param {string} ability - The ability abbreviation (STR, DEX, etc.)
 * @param {number} score - The ability score (10+)
 * @param {number} modifier - The ability modifier (+/-)
 * @param {boolean} primary - Whether this is a primary ability (highlighted)
 * @param {number} level - Current character level (unused but passed from parent)
 */
export function AbilityScore({ ability, score, modifier, primary, level }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border ${
      primary
        ? 'bg-purple-900/30 border-purple-600/50'
        : 'bg-slate-700/30 border-slate-600/50'
    }`}>
      <div className="text-xs text-slate-400 mb-1">{ability}</div>
      <div className="text-2xl font-bold text-purple-100">{score}</div>
      <div className={`text-sm font-semibold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {modifier >= 0 ? '+' : ''}{modifier}
      </div>
    </div>
  );
}

/**
 * Card Component
 * Generic card container with optional hover effect
 *
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Optional click handler
 */
export function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-slate-800/70 rounded-lg p-4 border border-slate-600 ${
        onClick ? 'cursor-pointer hover:border-purple-500/50' : ''
      } transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * Badge Component
 * Small colored label for tags, categories, etc.
 *
 * @param {string} children - Badge text
 * @param {string} variant - Color variant (primary, success, danger, warning)
 * @param {string} size - Size variant (sm, md)
 */
export function Badge({ children, variant = 'primary', size = 'md' }) {
  const variants = {
    primary: 'bg-purple-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white',
    neutral: 'bg-slate-600 text-slate-300'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span className={`rounded font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

/**
 * Button Component
 * Styled button with variants
 *
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} variant - Color variant (primary, secondary, success, danger)
 * @param {string} size - Size variant (sm, md, lg)
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-300',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded transition-all font-medium ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 active:scale-95'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * SectionHeader Component
 * Styled header for sections within tabs
 *
 * @param {string} title - Header title
 * @param {string} description - Optional description text
 * @param {ReactNode} actions - Optional action buttons/controls
 */
export function SectionHeader({ title, description, actions }) {
  return (
    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-purple-300">{title}</h3>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

/**
 * EmptyState Component
 * Display when there's no content to show
 *
 * @param {string} message - Message to display
 * @param {Component} icon - Optional icon component
 */
export function EmptyState({ message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      {Icon && <Icon className="w-12 h-12 mb-4 opacity-50" />}
      <p className="text-center">{message}</p>
    </div>
  );
}

/**
 * Modal Component
 * Full-screen modal dialog for detailed information
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {string} subtitle - Optional subtitle
 * @param {ReactNode} children - Modal content
 * @param {string} maxWidth - Max width variant (sm, md, lg, xl, 2xl, 4xl)
 */
export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = '2xl' }) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-slate-900 rounded-lg border border-purple-500 ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
            <h3 id="modal-title" className="text-xl font-bold text-purple-300">{title}</h3>
            {subtitle && (
              <div className="text-sm text-slate-400 mt-1">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-4"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * ProgressDots Component
 * Visual progress indicator (spell slots, item counts, etc.)
 *
 * @param {number} current - Current filled count
 * @param {number} max - Maximum count
 * @param {string} size - Dot size (sm, md, lg)
 * @param {string} color - Color variant (purple, green, blue)
 */
export function ProgressDots({ current, max, size = 'md', color = 'purple' }) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    purple: 'bg-purple-500 border-purple-500 shadow-purple-500/50',
    green: 'bg-green-500 border-green-500 shadow-green-500/50',
    blue: 'bg-blue-500 border-blue-500 shadow-blue-500/50'
  };

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, idx) => (
        <div
          key={idx}
          className={`${sizeClasses[size]} rounded-full border-2 transition-all ${
            idx < current
              ? `${colorClasses[color]} shadow-lg`
              : 'bg-slate-700 border-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * TabButton Component
 * Standardized tab navigation button
 *
 * @param {boolean} active - Whether tab is active
 * @param {Component} icon - Tab icon component
 * @param {string} label - Tab label
 * @param {function} onClick - Click handler
 */
export function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 rounded transition-all ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
    </button>
  );
}

/**
 * SourceLink Component
 * Standardized external link to Archives of Nethys
 *
 * @param {string} url - URL to link to
 * @param {string} text - Link text
 */
export function SourceLink({ url, text = 'View on Archives of Nethys' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors text-sm"
    >
      {text} <ExternalLink className="w-3 h-3" />
    </a>
  );
}

/**
 * LoadingSpinner Component
 * Loading indicator for async operations
 *
 * @param {string} size - Spinner size (sm, md, lg)
 */
export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeClasses[size]} border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin`}></div>
    </div>
  );
}

export default {
  Tooltip,
  InfoTooltip,
  Modal,
  StatBlock,
  StatItem,
  AbilityScore,
  Card,
  Badge,
  Button,
  SectionHeader,
  EmptyState,
  ProgressDots,
  TabButton,
  SourceLink,
  LoadingSpinner
};
