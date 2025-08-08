'use client';

import React, { useState } from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  logo,
  footer,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const paddingLeft = level === 0 ? 'pl-3' : `pl-${3 + level * 4}`;

    return (
      <li key={item.label}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.label)}
              className={combineAnimationClasses(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200 hover-lift',
                'focus:outline-none focus-glow',
                item.isActive
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
                paddingLeft
              )}
            >
              {/* Icon */}
              {item.icon && !isCollapsed && (
                <span className="w-5 h-5 flex-shrink-0">
                  {item.icon}
                </span>
              )}

              {/* Label */}
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Expand/Collapse Icon */}
                  <svg
                    className={combineAnimationClasses(
                      'w-4 h-4 transition-transform duration-200',
                      isExpanded ? 'rotate-90' : ''
                    )}
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
                </>
              )}
            </button>
          ) : (
            <a
              href={item.href}
              className={combineAnimationClasses(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200 hover-lift',
                'focus:outline-none focus-glow',
                item.isActive
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
                paddingLeft
              )}
            >
              {/* Icon */}
              {item.icon && (
                <span className="w-5 h-5 flex-shrink-0">
                  {item.icon}
                </span>
              )}

              {/* Label and Badge */}
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-[var(--color-error)] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          )}

          {/* Active Indicator */}
          {item.isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-text-primary)] rounded-r" />
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <ul className="mt-1 space-y-1 animate-slide-down">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={combineAnimationClasses(
        'flex flex-col h-full bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        {/* Logo */}
        {logo && !isCollapsed && (
          <div className="flex-1">
            {logo}
          </div>
        )}

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={combineAnimationClasses(
              'p-2 rounded-lg',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              'hover:bg-[var(--color-surface-elevated)] transition-all duration-200',
              'focus:outline-none focus-glow',
              isCollapsed ? 'mx-auto' : ''
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={combineAnimationClasses(
                'w-5 h-5 transition-transform duration-200',
                isCollapsed ? 'rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {items.map(item => renderSidebarItem(item))}
        </ul>
      </nav>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="p-4 border-t border-[var(--color-border)]">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;