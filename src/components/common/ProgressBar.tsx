'use client';

import { useState, useEffect } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface ProgressBarProps {
  progress: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  showValue = true,
  size = 'md',
  variant = 'default',
  animated = true,
  striped = false,
  className = ''
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animate progress on mount and changes
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setDisplayProgress(Math.min(100, Math.max(0, progress)));
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-[var(--color-text-primary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]'
  };

  const containerClasses = combineAnimationClasses(
    'w-full',
    isVisible ? 'animate-fade-in' : 'opacity-0',
    className
  ).trim();

  const trackClasses = combineAnimationClasses(
    'w-full bg-[var(--color-surface-elevated)] rounded-full overflow-hidden',
    sizeClasses[size]
  ).trim();

  const barClasses = combineAnimationClasses(
    'h-full rounded-full',
    'transition-all duration-700 ease-out',
    variantClasses[variant],
    striped ? 'bg-stripes' : '',
    animated && striped ? 'animate-stripes' : ''
  ).trim();

  const labelClasses = combineAnimationClasses(
    'flex justify-between items-center text-sm mb-2'
  ).trim();

  return (
    <div className={containerClasses} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {(label || showValue) && (
        <div className={labelClasses}>
          {label && (
            <span className="text-[var(--color-text-primary)] font-medium">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-[var(--color-text-secondary)] font-mono text-xs">
              {Math.round(displayProgress)}%
            </span>
          )}
        </div>
      )}
      <div className={trackClasses}>
        <div
          className={barClasses}
          style={{ width: `${displayProgress}%` }}
          aria-label={`Progress: ${Math.round(displayProgress)}%`}
        >
          {/* Animated shine effect */}
          {animated && !striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent to-transparent opacity-20 animate-shine" />
          )}
        </div>
      </div>
    </div>
  );
}

// Circular progress component
export function CircularProgress({
  progress,
  size = 60,
  strokeWidth = 4,
  showValue = true,
  variant = 'default',
  className = ''
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(normalizedProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [normalizedProgress]);

  const variantColors = {
    default: 'var(--color-text-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)'
  };

  return (
    <div className={combineAnimationClasses('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 animate-fade-in"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-surface-elevated)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-mono font-medium text-[var(--color-text-primary)]">
          {Math.round(displayProgress)}%
        </span>
      )}
    </div>
  );
}
