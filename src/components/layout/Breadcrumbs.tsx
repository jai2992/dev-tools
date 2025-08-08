'use client';

import React from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'arrow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = 'chevron',
  size = 'md',
  className = ''
}) => {
  if (!items || items.length === 0) return null;

  const separatorIcons = {
    chevron: (
      <svg
        className="w-4 h-4 text-[var(--color-text-secondary)]"
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
    ),
    slash: (
      <span className="text-[var(--color-text-secondary)]">/</span>
    ),
    arrow: (
      <svg
        className="w-4 h-4 text-[var(--color-text-secondary)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    )
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={combineAnimationClasses(
        'flex items-center space-x-2',
        sizeClasses[size],
        className
      )}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Separator */}
            {index > 0 && (
              <span className="mx-2 flex-shrink-0">
                {separatorIcons[separator]}
              </span>
            )}

            {/* Breadcrumb Item */}
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Icon */}
              {item.icon && (
                <span className="flex-shrink-0 w-4 h-4 text-[var(--color-text-secondary)]">
                  {item.icon}
                </span>
              )}

              {/* Link or Text */}
              {item.href && !item.isActive ? (
                <a
                  href={item.href}
                  className={combineAnimationClasses(
                    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                    'transition-colors duration-200 hover-lift',
                    'truncate focus:outline-none focus-glow rounded px-1 py-0.5'
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={combineAnimationClasses(
                    'truncate',
                    item.isActive
                      ? 'text-[var(--color-text-primary)] font-medium'
                      : 'text-[var(--color-text-secondary)]'
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;