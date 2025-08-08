'use client';

import React from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
  animation = 'pulse'
}) => {
  const baseClasses = combineAnimationClasses(
    'bg-[var(--color-surface-elevated)]',
    animation === 'pulse' ? 'loading-pulse' : '',
    animation === 'wave' ? 'loading-skeleton' : '',
    className
  ).trim();

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'rectangular':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const getInlineStyles = () => {
    const styles: React.CSSProperties = {};
    if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
    return styles;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...getInlineStyles(),
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()}`}
      style={getInlineStyles()}
    />
  );
};

export default Skeleton;