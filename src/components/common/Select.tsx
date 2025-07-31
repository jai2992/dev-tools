import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

export default function Select({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}: SelectProps) {
  const baseClasses = 'w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const errorClasses = error ? 'border-red-500' : 'border-gray-700';

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-xs">{helperText}</p>
      )}
    </div>
  );
}
