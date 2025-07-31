'use client';

import { useState, useCallback } from 'react';
import { PhotoIcon, CloudArrowUpIcon, ArrowDownTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function ImageResizer() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number | ''>('');
  const [targetHeight, setTargetHeight] = useState<number | ''>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedPreviewUrl, setResizedPreviewUrl] = useState<string>('');

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Cover', width: 1584, height: 396 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Profile Picture', width: 400, height: 400 },
    { name: 'Web Banner', width: 1920, height: 1080 }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setOriginalFile(file);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetWidth(img.width);
      setTargetHeight(img.height);
    };
    img.src = url;
  }, []);

  const calculateAspectRatio = (width: number, height: number, newWidth?: number, newHeight?: number) => {
    const aspectRatio = width / height;
    
    if (newWidth && !newHeight) {
      return { width: newWidth, height: Math.round(newWidth / aspectRatio) };
    } else if (newHeight && !newWidth) {
      return { width: Math.round(newHeight * aspectRatio), height: newHeight };
    }
    
    return { width: newWidth || width, height: newHeight || height };
  };

  const handleWidthChange = (value: string) => {
    const width = value === '' ? '' : parseInt(value);
    setTargetWidth(width);
    
    if (maintainAspectRatio && width && originalDimensions.width && originalDimensions.height) {
      const newDimensions = calculateAspectRatio(originalDimensions.width, originalDimensions.height, width);
      setTargetHeight(newDimensions.height);
    }
  };

  const handleHeightChange = (value: string) => {
    const height = value === '' ? '' : parseInt(value);
    setTargetHeight(height);
    
    if (maintainAspectRatio && height && originalDimensions.width && originalDimensions.height) {
      const newDimensions = calculateAspectRatio(originalDimensions.width, originalDimensions.height, undefined, height);
      setTargetWidth(newDimensions.width);
    }
  };

  const resizeImage = async () => {
    if (!originalFile || !targetWidth || !targetHeight) return;
    
    setProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = targetWidth as number;
        canvas.height = targetHeight as number;
        
        ctx?.drawImage(img, 0, 0, targetWidth as number, targetHeight as number);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResizedBlob(blob);
              const resizedUrl = URL.createObjectURL(blob);
              setResizedPreviewUrl(resizedUrl);
            }
            setProcessing(false);
          },
          originalFile.type,
          0.95
        );
      };
      
      img.src = URL.createObjectURL(originalFile);
    } catch (error) {
      console.error('Resize failed:', error);
      setProcessing(false);
    }
  };

  const applyPreset = (preset: { width: number; height: number }) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
  };

  const downloadResized = () => {
    if (resizedBlob && originalFile) {
      const url = URL.createObjectURL(resizedBlob);
      const a = document.createElement('a');
      a.href = url;
      const extension = originalFile.name.split('.').pop();
      a.download = `resized_${targetWidth}x${targetHeight}_${originalFile.name.split('.')[0]}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <PhotoIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Image Resizer
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mt-2">
                Resize images with precision and maintain quality
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Free</span>
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Batch Processing</span>
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">Aspect Ratio Lock</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!originalFile ? (
              // File Upload Area
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
                    Choose an image to resize
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Supports JPEG, PNG, WebP, GIF formats
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
            ) : (
              // Image Resizing Interface
              <div className="space-y-8">
                
                {/* Current Dimensions Display */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Image</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-300">{originalDimensions.width}px</div>
                      <div className="text-sm text-gray-400">Width</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-300">{originalDimensions.height}px</div>
                      <div className="text-sm text-gray-400">Height</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {originalFile ? formatFileSize(originalFile.size) : '0 KB'}
                      </div>
                      <div className="text-sm text-gray-400">File Size</div>
                    </div>
                  </div>
                </div>

                {/* Resize Controls */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Cog6ToothIcon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">Resize Settings</h3>
                  </div>
                  
                  {/* Custom Dimensions */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                          />
                          Lock aspect ratio
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preset Sizes */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-300 mb-3">Quick Presets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {presetSizes.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                        >
                          <div className="font-semibold">{preset.name}</div>
                          <div className="text-xs text-gray-400">{preset.width}×{preset.height}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resize Button */}
                  <div className="mt-6">
                    <button
                      onClick={resizeImage}
                      disabled={!targetWidth || !targetHeight || processing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto"
                    >
                      {processing ? 'Resizing...' : 'Resize Image'}
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-300">
                      Original ({originalDimensions.width}×{originalDimensions.height})
                    </h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-auto max-h-64 object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Resized Image */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-300">
                      Resized ({targetWidth}×{targetHeight})
                    </h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      {processing ? (
                        <div className="h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                      ) : resizedPreviewUrl ? (
                        <img
                          src={resizedPreviewUrl}
                          alt="Resized"
                          className="w-full h-auto max-h-64 object-contain rounded"
                        />
                      ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                          Click &quot;Resize Image&quot; to see preview
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {resizedBlob && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={downloadResized}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download Resized Image
                    </button>
                    
                    <button
                      onClick={() => {
                        setOriginalFile(null);
                        setResizedBlob(null);
                        setPreviewUrl('');
                        setResizedPreviewUrl('');
                        setTargetWidth('');
                        setTargetHeight('');
                        setOriginalDimensions({ width: 0, height: 0 });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Resize Another Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Image Resizing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Aspect Ratio</h4>
                <p className="text-sm">
                  Keep aspect ratio locked to maintain image proportions and avoid distortion. Unlock only when you need specific dimensions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Quality Preservation</h4>
                <p className="text-sm">
                  For best quality, avoid enlarging images beyond their original size. Reducing size typically maintains better quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
