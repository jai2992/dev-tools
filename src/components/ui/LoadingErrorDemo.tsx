'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Skeleton from './Skeleton';
import ErrorState from './ErrorState';
import ProgressIndicator from './ProgressIndicator';
import Button from '../common/Button';
import Card from '../common/Card';
import { Grid, GridItem } from '../layout/Grid';

export const LoadingErrorDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'loading' | 'skeleton' | 'error' | 'progress'>('loading');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const renderLoadingDemo = () => (
    <div className="space-y-8">
      <Card variant="elevated" title="Loading Spinners" padding="lg">
        <div className="space-y-6">
          <p className="text-gray-300">
            Various loading spinner variants with different sizes, colors, and animations.
          </p>
          
          {/* Spinner Variants */}
          <div>
            <h4 className="font-medium text-white mb-4">Spinner Variants</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center space-y-2">
                <LoadingSpinner variant="spinner" size="lg" />
                <p className="text-sm text-gray-400">Spinner</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner variant="dots" size="lg" />
                <p className="text-sm text-gray-400">Dots</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner variant="pulse" size="lg" />
                <p className="text-sm text-gray-400">Pulse</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner variant="bars" size="lg" />
                <p className="text-sm text-gray-400">Bars</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner variant="ring" size="lg" />
                <p className="text-sm text-gray-400">Ring</p>
              </div>
            </div>
          </div>

          {/* Size Variations */}
          <div>
            <h4 className="font-medium text-white mb-4">Size Variations</h4>
            <div className="flex items-center gap-8">
              <div className="text-center space-y-2">
                <LoadingSpinner size="sm" />
                <p className="text-xs text-gray-400">Small</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner size="md" />
                <p className="text-xs text-gray-400">Medium</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner size="lg" />
                <p className="text-xs text-gray-400">Large</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner size="xl" />
                <p className="text-xs text-gray-400">Extra Large</p>
              </div>
            </div>
          </div>

          {/* Color Variations */}
          <div>
            <h4 className="font-medium text-white mb-4">Color Variations</h4>
            <div className="flex items-center gap-8">
              <div className="text-center space-y-2">
                <LoadingSpinner color="primary" size="lg" />
                <p className="text-xs text-gray-400">Primary</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner color="secondary" size="lg" />
                <p className="text-xs text-gray-400">Secondary</p>
              </div>
              <div className="text-center space-y-2">
                <LoadingSpinner color="white" size="lg" />
                <p className="text-xs text-gray-400">White</p>
              </div>
            </div>
          </div>

          {/* In Context Examples */}
          <div>
            <h4 className="font-medium text-white mb-4">In Context Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="default" padding="md">
                <div className="flex items-center gap-3">
                  <LoadingSpinner size="sm" />
                  <span className="text-gray-300">Loading data...</span>
                </div>
              </Card>
              
              <Card variant="default" padding="md">
                <div className="text-center space-y-3">
                  <LoadingSpinner variant="dots" size="md" />
                  <p className="text-gray-300">Processing your request</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Interactive Demo */}
          <div>
            <h4 className="font-medium text-white mb-4">Interactive Demo</h4>
            <div className="space-y-4">
              <Button 
                variant="primary" 
                onClick={simulateLoading}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                Simulate Loading
              </Button>
              
              {isLoading && (
                <Card variant="default" padding="md">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner variant="spinner" size="sm" />
                    <span className="text-gray-300">This will complete in 3 seconds...</span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSkeletonDemo = () => (
    <div className="space-y-8">
      <Card variant="elevated" title="Skeleton Loading States" padding="lg">
        <div className="space-y-6">
          <p className="text-gray-300">
            Skeleton components provide placeholder content while data is loading, 
            maintaining layout structure and improving perceived performance.
          </p>
          
          {/* Basic Skeletons */}
          <div>
            <h4 className="font-medium text-white mb-4">Basic Variants</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Text (Single Line)</p>
                <Skeleton variant="text" width="60%" />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Text (Multiple Lines)</p>
                <Skeleton variant="text" lines={3} />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Rectangular</p>
                <Skeleton variant="rectangular" width="200px" height="120px" />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Circular</p>
                <Skeleton variant="circular" width="60px" height="60px" />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Rounded</p>
                <Skeleton variant="rounded" width="150px" height="40px" />
              </div>
            </div>
          </div>

          {/* Animation Types */}
          <div>
            <h4 className="font-medium text-white mb-4">Animation Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Pulse Animation</p>
                <Skeleton variant="rectangular" width="100%" height="60px" animation="pulse" />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Wave Animation</p>
                <Skeleton variant="rectangular" width="100%" height="60px" animation="wave" />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">No Animation</p>
                <Skeleton variant="rectangular" width="100%" height="60px" animation="none" />
              </div>
            </div>
          </div>

          {/* Real-world Examples */}
          <div>
            <h4 className="font-medium text-white mb-4">Real-world Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Profile Skeleton */}
              <Card variant="default" title="User Profile Loading" padding="md">
                <div className="flex items-start gap-4">
                  <Skeleton variant="circular" width="60px" height="60px" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="80%" />
                  </div>
                </div>
              </Card>

              {/* Article Card Skeleton */}
              <Card variant="default" title="Article Card Loading" padding="md">
                <div className="space-y-4">
                  <Skeleton variant="rectangular" width="100%" height="120px" />
                  <div className="space-y-2">
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="75%" />
                    <Skeleton variant="text" width="60%" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="rounded" width="80px" height="32px" />
                  </div>
                </div>
              </Card>

              {/* List Items Skeleton */}
              <Card variant="default" title="List Items Loading" padding="md">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Skeleton variant="circular" width="40px" height="40px" />
                      <div className="flex-1 space-y-1">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </div>
                      <Skeleton variant="rectangular" width="20px" height="20px" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Dashboard Stats Skeleton */}
              <Card variant="default" title="Dashboard Stats Loading" padding="md">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="text-center space-y-2">
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="rectangular" width="100%" height="40px" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderErrorDemo = () => (
    <div className="space-y-8">
      <Card variant="elevated" title="Error State Components" padding="lg">
        <div className="space-y-6">
          <p className="text-gray-300">
            Error state components provide clear feedback when something goes wrong, 
            with appropriate messaging and recovery actions.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Error */}
            <Card variant="default" title="Default Error" padding="md">
              <ErrorState
                onRetry={() => alert('Retry clicked')}
                showRetry={true}
              />
            </Card>

            {/* Network Error */}
            <Card variant="default" title="Network Error" padding="md">
              <ErrorState
                variant="network"
                onRetry={() => alert('Retry clicked')}
                showRetry={true}
              />
            </Card>

            {/* Not Found Error */}
            <Card variant="default" title="Not Found Error" padding="md">
              <ErrorState
                variant="not-found"
                onHome={() => alert('Home clicked')}
                showHome={true}
                showRetry={false}
              />
            </Card>

            {/* Permission Error */}
            <Card variant="default" title="Permission Error" padding="md">
              <ErrorState
                variant="permission"
                onHome={() => alert('Home clicked')}
                showHome={true}
                showRetry={false}
              />
            </Card>

            {/* Server Error */}
            <Card variant="default" title="Server Error" padding="md">
              <ErrorState
                variant="server"
                onRetry={() => alert('Retry clicked')}
                onHome={() => alert('Home clicked')}
                showRetry={true}
                showHome={true}
              />
            </Card>

            {/* Custom Error */}
            <Card variant="default" title="Custom Error" padding="md">
              <ErrorState
                title="Custom Error Title"
                message="This is a custom error message with specific details about what went wrong."
                onRetry={() => alert('Custom retry')}
                showRetry={true}
              >
                <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-300">
                  <p>Additional custom content can be added here, such as:</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Error codes or technical details</li>
                    <li>Contact information</li>
                    <li>Alternative actions</li>
                  </ul>
                </div>
              </ErrorState>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProgressDemo = () => (
    <div className="space-y-8">
      <Card variant="elevated" title="Progress Indicators" padding="lg">
        <div className="space-y-6">
          <p className="text-gray-300">
            Progress indicators show the completion status of ongoing operations, 
            helping users understand how much work remains.
          </p>
          
          {/* Linear Progress */}
          <div>
            <h4 className="font-medium text-white mb-4">Linear Progress</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Determinate Progress</p>
                <ProgressIndicator 
                  variant="linear" 
                  value={Math.round(progress)} 
                  showLabel={true}
                  label="Upload Progress"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Indeterminate Progress</p>
                <ProgressIndicator 
                  variant="linear" 
                  indeterminate={true}
                  showLabel={true}
                  label="Processing"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Different Sizes</p>
                <div className="space-y-3">
                  <ProgressIndicator variant="linear" value={75} size="sm" />
                  <ProgressIndicator variant="linear" value={75} size="md" />
                  <ProgressIndicator variant="linear" value={75} size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Circular Progress */}
          <div>
            <h4 className="font-medium text-white mb-4">Circular Progress</h4>
            <div className="flex items-center gap-8">
              <div className="text-center space-y-2">
                <ProgressIndicator 
                  variant="circular" 
                  value={Math.round(progress)} 
                  size="sm"
                  showLabel={true}
                />
                <p className="text-xs text-gray-400">Small</p>
              </div>
              
              <div className="text-center space-y-2">
                <ProgressIndicator 
                  variant="circular" 
                  value={Math.round(progress)} 
                  size="md"
                  showLabel={true}
                />
                <p className="text-xs text-gray-400">Medium</p>
              </div>
              
              <div className="text-center space-y-2">
                <ProgressIndicator 
                  variant="circular" 
                  value={Math.round(progress)} 
                  size="lg"
                  showLabel={true}
                />
                <p className="text-xs text-gray-400">Large</p>
              </div>
              
              <div className="text-center space-y-2">
                <ProgressIndicator 
                  variant="circular" 
                  indeterminate={true}
                  size="md"
                />
                <p className="text-xs text-gray-400">Indeterminate</p>
              </div>
            </div>
          </div>

          {/* Dots Progress */}
          <div>
            <h4 className="font-medium text-white mb-4">Dots Progress</h4>
            <div className="flex items-center gap-8">
              <div className="text-center space-y-2">
                <ProgressIndicator variant="dots" size="sm" />
                <p className="text-xs text-gray-400">Small</p>
              </div>
              
              <div className="text-center space-y-2">
                <ProgressIndicator variant="dots" size="md" />
                <p className="text-xs text-gray-400">Medium</p>
              </div>
              
              <div className="text-center space-y-2">
                <ProgressIndicator variant="dots" size="lg" />
                <p className="text-xs text-gray-400">Large</p>
              </div>
            </div>
          </div>

          {/* Real-world Examples */}
          <div>
            <h4 className="font-medium text-white mb-4">Real-world Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="default" title="File Upload" padding="md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">document.pdf</p>
                      <p className="text-xs text-gray-400">2.4 MB</p>
                    </div>
                  </div>
                  <ProgressIndicator 
                    variant="linear" 
                    value={Math.round(progress)} 
                    showLabel={true}
                    label="Uploading"
                  />
                </div>
              </Card>

              <Card variant="default" title="Data Processing" padding="md">
                <div className="text-center space-y-4">
                  <ProgressIndicator 
                    variant="circular" 
                    value={Math.round(progress)} 
                    size="lg"
                    showLabel={true}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Processing Data</p>
                    <p className="text-xs text-gray-400">This may take a few moments...</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const demos = {
    loading: renderLoadingDemo,
    skeleton: renderSkeletonDemo,
    error: renderErrorDemo,
    progress: renderProgressDemo
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Demo Selector */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">Loading & Error States Demo</h1>
            
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {demos[currentDemo]()}
      </div>
    </div>
  );
};

export default LoadingErrorDemo;