'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { combineAnimationClasses } from '../../utils/animations';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '', 
  children, 
  disabled,
  ...props 
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);

  // Base classes with modern design system integration
  const baseClasses = combineAnimationClasses(
    // Layout and typography using design system
    'inline-flex items-center justify-center gap-2 font-medium text-center',
    // Modern typography from design system
    'font-family-primary',
    // Border and shape with design system radius
    'border rounded-lg',
    // Focus and accessibility with design system
    'focus-glow focus:outline-none',
    // Smooth transitions with design system timing
    'transition-all',
    // Interactive micro-animations
    'hover-lift active-scale click-ripple',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none',
    // Full width option
    fullWidth ? 'w-full' : '',
    // Prevent text selection
    'select-none'
  ).trim();
  
  const variants = {
    primary: [
      // Modern white background with black text (inverted from typical dark theme)
      'bg-white text-black',
      // Subtle shadow for depth
      'shadow-sm',
      // Hover states with micro-animations
      'hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]',
      // Active states with satisfying feedback
      'active:bg-gray-100 active:scale-[0.98]',
      // Focus states with white glow
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-50',
      // Clean border
      'border-white',
      // Loading state
      'data-[loading=true]:cursor-wait'
    ].join(' '),
    
    secondary: [
      // Dark surface with white text and border
      'bg-transparent text-white',
      // Clean border using design system colors
      'border-white border-opacity-30',
      // Hover states
      'hover:bg-white hover:bg-opacity-10 hover:border-opacity-50',
      // Active states
      'active:bg-white active:bg-opacity-20',
      // Focus states
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-30',
      // Loading state
      'data-[loading=true]:cursor-wait'
    ].join(' '),
    
    ghost: [
      // Completely transparent with white text
      'bg-transparent text-white border-transparent',
      // Hover states with subtle background
      'hover:bg-white hover:bg-opacity-5',
      // Active states
      'active:bg-white active:bg-opacity-10',
      // Focus states
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-20',
      // Loading state
      'data-[loading=true]:cursor-wait'
    ].join(' '),
    
    danger: [
      // Red variant for destructive actions
      'bg-red-600 text-white',
      // Border matching background
      'border-red-600',
      // Hover states
      'hover:bg-red-700 hover:border-red-700 hover:shadow-md',
      // Active states
      'active:bg-red-800 active:border-red-800',
      // Focus states
      'focus:shadow-glow focus:ring-2 focus:ring-red-400 focus:ring-opacity-50',
      // Loading state
      'data-[loading=true]:cursor-wait'
    ].join(' ')
  };

  const sizes = {
    sm: [
      'px-3 py-1.5',
      'text-sm',
      'min-h-[32px]',
      'gap-1.5'
    ].join(' '),
    md: [
      'px-4 py-2',
      'text-base',
      'min-h-[40px]',
      'gap-2'
    ].join(' '),
    lg: [
      'px-6 py-3',
      'text-lg',
      'min-h-[48px]',
      'gap-2.5'
    ].join(' ')
  };

  const isDisabled = disabled || isLoading;
  const buttonText = isLoading && loadingText ? loadingText : children;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-loading={isLoading}
      data-variant={variant}
      data-size={size}
      aria-pressed={isPressed}
      aria-busy={isLoading}
      {...props}
    >
      {/* Left icon */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="inline-flex items-center justify-center shrink-0">
          {icon}
        </span>
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <LoadingSpinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          variant="spinner"
          className="shrink-0"
        />
      )}
      
      {/* Button text with smooth opacity transition */}
      <span className={`transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
        {buttonText}
      </span>
      
      {/* Right icon */}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="inline-flex items-center justify-center shrink-0">
          {icon}
        </span>
      )}
      
      {/* Screen reader loading text */}
      {isLoading && (
        <span className="sr-only">
          {loadingText || 'Loading...'}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
