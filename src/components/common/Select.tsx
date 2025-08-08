import { SelectHTMLAttributes, ReactNode, forwardRef, useState, useId } from 'react';
import { combineAnimationClasses } from '../../utils/animations';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  placeholder,
  fullWidth = true,
  className = '',
  disabled,
  children,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectId = useId();
  const id = props.id || selectId;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Base container classes
  const containerClasses = combineAnimationClasses(
    'relative',
    fullWidth ? 'w-full' : '',
    error ? 'form-field-error' : ''
  ).trim();

  // Base select classes with design system integration
  const baseSelectClasses = combineAnimationClasses(
    // Layout and typography
    'w-full font-medium transition-all duration-200 ease-out appearance-none',
    // Focus and interaction
    'focus:outline-none focus-glow cursor-pointer',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Text color
    'text-[var(--color-text-primary)]',
    // Custom arrow padding
    'pr-10'
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

  const labelClasses = combineAnimationClasses(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]',
    isFocused ? 'text-[var(--color-text-primary)]' : ''
  ).trim();

  const arrowSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        {/* Select Element */}
        <select
          ref={ref}
          id={id}
          className={`
            ${baseSelectClasses}
            ${variants[variant]}
            ${sizes[size]}
            ${className}
          `.trim()}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        
        {/* Custom Dropdown Arrow */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${arrowSize[size]} text-[var(--color-text-secondary)] pointer-events-none transition-transform duration-200 ${isFocused ? 'rotate-180' : ''}`}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
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

Select.displayName = 'Select';

export default Select;
