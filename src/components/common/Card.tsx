import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export default function Card({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '' 
}: CardProps) {
  return (
    <div className={`bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
