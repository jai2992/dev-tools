'use client';

import React from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface ProgressIndicatorProps {
  value?: number; // 0-100
  variant?: 'linear' | 'circular' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value = 0,
  variant = 'linear',
  size = 'md',
  showLabel = false,
  label,
  indeterminate = false,
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    circular: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    },
    dots: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3'
    }
  };

  if (variant === 'linear') {
    return (
      <div className={combineAnimationClasses('w-full', className)}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {label || 'Progress'}
            </span>
            {!indeterminate && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}
        
        <div
          className={combineAnimationClasses(
            'w-full bg-[var(--color-surface-elevated)] rounded-full overflow-hidden',
            sizeClasses.linear[size]
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={combineAnimationClasses(
              'h-full bg-[var(--color-text-primary)] transition-all duration-300 ease-out',
              indeterminate ? 'animate-pulse' : ''
            )}
            style={{
              width: indeterminate ? '100%' : `${clampedValue}%`,
              transform: indeterminate ? 'translateX(-100%)' : 'none',
              animation: indeterminate ? 'shimmer 1.5s infinite' : undefined
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'circular') {
    const radius = size === 'sm' ? 14 : size === 'md' ? 20 : 28;
    const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    return (
      <div className={combineAnimationClasses('relative inline-flex items-center justify-center', className)}>
        <svg
          className={combineAnimationClasses(
            sizeClasses.circular[size],
            indeterminate ? 'animate-spin' : ''
          )}
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          {/* Background Circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="var(--color-surface-elevated)"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress Circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="var(--color-text-primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        
        {showLabel && !indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-[var(--color-text-primary)]">
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    const dotCount = 3;
    
    return (
      <div className={combineAnimationClasses('flex items-center', sizeClasses.dots[size], className)}>
        {Array.from({ length: dotCount }, (_, index) => (
          <div
            key={index}
            className={combineAnimationClasses(
              'rounded-full bg-[var(--color-text-primary)]',
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4',
              'animate-pulse'
            )}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default ProgressIndicator;