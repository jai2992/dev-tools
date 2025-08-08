'use client';

import React, { useEffect, useRef } from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  children,
  className = ''
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        overlayRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={combineAnimationClasses(
        'fixed inset-0 z-50 lg:hidden',
        'animate-fade-in'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Menu Panel */}
      <div
        ref={menuRef}
        className={combineAnimationClasses(
          'fixed right-0 top-0 h-full w-full max-w-sm',
          'bg-[var(--color-background)] border-l border-[var(--color-border)]',
          'shadow-xl',
          'animate-slide-left',
          'overflow-y-auto',
          className
        )}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Menu
          </h2>
          <button
            onClick={onClose}
            className={combineAnimationClasses(
              'p-2 rounded-lg',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              'hover:bg-[var(--color-surface)] transition-all duration-200',
              'focus:outline-none focus-glow'
            )}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;