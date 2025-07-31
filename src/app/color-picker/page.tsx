'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { EyeDropperIcon, CloudArrowUpIcon, ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  x: number;
  y: number;
}

interface ColorPalette {
  colors: string[];
  name: string;
}

export default function ColorPicker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<ColorInfo[]>([]);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<ColorInfo | null>(null);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    const img = new Image();
    img.onload = () => {
      setImage(img);
      extractDominantColors(img);
    };
    img.src = url;
  }, []);

  const extractDominantColors = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Resize for performance
    const maxSize = 100;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    
    const colorCount: { [key: string]: number } = {};
    const data = imageData.data;
    
    // Sample every few pixels for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha > 128) { // Skip transparent pixels
        const hex = rgbToHex(r, g, b);
        colorCount[hex] = (colorCount[hex] || 0) + 1;
      }
    }
    
    // Get top colors
    const sortedColors = Object.entries(colorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([color]) => color);
    
    setDominantColors(sortedColors);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const colorInfo: ColorInfo = {
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
      x: Math.round(x),
      y: Math.round(y)
    };
    
    setCurrentColor(colorInfo);
    setSelectedColors(prev => [...prev, colorInfo]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current || !isPickingColor) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const colorInfo: ColorInfo = {
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
      x: Math.round(x),
      y: Math.round(y)
    };
    
    setCurrentColor(colorInfo);
  };

  const drawImageOnCanvas = () => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate dimensions to fit image in canvas while maintaining aspect ratio
    const maxWidth = 600;
    const maxHeight = 400;
    let { width, height } = image;
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(image, 0, 0, width, height);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const removeColor = (index: number) => {
    setSelectedColors(prev => prev.filter((_, i) => i !== index));
  };

  const exportPalette = () => {
    const colors = [...new Set(selectedColors.map(c => c.hex))];
    const paletteData = {
      name: `Palette_${new Date().toISOString().split('T')[0]}`,
      colors: colors,
      extracted_from: 'Image Color Picker',
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color_palette_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Draw image when it changes
  useEffect(() => {
    if (image) {
      drawImageOnCanvas();
    }
  }, [image]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 via-rose-500 to-orange-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <EyeDropperIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Color Picker from Image
              </h1>
              <p className="text-lg md:text-xl text-pink-100 mt-2">
                Extract colors from images and create palettes
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-sm">Click to Pick</span>
            <span className="bg-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-sm">Dominant Colors</span>
            <span className="bg-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-sm">Export Palette</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {!image ? (
            // File Upload Area
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
              <div className="text-center py-12">
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-pink-500 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    if (files[0]) handleFileUpload(files[0]);
                  }}
                >
                  <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Choose an image to extract colors
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Upload any image format (PNG, JPEG, WebP, etc.)
                  </p>
                  <label htmlFor="file-input" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
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
            // Color Picking Interface
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Image Canvas */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Click on Image to Pick Colors</h3>
                    <button
                      onClick={() => setIsPickingColor(!isPickingColor)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isPickingColor
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {isPickingColor ? 'Disable Picker' : 'Enable Picker'}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      onMouseMove={handleMouseMove}
                      className={`w-full border border-gray-700 rounded-lg ${
                        isPickingColor ? 'cursor-crosshair' : 'cursor-pointer'
                      }`}
                      style={{ maxHeight: '400px' }}
                    />
                    
                    {/* Current Color Preview */}
                    {currentColor && isPickingColor && (
                      <div className="absolute top-2 right-2 bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div 
                          className="w-8 h-8 rounded border border-gray-600 mb-2"
                          style={{ backgroundColor: currentColor.hex }}
                        />
                        <div className="text-xs text-gray-300">
                          {currentColor.hex}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Information Panel */}
              <div className="space-y-6">
                
                {/* Dominant Colors */}
                {dominantColors.length > 0 && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4">Dominant Colors</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {dominantColors.map((color, index) => (
                        <div key={index} className="group cursor-pointer">
                          <div
                            className="w-full h-12 rounded border border-gray-600 hover:border-pink-500 transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => copyToClipboard(color)}
                            title={`Click to copy ${color}`}
                          />
                          <div className="text-xs text-gray-400 mt-1 text-center">
                            {color}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Picked Colors */}
                {selectedColors.length > 0 && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Picked Colors ({selectedColors.length})</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={exportPalette}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                          Export
                        </button>
                        <button
                          onClick={() => setSelectedColors([])}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedColors.map((color, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded border border-gray-600 flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white">{color.hex}</div>
                              <div className="text-xs text-gray-400">{color.rgb}</div>
                              <div className="text-xs text-gray-400">{color.hsl}</div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => copyToClipboard(color.hex)}
                                className="text-gray-400 hover:text-white"
                                title="Copy HEX"
                              >
                                <ClipboardIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeColor(index)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Color Details */}
                {currentColor && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4">Current Color</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded border border-gray-600"
                          style={{ backgroundColor: currentColor.hex }}
                        />
                        <div>
                          <div className="text-sm text-gray-400">Position</div>
                          <div className="text-white">{currentColor.x}, {currentColor.y}</div>
                        </div>
                      </div>
                      
                      {/* Color Formats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">HEX:</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-800 px-2 py-1 rounded text-sm">{currentColor.hex}</code>
                            <button
                              onClick={() => copyToClipboard(currentColor.hex)}
                              className="text-gray-400 hover:text-white"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">RGB:</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-800 px-2 py-1 rounded text-sm">{currentColor.rgb}</code>
                            <button
                              onClick={() => copyToClipboard(currentColor.rgb)}
                              className="text-gray-400 hover:text-white"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">HSL:</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-800 px-2 py-1 rounded text-sm">{currentColor.hsl}</code>
                            <button
                              onClick={() => copyToClipboard(currentColor.hsl)}
                              className="text-gray-400 hover:text-white"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setImage(null);
                    setImageUrl('');
                    setSelectedColors([]);
                    setDominantColors([]);
                    setCurrentColor(null);
                    setIsPickingColor(false);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Pick Colors from Another Image
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-pink-400 mb-2">Picking Colors</h4>
                <p className="text-sm">
                  Click anywhere on the image to extract the color at that pixel. Enable picker mode to see colors as you hover.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-pink-400 mb-2">Dominant Colors</h4>
                <p className="text-sm">
                  Automatically extracted dominant colors from the image. Click any color swatch to copy its hex code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
