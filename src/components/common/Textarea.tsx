import { TextareaHTMLAttributes, forwardRef, useState, useId } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  label,
  error,
  helperText,
  characterCount = false,
  variant = 'default',
  size = 'md',
  resize = 'vertical',
  autoResize = false,
  fullWidth = true,
  className = '',
  disabled,
  value,
  maxLength,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId = useId();
  const id = props.id || textareaId;

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const currentLength = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;
  const isOverLimit = maxLength && currentLength > maxLength;

  // Base container classes
  const containerClasses = combineAnimationClasses(
    'relative',
    fullWidth ? 'w-full' : '',
    error ? 'form-field-error' : ''
  ).trim();

  // Base textarea classes with design system integration
  const baseTextareaClasses = combineAnimationClasses(
    // Layout and typography
    'w-full font-medium transition-all duration-200 ease-out',
    // Focus and interaction
    'focus:outline-none focus-glow',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Text color
    'text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]',
    // Resize behavior
    `resize-${resize}`
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
    sm: 'px-3 py-2 text-sm rounded-md min-h-[80px]',
    md: 'px-4 py-3 text-base rounded-lg min-h-[100px]',
    lg: 'px-5 py-4 text-lg rounded-xl min-h-[120px]'
  };

  const labelClasses = combineAnimationClasses(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]',
    isFocused ? 'text-[var(--color-text-primary)]' : ''
  ).trim();

  const characterCountClasses = combineAnimationClasses(
    'text-xs transition-colors duration-200',
    isOverLimit ? 'text-[var(--color-error)]' : 
    isNearLimit ? 'text-[var(--color-warning)]' : 
    'text-[var(--color-text-secondary)]'
  ).trim();

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Textarea */}
      <textarea
        ref={ref}
        id={id}
        className={`
          ${baseTextareaClasses}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `.trim()}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      
      {/* Footer with error, helper text, and character count */}
      <div className="flex justify-between items-start mt-2 gap-4">
        <div className="flex-1">
          {/* Error Message */}
          {error && (
            <p id={`${id}-error`} className="text-sm text-[var(--color-error)] animate-slide-up">
              {error}
            </p>
          )}
          
          {/* Helper Text */}
          {helperText && !error && (
            <p id={`${id}-helper`} className="text-xs text-[var(--color-text-secondary)]">
              {helperText}
            </p>
          )}
        </div>
        
        {/* Character Count */}
        {characterCount && (
          <div className="flex-shrink-0">
            <p className={characterCountClasses}>
              {currentLength}{maxLength ? `/${maxLength}` : ''}
              <span className="ml-1">characters</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
