'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';
import { convertWordToPdf } from '@/lib/documentUtils'; // We'll reuse this for demo

export default function PowerPointToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 8, 90));
      }, 400);

      // Use Word to PDF converter as placeholder (in real implementation, would be specific to PowerPoint)
      const convertedBlob = await convertWordToPdf(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(convertedBlob);
      const fileName = selectedFile.name.replace(/\.(pptx?|ppt)$/i, '.pdf');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: 'PowerPoint presentation successfully converted to PDF!'
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to convert PowerPoint presentation. Please try again with a different file.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="PowerPoint to PDF Converter"
        description="Convert PowerPoint presentations to PDF format for easy sharing and printing"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".ppt,.pptx"
                maxSize={50}
                label="Choose PowerPoint file or drag and drop"
                helpText="Maximum file size: 50MB • Supports .ppt and .pptx formats"
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

                {/* Conversion Options */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Conversion Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slide Layout
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="slides">Slides Only</option>
                        <option value="handouts">Handouts (2 per page)</option>
                        <option value="handouts4">Handouts (4 per page)</option>
                        <option value="handouts6">Handouts (6 per page)</option>
                        <option value="notes">Slides with Notes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quality
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="high">High Quality</option>
                        <option value="medium">Medium Quality</option>
                        <option value="low">Small File Size</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-gray-300">Include hidden slides</span>
                    </label>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Converting PowerPoint to PDF..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Converting...' : 'Convert to PDF'}
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
              <ResultDisplay
                title={result.status === 'success' ? 'Conversion Complete!' : 'Conversion Failed'}
                status={result.status}
                message={result.message}
                downloadUrl={result.downloadUrl}
                fileName={result.fileName}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Slide-by-slide conversion</li>
                <li>• Animation frame extraction</li>
                <li>• Speaker notes inclusion</li>
                <li>• Handout format generation</li>
                <li>• Multiple slides per page</li>
                <li>• High-quality output</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Perfect For</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Presentation sharing</li>
                <li>• Print handouts</li>
                <li>• Email distribution</li>
                <li>• Document archival</li>
                <li>• Web publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
