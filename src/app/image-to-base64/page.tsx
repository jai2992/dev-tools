'use client';

import { useState, useCallback } from 'react';
import { DocumentTextIcon, CloudArrowUpIcon, ClipboardIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface ConvertedImage {
  file: File;
  base64: string;
  dataUri: string;
  size: number;
  dimensions: { width: number; height: number };
}

export default function ImageToBase64() {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'base64' | 'datauri' | 'css' | 'html'>('base64');

  const handleFileUpload = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      alert('Some files were skipped. Only image files are supported.');
    }
    
    if (imageFiles.length === 0) return;
    
    setProcessing(true);
    
    const processFiles = async () => {
      const results: ConvertedImage[] = [];
      
      for (const file of imageFiles) {
        try {
          const base64 = await fileToBase64(file);
          const dataUri = `data:${file.type};base64,${base64}`;
          const dimensions = await getImageDimensions(file);
          
          results.push({
            file,
            base64,
            dataUri,
            size: file.size,
            dimensions
          });
        } catch (error) {
          console.error(`Failed to convert ${file.name}:`, error);
        }
      }
      
      setConvertedImages(prev => [...prev, ...results]);
      setProcessing(false);
    };
    
    processFiles();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const generateOutput = (image: ConvertedImage) => {
    switch (selectedFormat) {
      case 'base64':
        return image.base64;
      
      case 'datauri':
        return image.dataUri;
      
      case 'css':
        return `background-image: url("${image.dataUri}");`;
      
      case 'html':
        return `<img src="${image.dataUri}" alt="${image.file.name}" width="${image.dimensions.width}" height="${image.dimensions.height}" />`;
      
      default:
        return image.base64;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadAsText = (image: ConvertedImage) => {
    const output = generateOutput(image);
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const extension = selectedFormat === 'css' ? 'css' : 
                     selectedFormat === 'html' ? 'html' : 'txt';
    a.download = `${image.file.name.split('.')[0]}_base64.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeImage = (index: number) => {
    setConvertedImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateBase64Size = (base64: string) => {
    // Base64 encoding increases size by ~33%
    return Math.ceil(base64.length * 0.75);
  };

  const formatOptions = [
    { value: 'base64', label: 'Base64 Only', description: 'Raw Base64 encoded string' },
    { value: 'datauri', label: 'Data URI', description: 'Complete data URI with MIME type' },
    { value: 'css', label: 'CSS Background', description: 'CSS background-image property' },
    { value: 'html', label: 'HTML Image Tag', description: 'Complete HTML img element' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <DocumentTextIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Image to Base64 Converter
              </h1>
              <p className="text-lg md:text-xl text-cyan-100 mt-2">
                Convert images to Base64 encoded strings for web development
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full text-sm">Multiple Formats</span>
            <span className="bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full text-sm">CSS Ready</span>
            <span className="bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full text-sm">HTML Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* File Upload Area */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-cyan-500 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                handleFileUpload(files);
              }}
            >
              <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2 text-center">
                Choose images or drag and drop
              </h3>
              <p className="text-gray-400 mb-4 text-center">
                Supports all image formats (PNG, JPEG, WebP, SVG, etc.)
              </p>
              <div className="text-center">
                <label htmlFor="file-input" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
                  Select Images
                </label>
              </div>
              
              {/* File Size Warning */}
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  ⚠️ Base64 encoding increases file size by ~33%. Large images may cause performance issues.
                </p>
              </div>
            </div>
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFileUpload(files);
              }}
              className="hidden"
            />
          </div>

          {/* Processing Indicator */}
          {processing && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mr-4"></div>
                <span className="text-gray-300">Converting images to Base64...</span>
              </div>
            </div>
          )}

          {/* Output Format Selection */}
          {convertedImages.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CodeBracketIcon className="w-5 h-5 text-cyan-400" />
                Output Format
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {formatOptions.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedFormat === option.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="format"
                          value={option.value}
                          checked={selectedFormat === option.value}
                          onChange={(e) => setSelectedFormat(e.target.value as 'base64' | 'datauri' | 'css' | 'html')}
                          className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 font-medium text-white">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Converted Images */}
          {convertedImages.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Converted Images ({convertedImages.length})</h3>
              
              {convertedImages.map((image, index) => {
                const output = generateOutput(image);
                const base64Size = calculateBase64Size(image.base64);
                const sizeIncrease = ((base64Size / image.size - 1) * 100).toFixed(1);
                
                return (
                  <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Image Info */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-white truncate">{image.file.name}</h4>
                          <button
                            onClick={() => removeImage(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        {/* Image Preview */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-4">
                          <img
                            src={image.dataUri}
                            alt={image.file.name}
                            className="w-full h-32 object-contain rounded"
                          />
                        </div>
                        
                        {/* Image Stats */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Dimensions:</span>
                            <span className="text-white">{image.dimensions.width} × {image.dimensions.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Original Size:</span>
                            <span className="text-white">{formatFileSize(image.size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Base64 Size:</span>
                            <span className="text-white">{formatFileSize(base64Size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Size Increase:</span>
                            <span className={`${parseFloat(sizeIncrease) > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                              +{sizeIncrease}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Output Code */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-300">
                            {formatOptions.find(f => f.value === selectedFormat)?.label} Output
                          </h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(output)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                              Copy
                            </button>
                            <button
                              onClick={() => downloadAsText(image)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-48 font-mono">
                            <code>{output}</code>
                          </pre>
                          
                          {/* Length indicator for very long strings */}
                          {output.length > 500 && (
                            <div className="absolute bottom-2 right-2 bg-gray-700 text-xs text-gray-400 px-2 py-1 rounded">
                              {output.length.toLocaleString()} characters
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {convertedImages.length === 0 && !processing && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center py-12">
              <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Ready to Convert Images
              </h3>
              <p className="text-gray-400">
                Upload your images to convert them to Base64 encoded strings
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Base64 Encoding Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">When to Use Base64</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Embedding small images in CSS or HTML</li>
                  <li>Reducing HTTP requests for tiny icons</li>
                  <li>Email templates with embedded images</li>
                  <li>Data URIs for immediate image display</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">Performance Considerations</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Base64 images cannot be cached separately</li>
                  <li>File size increases by approximately 33%</li>
                  <li>Best for images smaller than 10KB</li>
                  <li>Can increase CSS/HTML file size significantly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
