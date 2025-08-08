'use client';

import { useEffect, useState, ReactNode } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  variant?: 'default' | 'minimal' | 'hero';
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  variant = 'default',
  size = 'md',
  showTitle = true,
  showDescription = true,
  className = ''
}: PageHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Modern design system integration with black background and white text
  const baseClasses = combineAnimationClasses(
    // Layout and positioning
    'w-full relative overflow-hidden',
    // Modern black background instead of gradients
    'bg-black',
    // Modern typography
    'font-family-primary',
    // Smooth entrance animation
    'transition-all duration-500 ease-out',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    // Custom classes
    className
  ).trim();

  // Variant-specific styling
  const variantClasses = {
    default: 'py-8 sm:py-12',
    minimal: 'py-6 sm:py-8',
    hero: 'py-12 sm:py-16 lg:py-20'
  };

  // Size-specific styling
  const sizeClasses = {
    sm: {
      title: 'text-2xl sm:text-3xl',
      description: 'text-base sm:text-lg',
      spacing: 'space-y-3'
    },
    md: {
      title: 'text-3xl sm:text-4xl lg:text-5xl',
      description: 'text-lg sm:text-xl',
      spacing: 'space-y-4'
    },
    lg: {
      title: 'text-4xl sm:text-5xl lg:text-6xl',
      description: 'text-xl sm:text-2xl',
      spacing: 'space-y-6'
    }
  };

  return (
    <header className={`${baseClasses} ${variantClasses[variant]}`}>
      {/* Subtle background pattern for hero variant */}
      {variant === 'hero' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={sizeClasses[size].spacing}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav 
              aria-label="Breadcrumb"
              className="animate-fade-in animate-delay-100"
            >
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 mx-2 text-[var(--color-text-secondary)] transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    {item.href && !item.isActive ? (
                      <a
                        href={item.href}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 hover-lift"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span
                        className={
                          item.isActive
                            ? 'text-[var(--color-text-primary)] font-medium'
                            : 'text-[var(--color-text-secondary)]'
                        }
                        aria-current={item.isActive ? 'page' : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Title and Description */}
            <div className="flex-1 min-w-0">
              {showTitle && (
                <h1 className={`
                  ${sizeClasses[size].title} 
                  font-bold text-white leading-tight mb-3
                  animate-slide-up animate-delay-200
                `}>
                  {title}
                </h1>
              )}
              {showDescription && description && (
                <p className={`
                  ${sizeClasses[size].description}
                  text-[var(--color-text-secondary)] leading-relaxed max-w-4xl
                  animate-slide-up animate-delay-300
                `}>
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex-shrink-0 animate-fade-in animate-delay-400">
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom border for default variant */}
      {variant === 'default' && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </header>
  );
}
