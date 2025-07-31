'use client';

import { useState, useCallback } from 'react';
import { ArrowsRightLeftIcon, CloudArrowUpIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface ConvertedFile {
  blob: Blob;
  originalName: string;
  format: string;
  size: number;
}

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const supportedFormats = [
    { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
    { value: 'jpeg', label: 'JPEG', description: 'Smaller size, good for photos' },
    { value: 'webp', label: 'WebP', description: 'Modern format, best compression' }
  ];

  const handleFileUpload = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== newFiles.length) {
      alert('Some files were skipped. Only image files are supported.');
    }
    setFiles(prev => [...prev, ...imageFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setConvertedFiles([]);
    setCurrentProgress(0);
    
    const converted: ConvertedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentProgress(((i + 1) / files.length) * 100);
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const result = await new Promise<ConvertedFile | null>((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Handle transparency for PNG
            if (targetFormat === 'png') {
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
            } else {
              // Fill with white background for JPEG/WebP if source has transparency
              ctx!.fillStyle = '#FFFFFF';
              ctx?.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx?.drawImage(img, 0, 0);
            
            const mimeType = targetFormat === 'jpeg' ? 'image/jpeg' : 
                           targetFormat === 'webp' ? 'image/webp' : 'image/png';
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({
                    blob,
                    originalName: file.name,
                    format: targetFormat,
                    size: blob.size
                  });
                } else {
                  resolve(null);
                }
              },
              mimeType,
              targetFormat === 'jpeg' ? quality / 100 : undefined
            );
          };
          
          img.onerror = () => resolve(null);
          img.src = URL.createObjectURL(file);
        });
        
        if (result) {
          converted.push(result);
        }
      } catch (error) {
        console.error(`Failed to convert ${file.name}:`, error);
      }
    }
    
    setConvertedFiles(converted);
    setProcessing(false);
  };

  const downloadSingle = (convertedFile: ConvertedFile) => {
    const url = URL.createObjectURL(convertedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = convertedFile.originalName.split('.')[0];
    a.download = `${baseName}.${convertedFile.format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (convertedFiles.length === 0) return;
    
    if (convertedFiles.length === 1) {
      downloadSingle(convertedFiles[0]);
      return;
    }
    
    // Create ZIP for multiple files
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    convertedFiles.forEach((file) => {
      const baseName = file.originalName.split('.')[0];
      const fileName = `${baseName}.${file.format}`;
      zip.file(fileName, file.blob);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_images_${targetFormat}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Image Format Converter
              </h1>
              <p className="text-lg md:text-xl text-green-100 mt-2">
                Convert images between PNG, JPEG, and WebP formats
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm">Batch Processing</span>
            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm">Multiple Formats</span>
            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm">ZIP Download</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {/* File Upload Area */}
            <div className="mb-8">
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-green-500 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  handleFileUpload(droppedFiles);
                }}
              >
                <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2 text-center">
                  Choose images or drag and drop
                </h3>
                <p className="text-gray-400 mb-4 text-center">
                  Supports PNG, JPEG, WebP, GIF, BMP formats
                </p>
                <div className="text-center">
                  <label htmlFor="file-input" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
                    Select Images
                  </label>
                </div>
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);
                  handleFileUpload(selectedFiles);
                }}
                className="hidden"
              />
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Uploaded Files ({files.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">
                          {getFileExtension(file.name)} • {formatFileSize(file.size)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Settings */}
            {files.length > 0 && (
              <div className="mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Format Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Convert to:
                      </label>
                      <div className="space-y-3">
                        {supportedFormats.map((format) => (
                          <label key={format.value} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="format"
                              value={format.value}
                              checked={targetFormat === format.value}
                              onChange={(e) => setTargetFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                              className="mt-1 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500"
                            />
                            <div>
                              <div className="font-medium text-white">{format.label}</div>
                              <div className="text-xs text-gray-400">{format.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quality Setting (for JPEG) */}
                    {targetFormat === 'jpeg' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          JPEG Quality: {quality}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Smaller size</span>
                          <span>Better quality</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Convert Button */}
                  <div className="mt-6">
                    <button
                      onClick={convertImages}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto"
                    >
                      {processing ? `Converting... ${currentProgress.toFixed(0)}%` : `Convert ${files.length} Image${files.length > 1 ? 's' : ''}`}
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  {processing && (
                    <div className="mt-4">
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Converted Files */}
            {convertedFiles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Converted Files ({convertedFiles.length})</h3>
                  <button
                    onClick={downloadAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Download {convertedFiles.length > 1 ? 'All (ZIP)' : 'File'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {convertedFiles.map((file, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {file.originalName.split('.')[0]}.{file.format}
                          </div>
                          <div className="text-xs text-gray-400">
                            {file.format.toUpperCase()} • {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => downloadSingle(file)}
                          className="ml-2 text-green-400 hover:text-green-300 text-sm"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Preview */}
                      <div className="bg-gray-700 rounded p-2">
                        <img
                          src={URL.createObjectURL(file.blob)}
                          alt="Converted"
                          className="w-full h-20 object-cover rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {files.length === 0 && (
              <div className="text-center py-12">
                <ArrowsRightLeftIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Ready to Convert Images
                </h3>
                <p className="text-gray-400">
                  Upload your images to get started with format conversion
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Format Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">PNG</h4>
                <p className="text-sm">
                  Lossless compression with transparency support. Best for graphics, logos, and images with text.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">JPEG</h4>
                <p className="text-sm">
                  Lossy compression ideal for photographs. Smaller file sizes but no transparency support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">WebP</h4>
                <p className="text-sm">
                  Modern format with excellent compression. Supports both lossy and lossless compression with transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
