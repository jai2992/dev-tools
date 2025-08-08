// Animation utility functions with enhanced TypeScript support

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface AnimationSequenceStep {
  element: HTMLElement;
  animation: string;
  config?: AnimationConfig;
}

export interface AnimationChain {
  steps: AnimationSequenceStep[];
  onComplete?: () => void;
  onStepComplete?: (stepIndex: number) => void;
}

export type EasingFunction = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out' 
  | 'ease-in-out'
  | 'snappy'
  | 'smooth'
  | 'spring'
  | 'elastic'
  | 'back-out'
  | 'back-in';

export type AnimationDirection = 'in' | 'out' | 'in-out';
export type AnimationAxis = 'x' | 'y' | 'z' | 'xy' | 'xyz';

export interface TransformAnimationConfig extends AnimationConfig {
  from?: {
    x?: number;
    y?: number;
    z?: number;
    scale?: number;
    rotate?: number;
    opacity?: number;
  };
  to?: {
    x?: number;
    y?: number;
    z?: number;
    scale?: number;
    rotate?: number;
    opacity?: number;
  };
}

// Create a CSS animation with custom properties
export function createAnimation(
  name: string,
  config: AnimationConfig = {}
): string {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    fill = 'forwards'
  } = config;

  return `${name} ${duration}ms ${easing} ${delay}ms ${fill}`;
}

// Generate stagger delays for multiple elements
export function generateStaggerDelays(
  count: number,
  baseDelay = 0,
  increment = 100
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + (i * increment));
}

// Check if animations should be disabled
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get safe animation duration (0 if reduced motion is preferred)
export function getSafeAnimationDuration(duration: number): number {
  return shouldReduceMotion() ? 0 : duration;
}

// Animation class builders
export const animationClasses = {
  fadeIn: (delay?: number) => 
    `animate-fade-in${delay ? ` animate-delay-${delay}` : ''}`,
  
  slideUp: (delay?: number) => 
    `animate-slide-up${delay ? ` animate-delay-${delay}` : ''}`,
  
  slideDown: (delay?: number) => 
    `animate-slide-down${delay ? ` animate-delay-${delay}` : ''}`,
  
  slideLeft: (delay?: number) => 
    `animate-slide-left${delay ? ` animate-delay-${delay}` : ''}`,
  
  slideRight: (delay?: number) => 
    `animate-slide-right${delay ? ` animate-delay-${delay}` : ''}`,
  
  scaleIn: (delay?: number) => 
    `animate-scale-in${delay ? ` animate-delay-${delay}` : ''}`,
  
  bounceIn: (delay?: number) => 
    `animate-bounce-in${delay ? ` animate-delay-${delay}` : ''}`,
  
  stagger: (index: number, maxStagger = 6) => 
    `animate-stagger-${Math.min(index + 1, maxStagger)}`
};

// Hover effect classes
export const hoverClasses = {
  lift: 'hover-lift',
  scale: 'hover-scale',
  glow: 'hover-glow',
  rotate: 'hover-rotate'
};

// Interactive effect classes
export const interactiveClasses = {
  activeScale: 'active-scale',
  focusGlow: 'focus-glow',
  clickRipple: 'click-ripple'
};

// Loading state classes
export const loadingClasses = {
  skeleton: 'loading-skeleton',
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  pulse: 'loading-pulse'
};

// Combine multiple animation classes
export function combineAnimationClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Create a staggered animation sequence
export function createStaggeredSequence(
  elements: HTMLElement[],
  animationClass: string,
  delay = 100
): void {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
}

// Remove animation classes after completion
export function removeAnimationClasses(
  element: HTMLElement,
  classes: string[],
  delay = 0
): void {
  setTimeout(() => {
    classes.forEach(className => {
      element.classList.remove(className);
    });
  }, delay);
}

// Animation event listeners
export function onAnimationEnd(
  element: HTMLElement,
  callback: () => void
): () => void {
  const handleAnimationEnd = () => {
    callback();
    element.removeEventListener('animationend', handleAnimationEnd);
  };

  element.addEventListener('animationend', handleAnimationEnd);

  // Return cleanup function
  return () => {
    element.removeEventListener('animationend', handleAnimationEnd);
  };
}

// Transition event listeners
export function onTransitionEnd(
  element: HTMLElement,
  callback: () => void,
  property?: string
): () => void {
  const handleTransitionEnd = (event: TransitionEvent) => {
    if (!property || event.propertyName === property) {
      callback();
      element.removeEventListener('transitionend', handleTransitionEnd);
    }
  };

  element.addEventListener('transitionend', handleTransitionEnd);

  // Return cleanup function
  return () => {
    element.removeEventListener('transitionend', handleTransitionEnd);
  };
}