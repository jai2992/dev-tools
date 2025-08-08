import { InputHTMLAttributes, forwardRef, useState, useId } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
  const inputId = useId();
  const id = props.id || inputId;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    props.onChange?.(e);
  };

  // Base container classes
  const containerClasses = combineAnimationClasses(
    'relative',
    fullWidth ? 'w-full' : '',
    error ? 'form-field-error' : ''
  ).trim();

  // Base input classes with design system integration
  const baseInputClasses = combineAnimationClasses(
    // Layout and typography
    'w-full font-medium transition-all duration-200 ease-out',
    // Focus and interaction
    'focus:outline-none focus-glow',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Text color
    'text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]'
  ).trim();

  const variants = {
    default: [
      // Dark background using design system
      'bg-[var(--color-dark-gray)]',
      // White border with subtle opacity
      'border-2 border-white border-opacity-20',
      // Focus states with white glow effect
      'focus:border-white focus:border-opacity-100 focus:bg-[var(--color-medium-gray)]',
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-20',
      // Error states with red accent
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-30' : ''
    ].join(' '),
    
    filled: [
      // Elevated dark background
      'bg-[var(--color-medium-gray)]',
      // Transparent border that becomes visible on focus
      'border-2 border-transparent',
      // Focus states with white border glow
      'focus:border-white focus:border-opacity-100',
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-20',
      // Error states
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-30' : ''
    ].join(' '),
    
    outlined: [
      // Transparent background
      'bg-transparent',
      // Prominent white border
      'border-2 border-white border-opacity-30',
      // Focus states with background fill and enhanced border
      'focus:border-white focus:border-opacity-100 focus:bg-[var(--color-dark-gray)]',
      'focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-20',
      // Error states
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-30' : ''
    ].join(' ')
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md min-h-[36px]',
    md: 'px-4 py-3 text-base rounded-lg min-h-[44px]',
    lg: 'px-5 py-4 text-lg rounded-xl min-h-[52px]'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const labelClasses = combineAnimationClasses(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]',
    isFocused ? 'text-[var(--color-text-primary)]' : ''
  ).trim();

  const inputPadding = {
    left: leftIcon ? (size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10') : '',
    right: rightIcon || isLoading ? (size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10') : ''
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconSizes[size]} text-[var(--color-text-secondary)] pointer-events-none`}>
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          id={id}
          className={`
            ${baseInputClasses}
            ${variants[variant]}
            ${sizes[size]}
            ${inputPadding.left}
            ${inputPadding.right}
            ${className}
          `.trim()}
          disabled={disabled || isLoading}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        
        {/* Right Icon / Loading */}
        {(rightIcon || isLoading) && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconSizes[size]} text-[var(--color-text-secondary)]`}>
            {isLoading ? (
              <div className="animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[var(--color-error)] animate-slide-up">
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p id={`${id}-helper`} className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
