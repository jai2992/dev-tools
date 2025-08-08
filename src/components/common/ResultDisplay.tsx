'use client';

import Button from './Button';
import { combineAnimationClasses } from '../../utils/animations';

interface ResultDisplayProps {
  title: string;
  status: 'success' | 'error' | 'processing';
  message?: string;
  downloadUrl?: string;
  fileName?: string;
  onReset?: () => void;
  className?: string;
}

export default function ResultDisplay({ 
  title, 
  status, 
  message, 
  downloadUrl, 
  fileName,
  onReset,
  className = ''
}: ResultDisplayProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      if (fileName) link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-16 h-16 mx-auto mb-4 text-[var(--color-success)] animate-scale-in">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 mx-auto mb-4 text-[var(--color-error)] animate-scale-in">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-text-primary)]" />
          </div>
        );
      default:
        return null;
    }
  };

  const containerClasses = combineAnimationClasses(
    'bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6',
    'animate-fade-in',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {getStatusIcon()}
        
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 animate-slide-up animate-delay-100">
          {title}
        </h3>
        
        {message && (
          <p className={combineAnimationClasses(
            'text-sm mb-4 animate-slide-up animate-delay-200',
            status === 'error' 
              ? 'text-[var(--color-error)]' 
              : 'text-[var(--color-text-secondary)]'
          )}>
            {message}
          </p>
        )}
        
        <div className="flex gap-3 justify-center animate-fade-in animate-delay-300">
          {downloadUrl && status === 'success' && (
            <Button 
              variant="primary" 
              onClick={handleDownload}
              className="hover-lift"
            >
              Download {fileName || 'File'}
            </Button>
          )}
          
          {onReset && (
            <Button 
              variant="secondary" 
              onClick={onReset}
              className="hover-lift"
            >
              Convert Another File
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
