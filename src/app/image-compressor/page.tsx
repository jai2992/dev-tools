'use client';

import { useState, useCallback } from 'react';
import { PhotoIcon, CloudArrowUpIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/FileUpload';
import ProgressBar from '../../components/common/ProgressBar';

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
    <PageLayout 
      title="Image Compressor" 
      description="Reduce image file sizes while maintaining quality"
    >
      <div className="max-w-6xl mx-auto">
        <Card variant="default" padding="lg">
          {!originalFile ? (
            // File Upload Area
            <FileUpload
              onFileSelect={(files) => files[0] && handleFileUpload(files[0])}
              accept="image/*"
              multiple={false}
              maxSize={50}
              label="Choose an image or drag and drop"
              helpText="Supports JPEG, PNG, WebP formats up to 50MB"
              variant="large"
            />
          ) : (
            // Image Processing Interface
            <div className="space-y-8">
              
              {/* Controls */}
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-[var(--color-text-primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Compression Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quality Slider */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-[var(--color-surface-elevated)] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
                      <span>Smaller size</span>
                      <span>Better quality</span>
                    </div>
                  </div>
                  
                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Output Format
                    </label>
                    <div className="flex gap-3">
                      <Button
                        variant={format === 'jpeg' ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => handleFormatChange('jpeg')}
                      >
                        JPEG
                      </Button>
                      <Button
                        variant={format === 'webp' ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => handleFormatChange('webp')}
                      >
                        WebP
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* File Size Comparison */}
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">File Size Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{formatFileSize(originalSize)}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Original</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-success)]">{formatFileSize(compressedSize)}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Compressed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{compressionRatio.toFixed(1)}%</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Size Reduction</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {processing && (
                  <div className="mt-4">
                    <ProgressBar 
                      progress={50} 
                      label="Compressing image..." 
                      animated={true}
                      variant="default"
                    />
                  </div>
                )}
              </Card>

              {/* Image Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Image */}
                <Card variant="elevated" padding="lg">
                  <h4 className="text-md font-semibold mb-3 text-[var(--color-text-primary)]">Original</h4>
                  <div className="bg-[var(--color-surface-elevated)] rounded-lg p-4">
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full h-auto max-h-64 object-contain rounded"
                    />
                  </div>
                </Card>

                {/* Compressed Image */}
                <Card variant="elevated" padding="lg">
                  <h4 className="text-md font-semibold mb-3 text-[var(--color-text-primary)]">Compressed</h4>
                  <div className="bg-[var(--color-surface-elevated)] rounded-lg p-4">
                    {processing ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-text-primary)] border-t-transparent"></div>
                      </div>
                    ) : compressedPreviewUrl ? (
                      <img
                        src={compressedPreviewUrl}
                        alt="Compressed"
                        className="w-full h-auto max-h-64 object-contain rounded"
                      />
                    ) : null}
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={downloadCompressed}
                  disabled={!compressedBlob || processing}
                  icon={<ArrowDownTrayIcon className="w-5 h-5" />}
                >
                  Download Compressed Image
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setOriginalFile(null);
                    setCompressedBlob(null);
                    setPreviewUrl('');
                    setCompressedPreviewUrl('');
                    setOriginalSize(0);
                    setCompressedSize(0);
                  }}
                >
                  Compress Another Image
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Info Section */}
        <Card variant="outlined" padding="lg" className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">How Image Compression Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">Quality vs Size</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Lower quality settings remove more image data, resulting in smaller file sizes but potentially visible compression artifacts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">Format Comparison</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                WebP typically provides 25-35% better compression than JPEG while maintaining similar quality. JPEG is more universally supported.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
