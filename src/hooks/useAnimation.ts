import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced TypeScript interfaces for animation hooks
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface IntersectionAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skipInitialAnimation?: boolean;
}

export interface StaggerAnimationOptions {
  startDelay?: number;
  itemDelay?: number;
  maxItems?: number;
  resetOnComplete?: boolean;
}

export type AnimationType = 
  | 'fade-in' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'scale-in' 
  | 'bounce-in' 
  | 'zoom-in' 
  | 'rotate-in'
  | 'fade-in-fast'
  | 'fade-in-slow'
  | 'slide-up-spring'
  | 'slide-up-elastic'
  | 'scale-in-bounce';

export type AnimationTiming = 'instant' | 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';

// Hook for intersection observer animations
export function useIntersectionAnimation(
  threshold = 0.1,
  rootMargin = '0px'
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasAnimated]);

  return { elementRef, isVisible, hasAnimated };
}

// Hook for staggered animations
export function useStaggeredAnimation(
  itemCount: number,
  delay = 100,
  startDelay = 0
) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isStarted, setIsStarted] = useState(false);

  const startAnimation = () => {
    if (isStarted) return;
    setIsStarted(true);

    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, i]));
      }, startDelay + (i * delay));
    }
  };

  const resetAnimation = () => {
    setVisibleItems(new Set());
    setIsStarted(false);
  };

  return {
    visibleItems,
    startAnimation,
    resetAnimation,
    isItemVisible: (index: number) => visibleItems.has(index)
  };
}

// Hook for loading states with animations
export function useLoadingAnimation(isLoading: boolean, minDuration = 500) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
      setIsAnimating(true);
    } else {
      // Ensure minimum loading duration for smooth UX
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setShowLoading(false), 200); // Fade out duration
      }, minDuration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, minDuration]);

  return { showLoading, isAnimating };
}

// Hook for hover animations
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { elementRef, isHovered };
}

// Hook for focus animations
export function useFocusAnimation() {
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { elementRef, isFocused };
}

// Hook for page transitions
export function usePageTransition() {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start enter animation
    const enterTimeout = setTimeout(() => {
      setIsEntering(false);
    }, 100);

    return () => clearTimeout(enterTimeout);
  }, []);

  const startExit = (callback?: () => void) => {
    setIsExiting(true);
    setTimeout(() => {
      callback?.();
    }, 300); // Exit animation duration
  };

  return {
    isEntering,
    isExiting,
    startExit,
    className: isEntering ? 'page-enter' : isExiting ? 'page-exit' : ''
  };
}

// Utility function to check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility function to get animation duration based on user preference
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

// Enhanced intersection observer hook with performance optimization
export function useEnhancedIntersectionAnimation(
  options: IntersectionAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    skipInitialAnimation = false
  } = options;

  const [isVisible, setIsVisible] = useState(skipInitialAnimation);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (triggerOnce && hasTriggered)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observerRef.current = null;
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  const reset = useCallback(() => {
    setIsVisible(skipInitialAnimation);
    setHasTriggered(false);
  }, [skipInitialAnimation]);

  return { elementRef, isVisible, hasTriggered, reset };
}

// Enhanced staggered animation hook with better control
export function useEnhancedStaggeredAnimation(
  itemCount: number,
  options: StaggerAnimationOptions = {}
) {
  const {
    startDelay = 0,
    itemDelay = 100,
    maxItems = Infinity,
    resetOnComplete = false
  } = options;

  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const actualItemCount = Math.min(itemCount, maxItems);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsComplete(false);
    setVisibleItems(new Set());

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    for (let i = 0; i < actualItemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => {
          const newSet = new Set([...prev, i]);
          if (newSet.size === actualItemCount) {
            setIsAnimating(false);
            setIsComplete(true);
            if (resetOnComplete) {
              setTimeout(() => reset(), 1000);
            }
          }
          return newSet;
        });
      }, startDelay + (i * itemDelay));
      
      timeoutsRef.current.push(timeout);
    }
  }, [actualItemCount, startDelay, itemDelay, isAnimating, resetOnComplete]);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleItems(new Set());
    setIsAnimating(false);
    setIsComplete(false);
  }, []);

  const pause = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return {
    visibleItems,
    isAnimating,
    isComplete,
    startAnimation,
    reset,
    pause,
    isItemVisible: useCallback((index: number) => visibleItems.has(index), [visibleItems]),
    progress: visibleItems.size / actualItemCount
  };
}

// Hook for sequence animations
export function useSequenceAnimation(steps: AnimationType[], stepDelay = 300) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());

    const playStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setIsPlaying(false);
        return;
      }

      setCurrentStep(stepIndex);
      setCompletedSteps(prev => new Set([...prev, stepIndex]));

      timeoutRef.current = setTimeout(() => {
        playStep(stepIndex + 1);
      }, stepDelay);
    };

    playStep(0);
  }, [steps, stepDelay, isPlaying]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentStep(-1);
    setIsPlaying(false);
    setCompletedSteps(new Set());
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    isPlaying,
    completedSteps,
    start,
    reset,
    isStepCompleted: useCallback((index: number) => completedSteps.has(index), [completedSteps]),
    getCurrentAnimation: () => currentStep >= 0 ? steps[currentStep] : null
  };
}

// Hook for performance-aware animations
export function usePerformantAnimation(animationType: AnimationType) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const elementRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  // Check performance and user preferences
  const checkPerformanceConstraints = useCallback(() => {
    if (prefersReducedMotion()) {
      setShouldAnimate(false);
      return;
    }

    // Check for low-end devices or battery saving mode
    if ('deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory: number }).deviceMemory < 2) {
      setShouldAnimate(false);
      return;
    }

    // Check battery status if available
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }).getBattery?.().then((battery: { level: number; charging: boolean }) => {
        if (battery.level < 0.2 || battery.charging === false) {
          setShouldAnimate(false);
        }
      }).catch(() => {
        // Battery API not supported, assume we can animate
      });
    }
  }, []);

  useEffect(() => {
    checkPerformanceConstraints();
  }, [checkPerformanceConstraints]);

  const trigger = useCallback(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }

    // Use RAF for smooth animations
    rafRef.current = requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [shouldAnimate]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const animationClass = useMemo(() => {
    if (!isVisible || !shouldAnimate) return '';
    return `animate-${animationType}`;
  }, [isVisible, shouldAnimate, animationType]);

  return {
    elementRef,
    isVisible,
    shouldAnimate,
    trigger,
    animationClass,
    reset: () => setIsVisible(false)
  };
}

// Animation class generator
export function getAnimationClasses(
  baseAnimation: string,
  delay?: number,
  isVisible = true
): string {
  if (!isVisible) return '';
  
  const classes = [baseAnimation];
  
  if (delay !== undefined) {
    classes.push(`animate-stagger-${Math.min(delay, 6)}`);
  }
  
  return classes.join(' ');
}

// Enhanced animation class generator with timing control
export function createAnimationClass(
  animation: AnimationType,
  timing: AnimationTiming = 'normal',
  delay?: number
): string {
  const baseClass = `animate-${animation}`;
  const timingClass = timing !== 'normal' ? `-${timing}` : '';
  const delayClass = delay ? ` animate-delay-${delay}` : '';
  
  return `${baseClass}${timingClass}${delayClass}`.trim();
}

// Utility to get CSS custom property for timing
export function getTimingVariable(timing: AnimationTiming): string {
  switch (timing) {
    case 'instant': return 'var(--duration-fast)';
    case 'fast': return 'var(--duration-fast)';
    case 'normal': return 'var(--duration-normal)';
    case 'slow': return 'var(--duration-slow)';
    case 'slower': return 'var(--duration-slower)';
    case 'slowest': return 'var(--duration-slower)';
    default: return 'var(--duration-normal)';
  }
}

// Hook for managing animation states with proper cleanup
export function useAnimationState(initialState = false) {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const [animationClass, setAnimationClass] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback((className: string, duration = 300) => {
    setIsAnimating(true);
    setAnimationClass(className);
    
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setAnimationClass('');
    }, duration);
  }, []);

  const stopAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAnimating(false);
    setAnimationClass('');
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isAnimating,
    animationClass,
    startAnimation,
    stopAnimation
  };
}
