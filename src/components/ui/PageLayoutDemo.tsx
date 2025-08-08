'use client';

import React, { useState } from 'react';
import PageLayout from '../layout/PageLayout';
import { Grid, GridItem } from '../layout/Grid';
import Navigation from '../layout/Navigation';
import Card from '../common/Card';
import Button from '../common/Button';
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

export const PageLayoutDemo: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState<'basic' | 'with-nav' | 'with-breadcrumbs' | 'full-featured'>('basic');

  // Sample navigation items
  const navigationItems = [
    { label: 'Home', href: '/', icon: <HomeIcon />, isActive: currentLayout === 'with-nav' },
    { label: 'Tools', href: '/tools', icon: <ToolsIcon />, badge: '12' },
    { label: 'Documentation', href: '/docs', icon: <DocsIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> }
  ];

  // Sample breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'JSON Formatter', isActive: true }
  ];

  const renderBasicLayout = () => (
    <PageLayout
      title="Basic Page Layout"
      description="A simple page layout with just title and description. Perfect for minimal pages or getting started quickly."
    >
      <Grid cols={1} gap="lg">
        <GridItem>
          <Card variant="default" padding="lg">
            <h3 className="text-xl font-semibold mb-4">Basic Layout Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Clean, minimal design with modern typography</li>
              <li>• Responsive container with proper spacing</li>
              <li>• Smooth page transition animations</li>
              <li>• Automatic scroll-to-top functionality</li>
              <li>• Accessible semantic HTML structure</li>
            </ul>
          </Card>
        </GridItem>
      </Grid>
    </PageLayout>
  );

  const renderWithNavigation = () => (
    <div>
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
      
      <PageLayout
        title="Layout with Navigation"
        description="Page layout combined with a responsive navigation bar. The navigation includes logo, menu items, and action buttons."
        maxWidth="xl"
      >
        <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
          <GridItem>
            <Card variant="elevated" title="Navigation Features" padding="md">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Responsive horizontal navigation</li>
                <li>• Mobile hamburger menu</li>
                <li>• Active state indicators</li>
                <li>• Icon and badge support</li>
                <li>• Scroll-aware background</li>
              </ul>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="elevated" title="Mobile Responsive" padding="md">
              <p className="text-sm text-gray-300 mb-3">
                The navigation automatically adapts to mobile screens with a collapsible menu.
              </p>
              <Button variant="secondary" size="sm" fullWidth>
                Try Resizing Window
              </Button>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="elevated" title="Accessibility" padding="md">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Keyboard navigation support</li>
                <li>• ARIA labels and roles</li>
                <li>• Focus management</li>
                <li>• Screen reader friendly</li>
              </ul>
            </Card>
          </GridItem>
        </Grid>
      </PageLayout>
    </div>
  );

  const renderWithBreadcrumbs = () => (
    <PageLayout
      title="Layout with Breadcrumbs"
      description="Page layout featuring breadcrumb navigation for better user orientation and site hierarchy understanding."
      breadcrumbs={breadcrumbs}
      maxWidth="2xl"
    >
      <Grid cols={1} gap="lg">
        <GridItem>
          <Card variant="outlined" title="Breadcrumb Navigation" padding="lg">
            <div className="space-y-4">
              <p className="text-gray-300">
                Breadcrumbs help users understand their current location within the site hierarchy 
                and provide an easy way to navigate back to parent pages.
              </p>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Current Breadcrumb Path:</h4>
                <div className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span className="text-gray-500">/</span>
                      )}
                      <span className={item.isActive ? 'text-white font-medium' : 'text-gray-400'}>
                        {item.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-white mb-2">Features:</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Automatic active state detection</li>
                    <li>• Clickable navigation links</li>
                    <li>• Semantic HTML structure</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-white mb-2">Benefits:</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Improved user orientation</li>
                    <li>• Better SEO structure</li>
                    <li>• Enhanced accessibility</li>
                    <li>• Reduced bounce rate</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </GridItem>
      </Grid>
    </PageLayout>
  );

  const renderFullFeatured = () => (
    <div>
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
      
      <PageLayout
        title="Full-Featured Layout"
        description="Complete page layout with navigation, breadcrumbs, actions, and responsive grid system. This demonstrates all layout capabilities working together."
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md">
              Export
            </Button>
            <Button variant="primary" size="md" icon={<PlusIcon />}>
              Create New
            </Button>
          </div>
        }
        maxWidth="2xl"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <Grid cols={1} gap="lg">
            <GridItem>
              <Card variant="elevated" padding="lg">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">Complete Layout System</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    This layout combines all available features: navigation, breadcrumbs, page actions, 
                    responsive grid system, and smooth animations. Perfect for complex applications.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="primary">Get Started</Button>
                    <Button variant="secondary">Learn More</Button>
                  </div>
                </div>
              </Card>
            </GridItem>
          </Grid>

          {/* Feature Grid */}
          <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
            <GridItem>
              <Card variant="default" title="Responsive Grid" padding="md" hover>
                <p className="text-gray-300 text-sm mb-4">
                  Flexible grid system that adapts to different screen sizes with customizable columns and gaps.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div>Mobile: 1 column</div>
                  <div>Tablet: 2 columns</div>
                  <div>Desktop: 3 columns</div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card variant="default" title="Page Transitions" padding="md" hover>
                <p className="text-gray-300 text-sm mb-4">
                  Smooth page transitions with staggered animations for a polished user experience.
                </p>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card variant="default" title="Accessibility First" padding="md" hover>
                <p className="text-gray-300 text-sm mb-4">
                  Built with accessibility in mind, including proper ARIA labels, keyboard navigation, and screen reader support.
                </p>
                <div className="text-xs text-gray-400">
                  WCAG 2.1 AA Compliant
                </div>
              </Card>
            </GridItem>
          </Grid>

          {/* Content Sections */}
          <Grid cols={1} responsive={{ lg: 2 }} gap="lg">
            <GridItem>
              <Card variant="outlined" title="Layout Configuration" padding="lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Max Width Options:</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-gray-800 p-2 rounded text-center">sm</div>
                      <div className="bg-gray-800 p-2 rounded text-center">md</div>
                      <div className="bg-gray-800 p-2 rounded text-center">lg</div>
                      <div className="bg-gray-800 p-2 rounded text-center">xl</div>
                      <div className="bg-gray-800 p-2 rounded text-center">2xl</div>
                      <div className="bg-gray-800 p-2 rounded text-center">full</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Grid Columns:</h4>
                    <div className="flex gap-2 text-xs">
                      {[1, 2, 3, 4, 5, 6, 12].map(col => (
                        <div key={col} className="bg-gray-800 p-2 rounded text-center flex-1">
                          {col}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card variant="outlined" title="Performance Features" padding="lg">
                <div className="space-y-4">
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Optimized animations with GPU acceleration
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Lazy loading for scroll-triggered elements
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Responsive images and content
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Minimal bundle size impact
                    </li>
                  </ul>
                  
                  <div className="mt-4 p-3 bg-gray-900 rounded">
                    <div className="text-xs text-gray-400 mb-1">Bundle Impact</div>
                    <div className="text-lg font-bold text-green-500">+2.3KB gzipped</div>
                  </div>
                </div>
              </Card>
            </GridItem>
          </Grid>
        </div>
      </PageLayout>
    </div>
  );

  const layouts = {
    basic: renderBasicLayout,
    'with-nav': renderWithNavigation,
    'with-breadcrumbs': renderWithBreadcrumbs,
    'full-featured': renderFullFeatured
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Layout Selector */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">PageLayout Demo</h1>
            
            <div className="flex items-center gap-2">
              {Object.keys(layouts).map((layout) => (
                <Button
                  key={layout}
                  variant={currentLayout === layout ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentLayout(layout as typeof currentLayout)}
                >
                  {layout.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Selected Layout */}
      {layouts[currentLayout]()}
    </div>
  );
};

export default PageLayoutDemo;