'use client';

import React, { useState } from 'react';
import Navigation from '../layout/Navigation';
import Sidebar from '../layout/Sidebar';
import MobileMenu from '../layout/MobileMenu';
import Breadcrumbs from '../layout/Breadcrumbs';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

// Demo icons
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

const ToolsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const DocsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const NavigationDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'horizontal' | 'sidebar' | 'mobile' | 'breadcrumbs'>('horizontal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample navigation items
  const navigationItems = [
    { label: 'Home', href: '/', icon: <HomeIcon />, isActive: currentDemo === 'horizontal' },
    { label: 'Tools', href: '/tools', icon: <ToolsIcon />, badge: '12' },
    { label: 'Documentation', href: '/docs', icon: <DocsIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> }
  ];

  // Sample sidebar items with nested structure
  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon />,
      isActive: true
    },
    {
      label: 'Tools',
      href: '/tools',
      icon: <ToolsIcon />,
      badge: '12',
      children: [
        { label: 'JSON Formatter', href: '/tools/json', icon: <FolderIcon /> },
        { label: 'QR Generator', href: '/tools/qr', icon: <FolderIcon /> },
        { label: 'Image Converter', href: '/tools/image', icon: <FolderIcon /> }
      ]
    },
    {
      label: 'Documentation',
      href: '/docs',
      icon: <DocsIcon />,
      children: [
        { label: 'Getting Started', href: '/docs/getting-started', icon: <FolderIcon /> },
        { label: 'API Reference', href: '/docs/api', icon: <FolderIcon /> },
        { label: 'Examples', href: '/docs/examples', icon: <FolderIcon /> }
      ]
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  ];

  // Sample breadcrumbs
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Tools', href: '/tools', icon: <ToolsIcon /> },
    { label: 'Text Processing', href: '/tools/text', icon: <FolderIcon /> },
    { label: 'JSON Formatter', isActive: true }
  ];

  const renderHorizontalNavigation = () => (
    <div className="space-y-8">
      <Navigation
        items={navigationItems}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-white">Kiro Tools</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search tools..."
              size="sm"
              leftIcon={<SearchIcon />}
              className="w-64"
            />
            <Button variant="primary" size="sm" icon={<PlusIcon />}>
              New Tool
            </Button>
          </div>
        }
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="elevated" title="Horizontal Navigation Features" padding="lg">
          <div className="space-y-4">
            <p className="text-gray-300">
              The horizontal navigation component provides a modern, responsive navigation bar 
              perfect for top-level site navigation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Key Features:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Responsive design with mobile hamburger menu</li>
                  <li>• Active state indicators with smooth animations</li>
                  <li>• Icon and badge support for menu items</li>
                  <li>• Scroll-aware background with backdrop blur</li>
                  <li>• Keyboard navigation and accessibility support</li>
                  <li>• Customizable logo and action areas</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Mobile Features:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Collapsible hamburger menu</li>
                  <li>• Smooth slide transitions</li>
                  <li>• Touch-friendly interaction areas</li>
                  <li>• Automatic menu closure on navigation</li>
                  <li>• Focus management for accessibility</li>
                  <li>• Backdrop blur and overlay effects</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSidebarNavigation = () => (
    <div className="flex h-screen bg-black">
      <Sidebar
        items={sidebarItems}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            <span className="text-lg font-bold text-white">Kiro</span>
          </div>
        }
        footer={
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              <span>John Doe</span>
            </div>
            <Button variant="ghost" size="sm" fullWidth>
              Sign Out
            </Button>
          </div>
        }
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Card variant="elevated" title="Sidebar Navigation Features" padding="lg">
            <div className="space-y-4">
              <p className="text-gray-300">
                The sidebar navigation component provides a collapsible side navigation 
                perfect for dashboard-style applications with hierarchical navigation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Collapsible sidebar with smooth animations</li>
                    <li>• Nested navigation with expand/collapse</li>
                    <li>• Active state indicators and badges</li>
                    <li>• Icon support for all menu items</li>
                    <li>• Customizable header and footer areas</li>
                    <li>• Keyboard navigation support</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Interaction:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Click the collapse button to toggle width</li>
                    <li>• Expand nested items by clicking parent items</li>
                    <li>• Hover effects on all interactive elements</li>
                    <li>• Focus states for keyboard navigation</li>
                    <li>• Smooth transitions for all state changes</li>
                    <li>• Responsive behavior on smaller screens</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Try it out:</p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );

  const renderMobileMenu = () => (
    <div className="space-y-8">
      <div className="bg-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-white">Kiro Tools</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            Menu
          </Button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon && (
                  <span className="w-5 h-5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <div className="space-y-2">
              <Input
                placeholder="Search tools..."
                size="sm"
                leftIcon={<SearchIcon />}
              />
              <Button variant="primary" size="sm" fullWidth icon={<PlusIcon />}>
                New Tool
              </Button>
            </div>
          </div>
        </div>
      </MobileMenu>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="elevated" title="Mobile Menu Features" padding="lg">
          <div className="space-y-4">
            <p className="text-gray-300">
              The mobile menu component provides a full-screen overlay menu optimized 
              for mobile and tablet devices with touch-friendly interactions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Key Features:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Full-screen overlay with backdrop blur</li>
                  <li>• Smooth slide-in animations from right</li>
                  <li>• Touch-friendly large tap targets</li>
                  <li>• Automatic focus management</li>
                  <li>• Escape key and click-outside to close</li>
                  <li>• Scroll lock when menu is open</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Accessibility:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• ARIA modal and dialog attributes</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Focus trapping within menu</li>
                  <li>• Screen reader announcements</li>
                  <li>• High contrast focus indicators</li>
                  <li>• Semantic HTML structure</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Try it out:</p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                Open Mobile Menu
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderBreadcrumbs = () => (
    <div className="space-y-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Card variant="elevated" title="Breadcrumb Navigation" padding="lg">
            <div className="space-y-6">
              <p className="text-gray-300">
                Breadcrumb components help users understand their current location within 
                the site hierarchy and provide easy navigation back to parent pages.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-3">Default Breadcrumbs (Chevron):</h4>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <Breadcrumbs items={breadcrumbItems} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Slash Separator:</h4>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <Breadcrumbs items={breadcrumbItems} separator="slash" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Arrow Separator:</h4>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <Breadcrumbs items={breadcrumbItems} separator="arrow" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Large Size:</h4>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <Breadcrumbs items={breadcrumbItems} size="lg" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Features:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Multiple separator styles (chevron, slash, arrow)</li>
                    <li>• Icon support for breadcrumb items</li>
                    <li>• Active state indication</li>
                    <li>• Responsive text truncation</li>
                    <li>• Hover effects on clickable items</li>
                    <li>• Keyboard navigation support</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Accessibility:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Semantic HTML with nav and ol elements</li>
                    <li>• ARIA current="page" for active items</li>
                    <li>• Proper focus indicators</li>
                    <li>• Screen reader friendly structure</li>
                    <li>• High contrast text and separators</li>
                    <li>• Keyboard navigation support</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const demos = {
    horizontal: renderHorizontalNavigation,
    sidebar: renderSidebarNavigation,
    mobile: renderMobileMenu,
    breadcrumbs: renderBreadcrumbs
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Demo Selector */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">Navigation System Demo</h1>
            
            <div className="flex items-center gap-2">
              {Object.keys(demos).map((demo) => (
                <Button
                  key={demo}
                  variant={currentDemo === demo ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentDemo(demo as typeof currentDemo)}
                >
                  {demo.charAt(0).toUpperCase() + demo.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Selected Demo */}
      {demos[currentDemo]()}
    </div>
  );
};

export default NavigationDemo;