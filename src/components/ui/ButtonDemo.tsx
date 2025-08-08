'use client';

import React, { useState } from 'react';
import Button from '../common/Button';

// Demo icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,15 17,10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
  </svg>
);

export const ButtonDemo: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Auto-reset loading state after 3 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    }, 3000);
  };

  return (
    <div className="p-8 space-y-12 bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Modern Button Component</h1>
        <p className="text-gray-400 mb-8">
          Redesigned with black & white design system, smooth animations, and comprehensive accessibility
        </p>

        {/* Variants Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Button Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Primary</h3>
              <div className="space-y-3">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Secondary</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="sm">Small Secondary</Button>
                <Button variant="secondary" size="md">Medium Secondary</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Ghost</h3>
              <div className="space-y-3">
                <Button variant="ghost" size="sm">Small Ghost</Button>
                <Button variant="ghost" size="md">Medium Ghost</Button>
                <Button variant="ghost" size="lg">Large Ghost</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Danger</h3>
              <div className="space-y-3">
                <Button variant="danger" size="sm">Small Danger</Button>
                <Button variant="danger" size="md">Medium Danger</Button>
                <Button variant="danger" size="lg">Large Danger</Button>
              </div>
            </div>
          </div>
        </section>

        {/* States Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Button States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Normal States</h3>
              <div className="space-y-3">
                <Button variant="primary">Normal Button</Button>
                <Button variant="primary" disabled>Disabled Button</Button>
                <Button 
                  variant="primary" 
                  isLoading={loadingStates.normal}
                  onClick={() => toggleLoading('normal')}
                >
                  {loadingStates.normal ? 'Loading...' : 'Click to Load'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">With Icons</h3>
              <div className="space-y-3">
                <Button variant="primary" icon={<PlusIcon />}>
                  Add Item
                </Button>
                <Button variant="secondary" icon={<DownloadIcon />} iconPosition="right">
                  Download
                </Button>
                <Button 
                  variant="danger" 
                  icon={<TrashIcon />}
                  isLoading={loadingStates.delete}
                  onClick={() => toggleLoading('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Full Width</h3>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>
                  Full Width Primary
                </Button>
                <Button variant="secondary" fullWidth>
                  Full Width Secondary
                </Button>
                <Button 
                  variant="primary" 
                  fullWidth 
                  isLoading={loadingStates.fullWidth}
                  loadingText="Processing..."
                  onClick={() => toggleLoading('fullWidth')}
                >
                  Full Width Loading
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Interactive Demo</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg space-y-4">
            <p className="text-gray-300">
              Try interacting with these buttons to see the micro-animations and hover effects:
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary"
                onClick={() => alert('Primary button clicked!')}
              >
                Click Me
              </Button>
              
              <Button 
                variant="secondary"
                icon={<PlusIcon />}
                onClick={() => alert('Secondary with icon clicked!')}
              >
                With Icon
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => toggleLoading('interactive')}
                isLoading={loadingStates.interactive}
                loadingText="Working..."
              >
                Toggle Loading
              </Button>
              
              <Button 
                variant="danger"
                icon={<TrashIcon />}
                onClick={() => confirm('Are you sure you want to delete?')}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Animation Showcase</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">
              These buttons demonstrate the various animation classes:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Hover Effects
                </h4>
                <Button variant="primary" className="hover-lift-strong">
                  Strong Lift
                </Button>
                <Button variant="secondary" className="hover-glow-strong">
                  Strong Glow
                </Button>
                <Button variant="ghost" className="hover-scale">
                  Scale Effect
                </Button>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Click Effects
                </h4>
                <Button variant="primary" className="active-press">
                  Press Effect
                </Button>
                <Button variant="secondary" className="click-ripple">
                  Ripple Effect
                </Button>
                <Button variant="danger">
                  Default Click
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Accessibility Features</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Keyboard Navigation
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  All buttons support keyboard navigation with Tab, Enter, and Space keys.
                </p>
                <div className="space-y-2">
                  <Button variant="primary" size="sm">Tab to me</Button>
                  <Button variant="secondary" size="sm">Then to me</Button>
                  <Button variant="ghost" size="sm">Finally here</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Screen Reader Support
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Loading states and button states are announced to screen readers.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    isLoading={loadingStates.a11y}
                    onClick={() => toggleLoading('a11y')}
                    loadingText="Processing your request"
                  >
                    Screen Reader Test
                  </Button>
                  <Button variant="secondary" size="sm" disabled>
                    Disabled State
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Usage Examples</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`// Basic usage
<Button variant="primary" size="md">
  Click me
</Button>

// With icon and loading state
<Button 
  variant="secondary"
  icon={<PlusIcon />}
  isLoading={isLoading}
  loadingText="Adding..."
  onClick={handleAdd}
>
  Add Item
</Button>

// Full width with custom styling
<Button 
  variant="primary"
  fullWidth
  className="mt-4"
  disabled={!isValid}
>
  Submit Form
</Button>`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ButtonDemo;