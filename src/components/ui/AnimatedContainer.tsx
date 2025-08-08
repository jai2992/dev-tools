'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { useIntersectionAnimation, useEnhancedIntersectionAnimation } from '@/hooks/useAnimation';

export interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in' | 'bounce-in';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ 
    children, 
    animation = 'fade-in', 
    delay = 0, 
    threshold = 0.1, 
    triggerOnce = true,
    className = '',
    ...props 
  }, ref) => {
    const { elementRef, isVisible } = useEnhancedIntersectionAnimation({
      threshold,
      triggerOnce,
    });

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          setShouldAnimate(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [isVisible, delay]);

    const animationClass = shouldAnimate ? `animate-${animation}` : '';
    const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${animationClass} ${delayClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';