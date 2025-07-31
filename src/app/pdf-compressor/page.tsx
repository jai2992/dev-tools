'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';
import { compressPdf } from '@/lib/documentUtils';

export default function PdfCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
    originalSize?: number;
    compressedSize?: number;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const compressedBlob = await compressPdf(selectedFile, quality);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(compressedBlob);
      const fileName = selectedFile.name.replace('.pdf', '-compressed.pdf');
      const compressionRatio = ((selectedFile.size - compressedBlob.size) / selectedFile.size * 100).toFixed(1);

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        originalSize: selectedFile.size,
        compressedSize: compressedBlob.size,
        message: `PDF compressed by ${compressionRatio}% - Size reduced from ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB to ${(compressedBlob.size / (1024 * 1024)).toFixed(2)}MB`
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to compress PDF. Please try again with a different file.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setQuality(0.7);
  };

  const getQualityLabel = (value: number) => {
    if (value >= 0.9) return 'High Quality (Minimal Compression)';
    if (value >= 0.7) return 'Balanced (Recommended)';
    if (value >= 0.5) return 'Good Compression';
    return 'Maximum Compression';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="PDF Compressor"
        description="Reduce PDF file size while maintaining quality for easier sharing and storage"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxSize={100}
                label="Choose PDF file or drag and drop"
                helpText="Maximum file size: 100MB • Larger files get better compression results"
              />
            )}

            {selectedFile && !result && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Selected File</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300">{selectedFile.name}</p>
                      <p className="text-sm text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Quality Slider */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Compression Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quality Level: {getQualityLabel(quality)}
                      </label>
                      <input
                        type="range"
                        min="0.3"
                        max="0.95"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Max Compression</span>
                        <span>High Quality</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-400">File Size</p>
                        <p className="text-white font-medium">
                          {quality >= 0.9 ? '~90% of original' : 
                           quality >= 0.7 ? '~60% of original' :
                           quality >= 0.5 ? '~40% of original' : '~25% of original'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Image Quality</p>
                        <p className="text-white font-medium">
                          {quality >= 0.9 ? 'Excellent' : 
                           quality >= 0.7 ? 'Very Good' :
                           quality >= 0.5 ? 'Good' : 'Fair'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Text Quality</p>
                        <p className="text-white font-medium">Always Perfect</p>
                      </div>
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Compressing PDF..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Compressing...' : 'Compress PDF'}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Choose Different File
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <ResultDisplay
                  title={result.status === 'success' ? 'Compression Complete!' : 'Compression Failed'}
                  status={result.status}
                  message={result.message}
                  downloadUrl={result.downloadUrl}
                  fileName={result.fileName}
                  onReset={handleReset}
                />
                
                {result.status === 'success' && result.originalSize && result.compressedSize && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-semibold text-white mb-3">Compression Results</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-400 text-sm">Original Size</p>
                        <p className="text-white font-medium">
                          {(result.originalSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Compressed Size</p>
                        <p className="text-white font-medium">
                          {(result.compressedSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Space Saved</p>
                        <p className="text-green-400 font-medium">
                          {((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Image compression and optimization</li>
                <li>• Font optimization and subsetting</li>
                <li>• Remove unnecessary metadata</li>
                <li>• Optimize content streams</li>
                <li>• Text quality always preserved</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Best For</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Email attachments (size limits)</li>
                <li>• Web upload requirements</li>
                <li>• Storage space optimization</li>
                <li>• Faster file transfers</li>
                <li>• Cloud storage savings</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
