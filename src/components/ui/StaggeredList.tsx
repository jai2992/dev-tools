'use client';

import React, { useEffect, useState } from 'react';
import { useEnhancedStaggeredAnimation } from '@/hooks/useAnimation';

export interface StaggeredListProps {
  children: React.ReactNode[];
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in';
  itemDelay?: number;
  startDelay?: number;
  autoStart?: boolean;
  className?: string;
  itemClassName?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  animation = 'slide-up',
  itemDelay = 100,
  startDelay = 0,
  autoStart = true,
  className = '',
  itemClassName = ''
}) => {
  const {
    visibleItems,
    isAnimating,
    startAnimation,
    reset,
    isItemVisible
  } = useEnhancedStaggeredAnimation(children.length, {
    itemDelay,
    startDelay
  });

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
  }, [autoStart, startAnimation]);

  return (
    <div className={className}>
      {children.map((child, index) => {
        const isVisible = isItemVisible(index);
        const animationClass = isVisible ? `animate-${animation}` : '';
        
        return (
          <div
            key={index}
            className={`${animationClass} ${itemClassName}`.trim()}
            style={{
              opacity: isVisible ? 1 : 0,
              animationFillMode: 'both'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StaggeredList;