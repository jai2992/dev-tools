'use client';

import { useState, useCallback } from 'react';
import { PhotoIcon, CloudArrowUpIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'jpeg' | 'webp'>('jpeg');
  const [processing, setProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<string>('');

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-compress on upload
    compressImage(file, quality, format);
  }, [quality, format]);

  const compressImage = async (file: File, qualityValue: number, formatType: 'jpeg' | 'webp') => {
    setProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              setCompressedSize(blob.size);
              
              const compressedUrl = URL.createObjectURL(blob);
              setCompressedPreviewUrl(compressedUrl);
            }
            setProcessing(false);
          },
          formatType === 'jpeg' ? 'image/jpeg' : 'image/webp',
          qualityValue / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Compression failed:', error);
      setProcessing(false);
    }
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (originalFile) {
      compressImage(originalFile, newQuality, format);
    }
  };

  const handleFormatChange = (newFormat: 'jpeg' | 'webp') => {
    setFormat(newFormat);
    if (originalFile) {
      compressImage(originalFile, quality, newFormat);
    }
  };

  const downloadCompressed = () => {
    if (compressedBlob && originalFile) {
      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      const extension = format === 'jpeg' ? 'jpg' : 'webp';
      a.download = `compressed_${originalFile.name.split('.')[0]}.${extension}`;
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

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <PhotoIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Image Compressor
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mt-2">
                Reduce image file sizes while maintaining quality
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">Free</span>
            <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">No Registration</span>
            <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">Privacy-First</span>
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
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    if (files[0]) handleFileUpload(files[0]);
                  }}
                >
                  <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Choose an image or drag and drop
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Supports JPEG, PNG, WebP formats
                  </p>
                  <label htmlFor="file-input" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
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
              // Image Processing Interface
              <div className="space-y-8">
                
                {/* Controls */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Compression Settings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality Slider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Smaller size</span>
                        <span>Better quality</span>
                      </div>
                    </div>
                    
                    {/* Format Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Output Format
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleFormatChange('jpeg')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            format === 'jpeg'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          JPEG
                        </button>
                        <button
                          onClick={() => handleFormatChange('webp')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            format === 'webp'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          WebP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Size Comparison */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">File Size Comparison</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-300">{formatFileSize(originalSize)}</div>
                      <div className="text-sm text-gray-400">Original</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{formatFileSize(compressedSize)}</div>
                      <div className="text-sm text-gray-400">Compressed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{compressionRatio.toFixed(1)}%</div>
                      <div className="text-sm text-gray-400">Size Reduction</div>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-300">Original</h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-auto max-h-64 object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Compressed Image */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-300">Compressed</h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      {processing ? (
                        <div className="h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : compressedPreviewUrl ? (
                        <img
                          src={compressedPreviewUrl}
                          alt="Compressed"
                          className="w-full h-auto max-h-64 object-contain rounded"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={downloadCompressed}
                    disabled={!compressedBlob || processing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download Compressed Image
                  </button>
                  
                  <button
                    onClick={() => {
                      setOriginalFile(null);
                      setCompressedBlob(null);
                      setPreviewUrl('');
                      setCompressedPreviewUrl('');
                      setOriginalSize(0);
                      setCompressedSize(0);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Compress Another Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">How Image Compression Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Quality vs Size</h4>
                <p className="text-sm">
                  Lower quality settings remove more image data, resulting in smaller file sizes but potentially visible compression artifacts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Format Comparison</h4>
                <p className="text-sm">
                  WebP typically provides 25-35% better compression than JPEG while maintaining similar quality. JPEG is more universally supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
