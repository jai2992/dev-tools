'use client';

import React, { ReactNode, forwardRef } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  className?: string;
  as?: React.ElementType;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  title, 
  subtitle,
  description, 
  actions, 
  variant = 'default',
  padding = 'md',
  hover = false,
  interactive = false,
  className = '',
  as: Component = 'div'
}, ref) => {
  // Base classes with modern design system integration
  const baseClasses = combineAnimationClasses(
    // Layout and positioning
    'relative overflow-hidden',
    // Modern typography
    'font-family-primary',
    // Smooth transitions with design system timing
    'transition-all duration-300 ease-out',
    // Focus state for interactive cards
    interactive ? 'focus:outline-none focus-glow cursor-pointer' : '',
    // Hover animations with micro-interactions
    hover || interactive ? 'hover-lift hover-glow' : '',
    // Prevent text selection for interactive cards
    interactive ? 'select-none' : ''
  ).trim();

  const variants = {
    default: [
      // Dark gray background using design system
      'bg-[var(--color-dark-gray)]',
      // Subtle border
      'border border-[var(--color-border-subtle)]',
      // Soft shadow for depth
      'shadow-md',
      // Hover effects with smooth transitions
      hover || interactive ? [
        'hover:bg-[var(--color-medium-gray)]',
        'hover:border-[var(--color-border)]',
        'hover:shadow-lg',
        'hover:shadow-white/5'
      ].join(' ') : ''
    ].join(' '),
    
    elevated: [
      // Elevated surface color
      'bg-[var(--color-medium-gray)]',
      // More prominent border
      'border border-[var(--color-border)]',
      // Enhanced shadow for elevation
      'shadow-lg shadow-black/20',
      // Strong hover effects
      hover || interactive ? [
        'hover:bg-[var(--color-light-gray)]',
        'hover:bg-opacity-20',
        'hover:shadow-xl',
        'hover:shadow-white/10',
        'hover:-translate-y-1',
        'hover:scale-[1.02]'
      ].join(' ') : ''
    ].join(' '),
    
    outlined: [
      // Transparent background
      'bg-transparent',
      // Prominent white border
      'border-2 border-[var(--color-border)]',
      // No shadow by default
      'shadow-none',
      // Hover effects with background fill
      hover || interactive ? [
        'hover:bg-[var(--color-dark-gray)]',
        'hover:border-[var(--color-text-primary)]',
        'hover:shadow-md',
        'hover:shadow-white/5'
      ].join(' ') : ''
    ].join(' ')
  };

  // Responsive padding options for different screen sizes
  const paddingClasses = {
    sm: [
      'p-3 sm:p-4',
      'rounded-lg'
    ].join(' '),
    md: [
      'p-4 sm:p-6',
      'rounded-xl'
    ].join(' '), 
    lg: [
      'p-6 sm:p-8',
      'rounded-2xl'
    ].join(' ')
  };

  const headerSpacing = {
    sm: 'mb-3',
    md: 'mb-4',
    lg: 'mb-6'
  };

  const titleSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-bold'
  };

  const hasHeader = title || subtitle || description || actions;

  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${paddingClasses[padding]} ${className}`}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive}
    >
      {/* Card Header */}
      {hasHeader && (
        <div className={`flex justify-between items-start ${headerSpacing[padding]}`}>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={`${titleSizes[padding]} text-[var(--color-text-primary)] mb-1 leading-tight`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 leading-relaxed">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Card Content */}
      <div className="text-[var(--color-text-primary)] leading-relaxed">
        {children}
      </div>
      
      {/* Interactive state indicator with smooth transitions */}
      {interactive && (
        <div className="absolute inset-0 rounded-[inherit] ring-0 ring-[var(--color-focus)] transition-all duration-200 focus-within:ring-2 focus-within:ring-opacity-50" />
      )}
      
      {/* Subtle gradient overlay for elevated variant */}
      {variant === 'elevated' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[inherit]" />
      )}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card;
