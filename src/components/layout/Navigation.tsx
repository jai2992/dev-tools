'use client';

import React, { useState, useEffect } from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface NavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  actions,
  variant = 'horizontal',
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for horizontal navigation
  useEffect(() => {
    if (variant !== 'horizontal') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (variant === 'vertical') {
    return (
      <nav className={`w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] ${className}`}>
        <div className="p-6">
          {logo && (
            <div className="mb-8">
              {logo}
            </div>
          )}
          
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={combineAnimationClasses(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    item.isActive
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                  )}
                >
                  {item.icon && (
                    <span className="w-5 h-5 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  // Horizontal navigation
  return (
    <nav 
      className={combineAnimationClasses(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-[var(--color-border)]' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={combineAnimationClasses(
                    'relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    'hover-lift',
                    item.isActive
                      ? 'text-[var(--color-text-primary)] bg-[var(--color-surface-elevated)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <span className="w-4 h-4">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Active indicator */}
                  {item.isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-text-primary)] rounded-full" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {actions}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden" data-mobile-menu>
            <button
              onClick={toggleMobileMenu}
              className={combineAnimationClasses(
                'inline-flex items-center justify-center p-2 rounded-md',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-surface)] focus:outline-none focus-glow',
                'transition-all duration-200'
              )}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={combineAnimationClasses(
          'md:hidden transition-all duration-300 ease-out',
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        )}
        data-mobile-menu
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={combineAnimationClasses(
                'flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200',
                item.isActive
                  ? 'text-[var(--color-text-primary)] bg-[var(--color-surface-elevated)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && (
                <span className="w-5 h-5 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
          
          {/* Mobile Actions */}
          {actions && (
            <div className="pt-4 border-t border-[var(--color-border)]">
              <div className="px-3">
                {actions}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;