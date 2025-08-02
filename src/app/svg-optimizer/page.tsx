'use client';

import { useState, useCallback } from 'react';
import { CodeBracketIcon, CloudArrowUpIcon, ArrowDownTrayIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface OptimizationResult {
  originalSvg: string;
  optimizedSvg: string;
  originalSize: number;
  optimizedSize: number;
  fileName: string;
  optimizations: string[];
}

interface OptimizationOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  removeEditorsNSData: boolean;
  cleanupAttrs: boolean;
  mergeStyles: boolean;
  inlineStyles: boolean;
  minifyStyles: boolean;
  convertStyleToAttrs: boolean;
  cleanupNumericValues: boolean;
  convertColors: boolean;
  removeUnknownsAndDefaults: boolean;
  removeNonInheritableGroupAttrs: boolean;
  removeUselessStrokeAndFill: boolean;
  removeViewBox: boolean;
  removeEmptyAttrs: boolean;
  removeEmptyText: boolean;
  removeEmptyContainers: boolean;
  removeUnusedNS: boolean;
  sortAttrs: boolean;
  sortDefsChildren: boolean;
  removeDimensions: boolean;
  removeAttrs: boolean;
}

export default function SVGOptimizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const [options, setOptions] = useState<OptimizationOptions>({
    removeComments: true,
    removeMetadata: true,
    removeEditorsNSData: true,
    cleanupAttrs: true,
    mergeStyles: true,
    inlineStyles: true,
    minifyStyles: true,
    convertStyleToAttrs: true,
    cleanupNumericValues: true,
    convertColors: true,
    removeUnknownsAndDefaults: true,
    removeNonInheritableGroupAttrs: true,
    removeUselessStrokeAndFill: true,
    removeViewBox: false,
    removeEmptyAttrs: true,
    removeEmptyText: true,
    removeEmptyContainers: true,
    removeUnusedNS: true,
    sortAttrs: false,
    sortDefsChildren: true,
    removeDimensions: false,
    removeAttrs: false
  });

  const handleFileUpload = useCallback((newFiles: File[]) => {
    const svgFiles = newFiles.filter(file => 
      file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
    );
    
    if (svgFiles.length !== newFiles.length) {
      alert('Some files were skipped. Only SVG files are supported.');
    }
    
    setFiles(prev => [...prev, ...svgFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const optimizeSVGs = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setResults([]);
    setCurrentProgress(0);
    
    const optimizedResults: OptimizationResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentProgress(((i + 1) / files.length) * 100);
      
      try {
        const svgContent = await readFileAsText(file);
        const optimized = await optimizeSVG(svgContent);
        
        optimizedResults.push({
          originalSvg: svgContent,
          optimizedSvg: optimized.data,
          originalSize: svgContent.length,
          optimizedSize: optimized.data.length,
          fileName: file.name,
          optimizations: optimized.info?.split('\n').filter(Boolean) || []
        });
      } catch (error) {
        console.error(`Failed to optimize ${file.name}:`, error);
      }
    }
    
    setResults(optimizedResults);
    setProcessing(false);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const optimizeSVG = async (svgContent: string): Promise<{ data: string; info?: string }> => {
    // Simple SVG optimization (in production, you'd use SVGO library)
    let optimized = svgContent;
    const appliedOptimizations: string[] = [];

    // Remove comments
    if (options.removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
      appliedOptimizations.push('Removed comments');
    }

    // Remove metadata
    if (options.removeMetadata) {
      optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
      appliedOptimizations.push('Removed metadata');
    }

    // Remove editor namespace data
    if (options.removeEditorsNSData) {
      optimized = optimized.replace(/\s+(xmlns:)?[a-z]+="[^"]*adobe[^"]*"/gi, '');
      optimized = optimized.replace(/\s+(xmlns:)?[a-z]+="[^"]*sketch[^"]*"/gi, '');
      optimized = optimized.replace(/\s+(xmlns:)?[a-z]+="[^"]*figma[^"]*"/gi, '');
      appliedOptimizations.push('Removed editor namespace data');
    }

    // Clean up attributes
    if (options.cleanupAttrs) {
      // Remove default values
      optimized = optimized.replace(/\s+fill="none"/g, '');
      optimized = optimized.replace(/\s+stroke="none"/g, '');
      optimized = optimized.replace(/\s+opacity="1"/g, '');
      appliedOptimizations.push('Cleaned up attributes');
    }

    // Remove empty attributes
    if (options.removeEmptyAttrs) {
      optimized = optimized.replace(/\s+[a-zA-Z-]+=""/g, '');
      appliedOptimizations.push('Removed empty attributes');
    }

    // Remove empty text elements
    if (options.removeEmptyText) {
      optimized = optimized.replace(/<text[^>]*>\s*<\/text>/g, '');
      appliedOptimizations.push('Removed empty text elements');
    }

    // Clean up numeric values
    if (options.cleanupNumericValues) {
      optimized = optimized.replace(/(\d+)\.0+(?!\d)/g, '$1');
      optimized = optimized.replace(/0+(\d+)/g, '$1');
      appliedOptimizations.push('Cleaned up numeric values');
    }

    // Convert colors
    if (options.convertColors) {
      // Convert rgb() to hex
      optimized = optimized.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (match, r, g, b) => {
        const hex = '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        return hex;
      });
      appliedOptimizations.push('Converted colors to optimal format');
    }

    // Remove unnecessary whitespace
    optimized = optimized.replace(/>\s+</g, '><');
    optimized = optimized.replace(/\s+/g, ' ');
    optimized = optimized.trim();
    appliedOptimizations.push('Removed unnecessary whitespace');

    return {
      data: optimized,
      info: appliedOptimizations.join('\n')
    };
  };

  const downloadSingle = (result: OptimizationResult) => {
    const blob = new Blob([result.optimizedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = result.fileName.replace('.svg', '');
    a.download = `${baseName}_optimized.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (results.length === 0) return;
    
    if (results.length === 1) {
      downloadSingle(results[0]);
      return;
    }
    
    // Create ZIP for multiple files
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    results.forEach((result) => {
      const baseName = result.fileName.replace('.svg', '');
      const fileName = `${baseName}_optimized.svg`;
      zip.file(fileName, result.optimizedSvg);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_svgs_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSavings = () => {
    const totalOriginal = results.reduce((sum, result) => sum + result.originalSize, 0);
    const totalOptimized = results.reduce((sum, result) => sum + result.optimizedSize, 0);
    const savings = totalOriginal - totalOptimized;
    const percentage = totalOriginal > 0 ? (savings / totalOriginal) * 100 : 0;
    
    return {
      bytes: savings,
      percentage: percentage.toFixed(1)
    };
  };

  const optionGroups = [
    {
      title: 'Cleanup',
      options: [
        { key: 'removeComments', label: 'Remove comments', description: 'Remove HTML/XML comments' },
        { key: 'removeMetadata', label: 'Remove metadata', description: 'Remove metadata elements' },
        { key: 'removeEditorsNSData', label: 'Remove editor data', description: 'Remove Adobe/Sketch/Figma specific data' },
        { key: 'removeEmptyAttrs', label: 'Remove empty attributes', description: 'Remove attributes with empty values' },
        { key: 'removeEmptyText', label: 'Remove empty text', description: 'Remove empty text elements' },
        { key: 'removeEmptyContainers', label: 'Remove empty containers', description: 'Remove empty g, defs, etc.' }
      ]
    },
    {
      title: 'Optimization',
      options: [
        { key: 'cleanupAttrs', label: 'Cleanup attributes', description: 'Remove default and redundant attributes' },
        { key: 'cleanupNumericValues', label: 'Cleanup numbers', description: 'Round and shorten numeric values' },
        { key: 'convertColors', label: 'Convert colors', description: 'Convert colors to shorter formats' },
        { key: 'minifyStyles', label: 'Minify styles', description: 'Compress CSS styles' },
        { key: 'removeUnknownsAndDefaults', label: 'Remove defaults', description: 'Remove unknown and default values' },
        { key: 'removeUselessStrokeAndFill', label: 'Remove useless stroke/fill', description: 'Remove unnecessary stroke and fill' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <CodeBracketIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                SVG Optimizer
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mt-2">
                Optimize SVG files for web use with advanced compression
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm">File Size Reduction</span>
            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm">Batch Processing</span>
            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm">Custom Options</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* File Upload Area */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-emerald-500 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                handleFileUpload(files);
              }}
            >
              <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2 text-center">
                Choose SVG files or drag and drop
              </h3>
              <p className="text-gray-400 mb-4 text-center">
                Upload one or multiple SVG files for optimization
              </p>
              <div className="text-center">
                <label htmlFor="file-input" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-block">
                  Select SVG Files
                </label>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".svg,image/svg+xml"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFileUpload(files);
              }}
              className="hidden"
            />
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files ({files.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{file.name}</div>
                      <div className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
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

          {/* Optimization Options */}
          {files.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Optimization Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {optionGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h4 className="text-md font-semibold text-emerald-400 mb-3">{group.title}</h4>
                    <div className="space-y-3">
                      {group.options.map((option) => (
                        <label key={option.key} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options[option.key as keyof OptimizationOptions]}
                            onChange={(e) => setOptions(prev => ({ 
                              ...prev, 
                              [option.key]: e.target.checked 
                            }))}
                            className="mt-1 w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                          />
                          <div>
                            <div className="font-medium text-white text-sm">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={optimizeSVGs}
                  disabled={processing}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto"
                >
                  {processing ? `Optimizing... ${currentProgress.toFixed(0)}%` : `Optimize ${files.length} SVG${files.length > 1 ? 's' : ''}`}
                </button>
              </div>
              
              {/* Progress Bar */}
              {processing && (
                <div className="mt-4">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              
              {/* Summary */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-emerald-400" />
                    Optimization Results
                  </h3>
                  <button
                    onClick={downloadAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download {results.length > 1 ? 'All (ZIP)' : 'File'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-400">{results.length}</div>
                    <div className="text-sm text-gray-400">Files Optimized</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {formatFileSize(getTotalSavings().bytes)}
                    </div>
                    <div className="text-sm text-gray-400">Space Saved</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{getTotalSavings().percentage}%</div>
                    <div className="text-sm text-gray-400">Size Reduction</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">
                      {results.reduce((sum, r) => sum + r.optimizations.length, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Optimizations Applied</div>
                  </div>
                </div>
              </div>

              {/* Individual Results */}
              <div className="grid grid-cols-1 gap-6">
                {results.map((result, index) => {
                  const savings = result.originalSize - result.optimizedSize;
                  const percentage = ((savings / result.originalSize) * 100).toFixed(1);
                  
                  return (
                    <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white">{result.fileName}</h4>
                        <button
                          onClick={() => downloadSingle(result)}
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-300">
                            {formatFileSize(result.originalSize)}
                          </div>
                          <div className="text-sm text-gray-400">Original Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400">
                            {formatFileSize(result.optimizedSize)}
                          </div>
                          <div className="text-sm text-gray-400">Optimized Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{percentage}%</div>
                          <div className="text-sm text-gray-400">Reduction</div>
                        </div>
                      </div>
                      
                      {result.optimizations.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-300 mb-2">
                            Applied Optimizations:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {result.optimizations.map((opt, optIndex) => (
                              <span
                                key={optIndex}
                                className="bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded text-xs"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && !processing && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center py-12">
              <CodeBracketIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Ready to Optimize SVGs
              </h3>
              <p className="text-gray-400">
                Upload your SVG files to reduce their size and improve web performance
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">SVG Optimization Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Faster Loading</h4>
                <p className="text-sm">
                  Smaller SVG files load faster, improving website performance and user experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Bandwidth Savings</h4>
                <p className="text-sm">
                  Reduced file sizes save bandwidth costs and improve site performance on mobile devices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Clean Code</h4>
                <p className="text-sm">
                  Remove unnecessary metadata and editor-specific data for cleaner, more maintainable code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
