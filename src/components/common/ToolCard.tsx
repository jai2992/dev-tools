'use client';

import React from 'react';
import Link from 'next/link';
import { combineAnimationClasses } from '../../utils/animations';

export interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  href,
  icon,
  category,
  isNew = false,
  isPopular = false,
  isFeatured = false,
  variant = 'default',
  className = ''
}) => {
  // Variant configurations
  const variantConfig = {
    default: {
      container: 'p-6',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      descriptionLines: 'line-clamp-3'
    },
    compact: {
      container: 'p-4',
      iconSize: 'w-10 h-10',
      titleSize: 'text-base',
      descriptionLines: 'line-clamp-2'
    },
    featured: {
      container: 'p-8',
      iconSize: 'w-16 h-16',
      titleSize: 'text-xl',
      descriptionLines: 'line-clamp-4'
    }
  };

  const config = variantConfig[variant];

  // Base card classes with modern design system
  const cardClasses = combineAnimationClasses(
    'group relative',
    'bg-[var(--color-surface)] border border-[var(--color-border)]',
    'rounded-xl overflow-hidden',
    'hover:border-[var(--color-text-primary)] hover:shadow-lg hover:shadow-black/20',
    'transition-all duration-300 ease-out',
    'cursor-pointer',
    'animate-fade-in',
    isFeatured && 'ring-1 ring-[var(--color-text-primary)]/20',
    className
  ).trim();

  const contentClasses = combineAnimationClasses(
    config.container,
    'h-full flex flex-col'
  ).trim();

  return (
    <Link href={href} className="block h-full">
      <article className={cardClasses}>
        {/* Badges */}
        {(isNew || isPopular || isFeatured) && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            {isNew && (
              <span className={combineAnimationClasses(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                'bg-green-500/20 text-green-400 border border-green-500/30',
                'animate-pulse'
              )}>
                New
              </span>
            )}
            {isPopular && (
              <span className={combineAnimationClasses(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              )}>
                Popular
              </span>
            )}
            {isFeatured && (
              <span className={combineAnimationClasses(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              )}>
                Featured
              </span>
            )}
          </div>
        )}

        <div className={contentClasses}>
          {/* Icon */}
          {icon && (
            <div className={combineAnimationClasses(
              'flex items-center justify-center mb-4',
              config.iconSize,
              'bg-[var(--color-background)] rounded-lg',
              'text-[var(--color-text-primary)]',
              'group-hover:scale-110 transition-transform duration-300'
            )}>
              {icon}
            </div>
          )}

          {/* Category */}
          {category && (
            <div className="mb-3">
              <span className={combineAnimationClasses(
                'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                'bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)]',
                'border border-[var(--color-text-secondary)]/20'
              )}>
                {category}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Title */}
            <h3 className={combineAnimationClasses(
              config.titleSize,
              'font-semibold text-[var(--color-text-primary)] mb-2',
              'group-hover:text-white transition-colors duration-200',
              'leading-tight'
            )}>
              {title}
            </h3>

            {/* Description */}
            <p className={combineAnimationClasses(
              'text-sm text-[var(--color-text-secondary)] leading-relaxed',
              'group-hover:text-gray-300 transition-colors duration-200',
              config.descriptionLines,
              'flex-1'
            )}>
              {description}
            </p>
          </div>

          {/* Hover indicator */}
          <div className={combineAnimationClasses(
            'flex items-center justify-between mt-4 pt-4',
            'border-t border-[var(--color-border)]',
            'group-hover:border-[var(--color-text-secondary)]/30 transition-colors duration-200'
          )}>
            <span className={combineAnimationClasses(
              'text-xs font-medium text-[var(--color-text-secondary)]',
              'group-hover:text-[var(--color-text-primary)] transition-colors duration-200'
            )}>
              Try it now
            </span>
            
            <div className={combineAnimationClasses(
              'opacity-0 group-hover:opacity-100 transition-all duration-200',
              'transform translate-x-0 group-hover:translate-x-1'
            )}>
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
            </div>
          </div>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className={combineAnimationClasses(
          'absolute inset-0 opacity-0 group-hover:opacity-5',
          'bg-gradient-to-br from-white to-transparent',
          'transition-opacity duration-300 pointer-events-none'
        )} />
      </article>
    </Link>
  );
};

export default ToolCard;