'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePageTransition } from '@/hooks/useAnimation';
import { combineAnimationClasses } from '@/utils/animations';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  showScrollToTop?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  breadcrumbs,
  actions,
  maxWidth = 'xl',
  className = '',
  showScrollToTop = true
}) => {
  const { isEntering, className: transitionClass } = usePageTransition();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll to top functionality
  useEffect(() => {
    if (!showScrollToTop) return;

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Container max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  // Base layout classes with design system integration
  const layoutClasses = combineAnimationClasses(
    // Background and typography
    'min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]',
    // Modern typography
    'font-family-primary',
    // Page transition
    transitionClass,
    // Custom classes
    className
  ).trim();

  const containerClasses = combineAnimationClasses(
    // Container sizing and centering
    'mx-auto px-4 sm:px-6 lg:px-8',
    // Max width
    maxWidthClasses[maxWidth],
    // Responsive padding
    'py-6 sm:py-8 lg:py-12'
  ).trim();

  return (
    <div className={layoutClasses}>
      {/* Main Container */}
      <div className={containerClasses}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav 
            className="mb-6 animate-fade-in animate-delay-100" 
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2 text-[var(--color-text-secondary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {item.href && !item.isActive ? (
                    <a
                      href={item.href}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={
                        item.isActive
                          ? 'text-[var(--color-text-primary)] font-medium'
                          : 'text-[var(--color-text-secondary)]'
                      }
                      aria-current={item.isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Page Header */}
        <header className="mb-8 sm:mb-12 animate-slide-up animate-delay-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </div>
            
            {/* Page Actions */}
            {actions && (
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="animate-fade-in animate-delay-300">
          {children}
        </main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-6 right-6 z-50
            w-12 h-12 rounded-full
            bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            hover-lift hover:scale-110
            focus:outline-none focus-glow
            ${showScrollButton 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-4 pointer-events-none'
            }
          `}
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PageLayout;