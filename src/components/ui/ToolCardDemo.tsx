'use client';

import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import Button from '../common/Button';
import Card from '../common/Card';

// Demo icons
const JsonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z"></path>
    <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
    <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
    <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path>
  </svg>
);

const QrIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="5" height="5"></rect>
    <rect x="16" y="3" width="5" height="5"></rect>
    <rect x="3" y="16" width="5" height="5"></rect>
    <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
    <path d="M21 21v.01"></path>
    <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
    <path d="M3 12h.01"></path>
    <path d="M12 3h.01"></path>
    <path d="M12 16v.01"></path>
    <path d="M16 12h1"></path>
    <path d="M21 12v.01"></path>
    <path d="M12 21v-1"></path>
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21,15 16,10 5,21"></polyline>
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6"></polyline>
    <polyline points="8,6 2,12 8,18"></polyline>
  </svg>
);

const TextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4,7 4,4 20,4 20,7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

const PdfIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const CryptoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4"></path>
    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
    <path d="M13 12h3a2 2 0 0 1 2 2v1"></path>
    <path d="M11 12H8a2 2 0 0 0-2 2v1"></path>
  </svg>
);

const ColorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
);

export const ToolCardDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'variants' | 'badges' | 'categories' | 'grid'>('variants');

  // Sample tool data
  const sampleTools = [
    {
      title: 'JSON Formatter',
      description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
      href: '/json-formatter',
      icon: <JsonIcon />,
      category: 'Development',
      isPopular: true
    },
    {
      title: 'QR Code Generator',
      description: 'Generate QR codes for URLs, text, WiFi credentials, and more with customizable styling.',
      href: '/qr-generator',
      icon: <QrIcon />,
      category: 'Utilities',
      isNew: true
    },
    {
      title: 'Image Compressor',
      description: 'Compress and optimize images while maintaining quality. Supports JPEG, PNG, and WebP formats.',
      href: '/image-compressor',
      icon: <ImageIcon />,
      category: 'Media',
      isFeatured: true
    },
    {
      title: 'Code Formatter',
      description: 'Format and beautify code in multiple programming languages with syntax highlighting.',
      href: '/code-formatter',
      icon: <CodeIcon />,
      category: 'Development'
    },
    {
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more.',
      href: '/text-case-converter',
      icon: <TextIcon />,
      category: 'Text Processing'
    },
    {
      title: 'PDF Tools',
      description: 'Merge, split, compress, and convert PDF documents with advanced processing options.',
      href: '/pdf-tools',
      icon: <PdfIcon />,
      category: 'Documents',
      isPopular: true,
      isNew: true
    },
    {
      title: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, and other cryptographic hashes for text and files.',
      href: '/hash-generator',
      icon: <CryptoIcon />,
      category: 'Security'
    },
    {
      title: 'Color Palette Generator',
      description: 'Create beautiful color palettes and gradients for your design projects with export options.',
      href: '/color-palette',
      icon: <ColorIcon />,
      category: 'Design',
      isFeatured: true
    }
  ];

  const renderVariantsDemo = () => (
    <div className="space-y-12">
      {/* Default Variant */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Default Variant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTools.slice(0, 3).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              variant="default"
            />
          ))}
        </div>
      </section>

      {/* Compact Variant */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Compact Variant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleTools.slice(0, 4).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* Featured Variant */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Featured Variant</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sampleTools.slice(0, 2).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              variant="featured"
              isFeatured={true}
            />
          ))}
        </div>
      </section>
    </div>
  );

  const renderBadgesDemo = () => (
    <div className="space-y-12">
      {/* New Badge */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">New Badge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTools.slice(0, 3).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              isNew={true}
              isPopular={false}
              isFeatured={false}
            />
          ))}
        </div>
      </section>

      {/* Popular Badge */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Popular Badge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTools.slice(3, 6).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              isNew={false}
              isPopular={true}
              isFeatured={false}
            />
          ))}
        </div>
      </section>

      {/* Featured Badge */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Featured Badge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleTools.slice(6, 8).map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              isNew={false}
              isPopular={false}
              isFeatured={true}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Multiple Badges */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Multiple Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ToolCard
            title="Ultimate PDF Toolkit"
            description="The most comprehensive PDF processing tool with merge, split, compress, convert, and security features all in one place."
            href="/pdf-toolkit"
            icon={<PdfIcon />}
            category="Documents"
            isNew={true}
            isPopular={true}
            isFeatured={true}
            variant="featured"
          />
          <ToolCard
            title="AI Code Assistant"
            description="Advanced code formatting, optimization, and documentation generation powered by artificial intelligence."
            href="/ai-code-assistant"
            icon={<CodeIcon />}
            category="Development"
            isNew={true}
            isPopular={true}
            variant="featured"
          />
        </div>
      </section>
    </div>
  );

  const renderCategoriesDemo = () => (
    <div className="space-y-12">
      {/* Development Tools */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Development Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="JSON Formatter"
            description="Format, validate, and beautify JSON data with syntax highlighting."
            href="/json-formatter"
            icon={<JsonIcon />}
            category="Development"
            isPopular={true}
          />
          <ToolCard
            title="Code Formatter"
            description="Format code in multiple programming languages with syntax highlighting."
            href="/code-formatter"
            icon={<CodeIcon />}
            category="Development"
          />
          <ToolCard
            title="Hash Generator"
            description="Generate cryptographic hashes for security and verification."
            href="/hash-generator"
            icon={<CryptoIcon />}
            category="Development"
            isNew={true}
          />
        </div>
      </section>

      {/* Media Tools */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Media Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="Image Compressor"
            description="Compress and optimize images while maintaining quality."
            href="/image-compressor"
            icon={<ImageIcon />}
            category="Media"
            isFeatured={true}
          />
          <ToolCard
            title="Color Palette Generator"
            description="Create beautiful color palettes for your design projects."
            href="/color-palette"
            icon={<ColorIcon />}
            category="Media"
          />
          <ToolCard
            title="QR Code Generator"
            description="Generate customizable QR codes for various purposes."
            href="/qr-generator"
            icon={<QrIcon />}
            category="Media"
            isPopular={true}
          />
        </div>
      </section>

      {/* Text Processing */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Text Processing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolCard
            title="Text Case Converter"
            description="Convert text between different cases and formats."
            href="/text-case-converter"
            icon={<TextIcon />}
            category="Text Processing"
            variant="compact"
          />
          <ToolCard
            title="PDF Text Extractor"
            description="Extract and process text content from PDF documents."
            href="/pdf-text-extractor"
            icon={<PdfIcon />}
            category="Text Processing"
            variant="compact"
          />
        </div>
      </section>
    </div>
  );

  const renderGridDemo = () => (
    <div className="space-y-12">
      {/* Responsive Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Responsive Tool Grid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleTools.map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
            />
          ))}
        </div>
      </section>

      {/* Mixed Layout */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Mixed Layout</h2>
        <div className="space-y-8">
          {/* Featured Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ToolCard
              {...sampleTools[0]}
              variant="featured"
              isFeatured={true}
            />
            <ToolCard
              {...sampleTools[1]}
              variant="featured"
              isFeatured={true}
            />
          </div>
          
          {/* Regular Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTools.slice(2, 8).map((tool, index) => (
              <ToolCard
                key={index}
                {...tool}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Compact Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Compact Grid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sampleTools.map((tool, index) => (
            <ToolCard
              key={index}
              {...tool}
              variant="compact"
            />
          ))}
        </div>
      </section>
    </div>
  );

  const demos = {
    variants: renderVariantsDemo,
    badges: renderBadgesDemo,
    categories: renderCategoriesDemo,
    grid: renderGridDemo
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Demo Navigation */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">ToolCard Demo</h1>
            
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

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {demos[currentDemo]()}
        
        {/* Usage Guidelines */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="outlined" title="Best Practices" padding="lg">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use descriptive titles that clearly indicate tool purpose</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep descriptions concise but informative (2-3 lines)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use meaningful icons that represent the tool's function</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Apply badges sparingly - only when truly relevant</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Group tools by category for better organization</span>
                </li>
              </ul>
            </Card>
            
            <Card variant="outlined" title="When to Use Each Variant" padding="lg">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-2">Default</h4>
                  <p className="text-gray-300">Standard tool listings, category pages, search results</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Compact</h4>
                  <p className="text-gray-300">Dense grids, sidebar listings, mobile views with many items</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Featured</h4>
                  <p className="text-gray-300">Hero sections, promoted tools, landing page highlights</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ToolCardDemo;