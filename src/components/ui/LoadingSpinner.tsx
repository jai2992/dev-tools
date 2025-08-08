'use client';

import React from 'react';
import { combineAnimationClasses } from '@/utils/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  color = 'current',
  speed = 'normal',
  className = '',
  label = 'Loading'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-[var(--color-text-primary)]',
    secondary: 'text-[var(--color-text-secondary)]',
    white: 'text-white',
    current: 'text-current'
  };

  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  const baseClasses = combineAnimationClasses(
    'inline-block',
    colorClasses[color],
    className
  );

  if (variant === 'dots') {
    const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4';
    
    return (
      <div 
        className={`${baseClasses} flex items-center justify-center space-x-1`}
        role="status"
        aria-label={label}
      >
        <div className={`${dotSize} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSize} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${dotSize} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        <span className="sr-only">{label}...</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div 
        className={`${baseClasses} ${sizeClasses[size]} bg-current rounded animate-pulse`}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}...</span>
      </div>
    );
  }

  if (variant === 'bars') {
    const barHeight = size === 'sm' ? 'h-3' : size === 'md' ? 'h-4' : size === 'lg' ? 'h-6' : 'h-8';
    
    return (
      <div 
        className={`${baseClasses} flex items-end space-x-1`}
        role="status"
        aria-label={label}
      >
        <div className={`w-1 ${barHeight} bg-current animate-pulse`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-1 ${barHeight} bg-current animate-pulse`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-1 ${barHeight} bg-current animate-pulse`} style={{ animationDelay: '300ms' }}></div>
        <div className={`w-1 ${barHeight} bg-current animate-pulse`} style={{ animationDelay: '450ms' }}></div>
        <span className="sr-only">{label}...</span>
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div 
        className={`${baseClasses} ${sizeClasses[size]} ${speedClasses[speed]} rounded-full border-2 border-current border-t-transparent`}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}...</span>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${speedClasses[speed]} rounded-full border-2 border-solid border-current border-r-transparent`}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}...</span>
    </div>
  );
}
