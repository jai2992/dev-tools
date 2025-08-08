'use client';

import React, { useState } from 'react';
import { 
  useIntersectionAnimation, 
  useStaggeredAnimation, 
  useLoadingAnimation,
  useHoverAnimation,
  useFocusAnimation,
  usePageTransition,
  useEnhancedStaggeredAnimation,
  useSequenceAnimation,
  usePerformantAnimation,
  useAnimationState,
  AnimationType
} from '@/hooks/useAnimation';
import { AnimatedContainer } from './AnimatedContainer';
import { StaggeredList } from './StaggeredList';
import { ScrollReveal } from './ScrollReveal';

export const AnimationDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showLoading, isAnimating } = useLoadingAnimation(isLoading);
  const { elementRef: hoverRef, isHovered } = useHoverAnimation();
  const { elementRef: focusRef, isFocused } = useFocusAnimation();
  const { isEntering, isExiting, startExit } = usePageTransition();
  
  const {
    visibleItems,
    startAnimation: startStagger,
    resetAnimation: resetStagger,
    isItemVisible
  } = useStaggeredAnimation(5, 150, 200);

  const {
    currentStep,
    isPlaying,
    start: startSequence,
    reset: resetSequence
  } = useSequenceAnimation(['fade-in', 'slide-up', 'scale-in', 'bounce-in'], 500);

  const {
    isAnimating: stateAnimating,
    animationClass,
    startAnimation: startStateAnimation,
    stopAnimation: stopStateAnimation
  } = useAnimationState();

  const demoItems = [
    'First item with stagger',
    'Second item with stagger', 
    'Third item with stagger',
    'Fourth item with stagger',
    'Fifth item with stagger'
  ];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleStateAnimationDemo = () => {
    startStateAnimation('animate-bounce-in', 800);
  };

  return (
    <div className="p-8 space-y-8 bg-var(--color-background) text-var(--color-text-primary)">
      <h1 className="text-3xl font-bold mb-8">Animation System Demo</h1>

      {/* Basic Intersection Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Intersection Observer Animations</h2>
        
        <AnimatedContainer animation="fade-in" className="p-4 bg-var(--color-surface) rounded-lg">
          <p>This container fades in when it comes into view</p>
        </AnimatedContainer>

        <AnimatedContainer animation="slide-up" delay={200} className="p-4 bg-var(--color-surface) rounded-lg">
          <p>This container slides up with a 200ms delay</p>
        </AnimatedContainer>

        <AnimatedContainer animation="scale-in" className="p-4 bg-var(--color-surface) rounded-lg">
          <p>This container scales in when visible</p>
        </AnimatedContainer>
      </section>

      {/* Staggered Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Staggered Animations</h2>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={startStagger}
            className="px-4 py-2 bg-var(--color-text-primary) text-var(--color-text-inverse) rounded hover-lift active-scale"
          >
            Start Stagger
          </button>
          <button 
            onClick={resetStagger}
            className="px-4 py-2 bg-var(--color-surface) text-var(--color-text-primary) border border-var(--color-border) rounded hover-lift active-scale"
          >
            Reset Stagger
          </button>
        </div>

        <StaggeredList 
          animation="slide-up"
          itemDelay={100}
          className="space-y-2"
          itemClassName="p-3 bg-var(--color-surface) rounded"
        >
          {demoItems.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </StaggeredList>
      </section>

      {/* Interactive Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Animations</h2>
        
        <div 
          ref={hoverRef}
          className={`p-4 bg-var(--color-surface) rounded-lg hover-lift hover-glow transition-all duration-300 ${
            isHovered ? 'transform scale-105' : ''
          }`}
        >
          <p>Hover over this element to see hover animations</p>
          <p className="text-sm text-var(--color-text-secondary)">
            Hovered: {isHovered ? 'Yes' : 'No'}
          </p>
        </div>

        <input
          ref={focusRef}
          type="text"
          placeholder="Focus on this input to see focus animations"
          className={`w-full p-3 bg-var(--color-surface) border rounded-lg focus-glow transition-all duration-300 ${
            isFocused ? 'border-var(--color-text-primary)' : 'border-var(--color-border)'
          }`}
        />
      </section>

      {/* Loading Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Animations</h2>
        
        <button 
          onClick={handleLoadingDemo}
          className="px-4 py-2 bg-var(--color-text-primary) text-var(--color-text-inverse) rounded hover-lift active-scale"
        >
          Demo Loading Animation
        </button>

        {showLoading && (
          <div className="p-4 bg-var(--color-surface) rounded-lg">
            <div className="flex items-center gap-3">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="loading-skeleton h-4 rounded"></div>
              <div className="loading-skeleton h-4 w-3/4 rounded"></div>
              <div className="loading-skeleton h-4 w-1/2 rounded"></div>
            </div>
          </div>
        )}
      </section>

      {/* Sequence Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sequence Animations</h2>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={startSequence}
            disabled={isPlaying}
            className="px-4 py-2 bg-var(--color-text-primary) text-var(--color-text-inverse) rounded hover-lift active-scale disabled:opacity-50"
          >
            Start Sequence
          </button>
          <button 
            onClick={resetSequence}
            className="px-4 py-2 bg-var(--color-surface) text-var(--color-text-primary) border border-var(--color-border) rounded hover-lift active-scale"
          >
            Reset Sequence
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['fade-in', 'slide-up', 'scale-in', 'bounce-in'].map((animation, index) => (
            <div
              key={animation}
              className={`p-4 bg-var(--color-surface) rounded-lg text-center ${
                currentStep === index ? `animate-${animation}` : ''
              } ${currentStep > index ? 'opacity-100' : 'opacity-50'}`}
            >
              <p className="text-sm">{animation}</p>
              <p className="text-xs text-var(--color-text-secondary)">
                Step {index + 1}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Animation State Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Animation State Management</h2>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={handleStateAnimationDemo}
            disabled={stateAnimating}
            className="px-4 py-2 bg-var(--color-text-primary) text-var(--color-text-inverse) rounded hover-lift active-scale disabled:opacity-50"
          >
            Trigger Animation
          </button>
          <button 
            onClick={stopStateAnimation}
            className="px-4 py-2 bg-var(--color-surface) text-var(--color-text-primary) border border-var(--color-border) rounded hover-lift active-scale"
          >
            Stop Animation
          </button>
        </div>

        <div className={`p-4 bg-var(--color-surface) rounded-lg ${animationClass}`}>
          <p>Animation State: {stateAnimating ? 'Animating' : 'Idle'}</p>
          <p className="text-sm text-var(--color-text-secondary)">
            Current Class: {animationClass || 'None'}
          </p>
        </div>
      </section>

      {/* Scroll Reveal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Scroll Reveal</h2>
        
        <div className="h-96 overflow-y-auto bg-var(--color-surface) rounded-lg p-4">
          <p className="mb-4">Scroll down to see elements reveal themselves:</p>
          
          {Array.from({ length: 10 }, (_, i) => (
            <ScrollReveal key={i} delay={i * 100} className="mb-4">
              <div className="p-3 bg-var(--color-surface-elevated) rounded">
                <p>Scroll reveal item {i + 1}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CSS Animation Classes Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CSS Animation Classes</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            'hover-lift',
            'hover-scale', 
            'hover-glow',
            'hover-rotate',
            'active-scale',
            'focus-glow',
            'click-ripple',
            'loading-pulse'
          ].map((className) => (
            <div
              key={className}
              className={`p-3 bg-var(--color-surface) rounded text-center cursor-pointer ${className}`}
              tabIndex={0}
            >
              <p className="text-sm">.{className}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnimationDemo;