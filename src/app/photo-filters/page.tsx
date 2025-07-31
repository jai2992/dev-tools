'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PhotoIcon, CloudArrowUpIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  sepia: number;
  grayscale: number;
  blur: number;
  invert: number;
  opacity: number;
}

interface PresetFilter {
  name: string;
  settings: FilterSettings;
  description: string;
}

export default function PhotoFilters() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [filteredBlob, setFilteredBlob] = useState<Blob | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [filteredUrl, setFilteredUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  
  const [settings, setSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    grayscale: 0,
    blur: 0,
    invert: 0,
    opacity: 100
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filteredCanvasRef = useRef<HTMLCanvasElement>(null);

  const presetFilters: PresetFilter[] = [
    {
      name: 'Original',
      description: 'No filters applied',
      settings: { brightness: 100, contrast: 100, saturation: 100, hue: 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Vintage',
      description: 'Warm, retro look',
      settings: { brightness: 110, contrast: 95, saturation: 80, hue: 10, sepia: 30, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Black & White',
      description: 'Classic monochrome',
      settings: { brightness: 100, contrast: 110, saturation: 100, hue: 0, sepia: 0, grayscale: 100, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Sepia',
      description: 'Old photo effect',
      settings: { brightness: 105, contrast: 100, saturation: 100, hue: 0, sepia: 100, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'High Contrast',
      description: 'Bold and dramatic',
      settings: { brightness: 100, contrast: 150, saturation: 120, hue: 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Soft Focus',
      description: 'Dreamy, blurred effect',
      settings: { brightness: 110, contrast: 90, saturation: 110, hue: 0, sepia: 0, grayscale: 0, blur: 2, invert: 0, opacity: 100 }
    },
    {
      name: 'Cool Tone',
      description: 'Blue-tinted mood',
      settings: { brightness: 100, contrast: 105, saturation: 90, hue: -15, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Warm Tone',
      description: 'Orange-tinted mood',
      settings: { brightness: 105, contrast: 100, saturation: 110, hue: 15, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 100 }
    },
    {
      name: 'Negative',
      description: 'Inverted colors',
      settings: { brightness: 100, contrast: 100, saturation: 100, hue: 0, sepia: 0, grayscale: 0, blur: 0, invert: 100, opacity: 100 }
    }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    
    // Load and draw original image
    const img = new Image();
    img.onload = () => {
      drawImageToCanvas(img, canvasRef.current);
      applyFilters();
    };
    img.src = url;
  }, []);

  const drawImageToCanvas = (img: HTMLImageElement, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions to fit image while maintaining aspect ratio
    const maxWidth = 400;
    const maxHeight = 300;
    let { width, height } = img;
    
    const aspectRatio = width / height;
    
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(img, 0, 0, width, height);
  };

  const generateFilterCSS = (settings: FilterSettings): string => {
    return [
      `brightness(${settings.brightness}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
      `hue-rotate(${settings.hue}deg)`,
      `sepia(${settings.sepia}%)`,
      `grayscale(${settings.grayscale}%)`,
      `blur(${settings.blur}px)`,
      `invert(${settings.invert}%)`,
      `opacity(${settings.opacity}%)`
    ].join(' ');
  };

  const applyFilters = async () => {
    if (!originalFile) return;
    
    setProcessing(true);
    
    try {
      const originalCanvas = canvasRef.current;
      const filteredCanvas = filteredCanvasRef.current;
      
      if (!originalCanvas || !filteredCanvas) return;
      
      const originalCtx = originalCanvas.getContext('2d');
      const filteredCtx = filteredCanvas.getContext('2d');
      
      if (!originalCtx || !filteredCtx) return;
      
      // Set up filtered canvas
      filteredCanvas.width = originalCanvas.width;
      filteredCanvas.height = originalCanvas.height;
      
      // Apply CSS filters to the context
      filteredCtx.filter = generateFilterCSS(settings);
      
      // Draw the original image with filters applied
      filteredCtx.drawImage(originalCanvas, 0, 0);
      
      // Reset filter for future operations
      filteredCtx.filter = 'none';
      
      // Convert to blob
      filteredCanvas.toBlob((blob) => {
        if (blob) {
          setFilteredBlob(blob);
          const url = URL.createObjectURL(blob);
          setFilteredUrl(url);
        }
        setProcessing(false);
      });
      
    } catch (error) {
      console.error('Filter application failed:', error);
      setProcessing(false);
    }
  };

  const applyPreset = (preset: PresetFilter) => {
    setSettings(preset.settings);
  };

  const resetFilters = () => {
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      invert: 0,
      opacity: 100
    });
  };

  const downloadFiltered = () => {
    if (filteredBlob && originalFile) {
      const url = URL.createObjectURL(filteredBlob);
      const a = document.createElement('a');
      a.href = url;
      const extension = originalFile.name.split('.').pop();
      a.download = `filtered_${originalFile.name.split('.')[0]}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Apply filters when settings change
  useEffect(() => {
    if (originalFile) {
      const timeoutId = setTimeout(() => {
        applyFilters();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [settings, originalFile]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <PhotoIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Photo Filters & Effects
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mt-2">
                Apply Instagram-style filters and effects to your images
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Real-time Preview</span>
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Preset Filters</span>
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Custom Effects</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {!originalFile ? (
            // File Upload Area
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
              <div className="text-center py-12">
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-purple-500 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    if (files[0]) handleFileUpload(files[0]);
                  }}
                >
                  <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Choose an image to apply filters
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Upload any image format (PNG, JPEG, WebP, etc.)
                  </p>
                  <label htmlFor="file-input" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
                    Select Image
                  </label>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            // Filter Interface
            <div className="space-y-6">
              
              {/* Preset Filters */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Preset Filters</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                  {presetFilters.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="group relative bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors text-center"
                    >
                      <div className="text-xs font-medium text-white mb-1">{preset.name}</div>
                      <div className="text-xs text-gray-400">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Custom Filter Controls */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-400" />
                      Custom Filters
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Brightness */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Brightness: {settings.brightness}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contrast: {settings.contrast}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) => setSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Saturation: {settings.saturation}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) => setSettings(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Hue */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hue: {settings.hue}°
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.hue}
                        onChange={(e) => setSettings(prev => ({ ...prev, hue: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Sepia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sepia: {settings.sepia}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.sepia}
                        onChange={(e) => setSettings(prev => ({ ...prev, sepia: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Grayscale */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Grayscale: {settings.grayscale}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.grayscale}
                        onChange={(e) => setSettings(prev => ({ ...prev, grayscale: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Blur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Blur: {settings.blur}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={settings.blur}
                        onChange={(e) => setSettings(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Invert */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Invert: {settings.invert}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.invert}
                        onChange={(e) => setSettings(prev => ({ ...prev, invert: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Comparison */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Before/After Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                      <h4 className="text-md font-semibold mb-3 text-gray-300">Original</h4>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <canvas
                          ref={canvasRef}
                          className="w-full h-auto rounded"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    </div>

                    {/* Filtered */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                      <h4 className="text-md font-semibold mb-3 text-gray-300">With Filters</h4>
                      <div className="bg-gray-800 rounded-lg p-4">
                        {processing ? (
                          <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                          </div>
                        ) : (
                          <canvas
                            ref={filteredCanvasRef}
                            className="w-full h-auto rounded"
                            style={{ maxHeight: '300px' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={downloadFiltered}
                      disabled={!filteredBlob || processing}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download Filtered Image
                    </button>
                    
                    <button
                      onClick={() => {
                        setOriginalFile(null);
                        setFilteredBlob(null);
                        setOriginalUrl('');
                        setFilteredUrl('');
                        resetFilters();
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Apply Filters to Another Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Filter Effects Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Basic Adjustments</h4>
                <p className="text-sm">
                  Brightness, contrast, and saturation are the fundamental adjustments for improving image quality and mood.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Color Effects</h4>
                <p className="text-sm">
                  Hue rotation, sepia, and grayscale create different color moods and vintage effects.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Creative Filters</h4>
                <p className="text-sm">
                  Blur creates dreamy effects, while invert creates artistic negative images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
