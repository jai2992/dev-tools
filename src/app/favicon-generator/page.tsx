'use client';

import { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Button, Input, Select, Card, PageHeader } from '@/components/common';

interface FaviconSize {
  size: number;
  name: string;
  format: 'png' | 'ico';
}

const faviconSizes: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png', format: 'png' },
  { size: 32, name: 'favicon-32x32.png', format: 'png' },
  { size: 48, name: 'favicon-48x48.png', format: 'png' },
  { size: 64, name: 'favicon-64x64.png', format: 'png' },
  { size: 96, name: 'favicon-96x96.png', format: 'png' },
  { size: 128, name: 'favicon-128x128.png', format: 'png' },
  { size: 180, name: 'apple-touch-icon.png', format: 'png' },
  { size: 192, name: 'android-chrome-192x192.png', format: 'png' },
  { size: 512, name: 'android-chrome-512x512.png', format: 'png' }
];

export default function FaviconGeneratorPage() {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('DT');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [borderRadius, setBorderRadius] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<{ [key: number]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBg, setSelectedBg] = useState<string>('color');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgroundOptions = [
    { value: 'color', label: 'Solid Color' },
    { value: 'transparent', label: 'Transparent' },
    { value: 'gradient', label: 'Gradient' }
  ];

  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const drawFavicon = useCallback((size: number): string => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return '';
    }
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background
    if (selectedBg === 'transparent') {
      // Keep transparent
    } else if (selectedBg === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, textColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
    }

    // Apply border radius
    if (borderRadius > 0) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      const radius = Math.min(borderRadius, size / 2);
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    if (mode === 'image' && uploadedImage) {
      // Draw uploaded image
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      };
      img.src = uploadedImage;
    } else {
      // Draw text
      const scaledFontSize = (fontSize * size) / 64;
      ctx.font = `${scaledFontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, size / 2, size / 2);
    }

    return canvas.toDataURL('image/png');
  }, [mode, text, fontSize, textColor, backgroundColor, fontFamily, borderRadius, uploadedImage, selectedBg]);

  const generateFavicons = async () => {
    setIsGenerating(true);
    const favicons: { [key: number]: string } = {};

    // Generate a small delay to show each favicon being created
    for (const faviconSize of faviconSizes) {
      await new Promise(resolve => setTimeout(resolve, 100));
      favicons[faviconSize.size] = drawFavicon(faviconSize.size);
    }

    setGeneratedFavicons(favicons);
    setIsGenerating(false);
  };

  const downloadFavicon = (size: number, filename: string) => {
    const dataUrl = generatedFavicons[size];
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAll = () => {
    faviconSizes.forEach(({ size, name }) => {
      setTimeout(() => downloadFavicon(size, name), size); // Stagger downloads
    });
  };

  const generateHTMLCode = () => {
    return `<!-- Favicon links for your HTML head -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">`;
  };

  const copyHTMLCode = async () => {
    try {
      await navigator.clipboard.writeText(generateHTMLCode());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Favicon Generator | Create Icons for Web & Mobile | devtools.software</title>
        <meta name="description" content="Generate favicons in multiple sizes from text or images. Create icons for web, mobile, and desktop applications with instant download." />
        <meta property="og:title" content="Favicon Generator - Create Web Icons" />
        <meta property="og:description" content="Generate favicons and app icons from text or images" />
        <meta property="og:url" content="https://devtools.software/favicon-generator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title="Favicon Generator"
        description="Generate favicons and app icons from text or images"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Mode Selection */}
          <Card title="Create Favicon">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={mode === 'text' ? 'primary' : 'secondary'}
                    onClick={() => setMode('text')}
                  >
                    📝 Text
                  </Button>
                  <Button
                    variant={mode === 'image' ? 'primary' : 'secondary'}
                    onClick={() => setMode('image')}
                  >
                    🖼️ Image
                  </Button>
                </div>

                {mode === 'text' ? (
                  <div className="space-y-4">
                    <Input
                      label="Text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter 1-2 characters"
                      maxLength={3}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Size: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <Select
                        label="Font Family"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Text Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                          />
                          <Input
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <Select
                        label="Background"
                        value={selectedBg}
                        onChange={(e) => setSelectedBg(e.target.value)}
                      >
                        {backgroundOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {selectedBg !== 'transparent' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                          />
                          <Input
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Border Radius: {borderRadius}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Button
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        📁 Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: Square images (1:1 ratio) for best results
                      </p>
                    </div>

                    {uploadedImage && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded" 
                          className="max-w-32 max-h-32 rounded border border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Live Preview</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[16, 32, 48, 64].map(size => (
                    <div key={size} className="bg-gray-800 rounded-lg p-4 text-center">
                      <div 
                        className="mx-auto border border-gray-600 rounded"
                        style={{ 
                          width: size, 
                          height: size,
                          backgroundImage: `url("${drawFavicon(size)}")`,
                          backgroundSize: 'cover'
                        }}
                      />
                      <p className="text-xs text-gray-400 mt-2">{size}×{size}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={generateFavicons}
                  disabled={isGenerating || (mode === 'text' && !text.trim()) || (mode === 'image' && !uploadedImage)}
                  className="w-full"
                >
                  {isGenerating ? '🔄 Generating...' : '🚀 Generate All Sizes'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Generated Favicons */}
          {Object.keys(generatedFavicons).length > 0 && (
            <Card 
              title="Generated Favicons"
              actions={
                <Button onClick={downloadAll}>
                  📦 Download All
                </Button>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {faviconSizes.map(({ size, name }) => (
                  <div key={size} className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="bg-white rounded mb-3 p-2 inline-block">
                      <img 
                        src={generatedFavicons[size]} 
                        alt={`${size}x${size} favicon`}
                        className="block"
                        style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                      />
                    </div>
                    <p className="text-sm text-white font-medium">{size}×{size}</p>
                    <p className="text-xs text-gray-400 mb-3">{name}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadFavicon(size, name)}
                      className="w-full"
                    >
                      💾 Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* HTML Code */}
          {Object.keys(generatedFavicons).length > 0 && (
            <Card 
              title="HTML Code"
              actions={
                <Button onClick={copyHTMLCode}>
                  📋 Copy HTML
                </Button>
              }
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <pre className="text-white font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                  {generateHTMLCode()}
                </pre>
              </div>
            </Card>
          )}

          {/* Usage Instructions */}
          <Card title="How to Use">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Creating Favicons</h4>
                <ul className="space-y-1">
                  <li>• Choose text mode for simple letter/symbol icons</li>
                  <li>• Upload images for custom logo favicons</li>
                  <li>• Adjust colors and styling options</li>
                  <li>• Preview in multiple sizes before generating</li>
                  <li>• Download individual sizes or all at once</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Installation</h4>
                <ul className="space-y-1">
                  <li>• Download all generated favicon files</li>
                  <li>• Upload them to your website's root directory</li>
                  <li>• Copy the HTML code to your &lt;head&gt; section</li>
                  <li>• Test across different browsers and devices</li>
                  <li>• Update your web app manifest if needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Best Practices</h4>
                <ul className="space-y-1">
                  <li>• Use simple, recognizable designs</li>
                  <li>• Ensure good contrast for small sizes</li>
                  <li>• Test readability at 16x16 pixels</li>
                  <li>• Keep consistent branding colors</li>
                  <li>• Consider dark/light theme compatibility</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Supported Formats</h4>
                <ul className="space-y-1">
                  <li>• PNG format for all modern browsers</li>
                  <li>• Multiple sizes for different contexts</li>
                  <li>• Apple Touch Icon for iOS devices</li>
                  <li>• Android Chrome icons for PWAs</li>
                  <li>• Standard favicon sizes included</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
