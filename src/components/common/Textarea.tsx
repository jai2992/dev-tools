import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  characterCount,
  maxLength,
  className = '',
  value,
  ...props
}, ref) => {
  const baseClasses = 'w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical';
  const errorClasses = error ? 'border-red-500' : 'border-gray-700';

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between items-center">
        <div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-gray-500 text-xs">{helperText}</p>
          )}
        </div>
        {characterCount && (
          <p className="text-gray-400 text-xs">
            {currentLength}{maxLength ? `/${maxLength}` : ''} characters
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
