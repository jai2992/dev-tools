'use client';

import React from 'react';
import Button from '../common/Button';
import { combineAnimationClasses } from '@/utils/animations';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  variant?: 'default' | 'network' | 'not-found' | 'permission' | 'server';
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  variant = 'default',
  showRetry = true,
  showHome = false,
  onRetry,
  onHome,
  className = '',
  children
}) => {
  const getErrorIcon = () => {
    switch (variant) {
      case 'network':
        return (
          <svg className="w-16 h-16 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      case 'not-found':
        return (
          <svg className="w-16 h-16 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        );
      case 'permission':
        return (
          <svg className="w-16 h-16 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        );
      case 'server':
        return (
          <svg className="w-16 h-16 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-13.5 0v6.75a3 3 0 003 3h7.5a3 3 0 003-3v-6.75m-4.5-9.75h.008v.008H12v-.008z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
    }
  };

  const getDefaultContent = () => {
    switch (variant) {
      case 'network':
        return {
          title: title || 'Connection Error',
          message: message || 'Unable to connect to the server. Please check your internet connection and try again.'
        };
      case 'not-found':
        return {
          title: title || 'Page Not Found',
          message: message || 'The page you are looking for does not exist or has been moved.'
        };
      case 'permission':
        return {
          title: title || 'Access Denied',
          message: message || 'You do not have permission to access this resource.'
        };
      case 'server':
        return {
          title: title || 'Server Error',
          message: message || 'Something went wrong on our end. Please try again later.'
        };
      default:
        return {
          title: title || 'Something went wrong',
          message: message || 'An unexpected error occurred. Please try again.'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div
      className={combineAnimationClasses(
        'flex flex-col items-center justify-center text-center p-8',
        'animate-fade-in',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Error Icon */}
      <div className="mb-6 animate-scale-in animate-delay-100">
        {getErrorIcon()}
      </div>

      {/* Error Content */}
      <div className="max-w-md space-y-4 animate-slide-up animate-delay-200">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {content.title}
        </h2>
        
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {content.message}
        </p>

        {/* Custom Content */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        {/* Action Buttons */}
        {(showRetry || showHome) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-in animate-delay-300">
            {showRetry && onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="min-w-[120px]"
              >
                Try Again
              </Button>
            )}
            
            {showHome && onHome && (
              <Button
                variant="secondary"
                onClick={onHome}
                className="min-w-[120px]"
              >
                Go Home
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;