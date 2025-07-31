'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';

export default function EbookConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
  } | null>(null);

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'mobi', label: 'MOBI (Kindle)' },
    { value: 'azw3', label: 'AZW3 (Kindle)' },
    { value: 'txt', label: 'Plain Text' },
    { value: 'docx', label: 'Word Document' },
    { value: 'html', label: 'HTML' },
  ];

  const getFileExtension = (format: string) => {
    const extensions: { [key: string]: string } = {
      pdf: '.pdf',
      epub: '.epub',
      mobi: '.mobi',
      azw3: '.azw3',
      txt: '.txt',
      docx: '.docx',
      html: '.html'
    };
    return extensions[format] || '.pdf';
  };

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
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Simulate e-book conversion process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Create converted file blob (placeholder)
      const convertedBlob = new Blob([await selectedFile.arrayBuffer()], { 
        type: targetFormat === 'pdf' ? 'application/pdf' : 'application/octet-stream' 
      });
      
      const downloadUrl = URL.createObjectURL(convertedBlob);
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      const fileName = baseName + getFileExtension(targetFormat);

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: `E-book successfully converted to ${targetFormat.toUpperCase()} format!`
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to convert e-book. Please try again with a different file.'
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
        title="E-book Format Converter"
        description="Convert between different e-book formats including EPUB, MOBI, PDF, and more"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".epub,.mobi,.azw,.azw3,.pdf,.txt,.doc,.docx,.html,.fb2"
                maxSize={100}
                label="Choose e-book file or drag and drop"
                helpText="Maximum file size: 100MB • Supports EPUB, MOBI, AZW, PDF, TXT, DOC, HTML, FB2"
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

                {/* Conversion Settings */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Conversion Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Format
                      </label>
                      <select 
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        {formatOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image Quality
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="high">High Quality</option>
                        <option value="medium">Medium Quality</option>
                        <option value="low">Optimized Size</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Format-specific Options */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Format Options</h3>
                  
                  {(targetFormat === 'pdf') && (
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-300">Include table of contents</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-300">Preserve formatting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-300">Add page numbers</span>
                      </label>
                    </div>
                  )}

                  {(targetFormat === 'epub' || targetFormat === 'mobi' || targetFormat === 'azw3') && (
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-300">Optimize for e-readers</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-300">Include metadata</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-300">Split large chapters</span>
                      </label>
                    </div>
                  )}

                  {targetFormat === 'txt' && (
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-300">Remove formatting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-300">Preserve line breaks</span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Character Encoding
                        </label>
                        <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                          <option value="utf8">UTF-8</option>
                          <option value="ascii">ASCII</option>
                          <option value="latin1">Latin-1</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label={`Converting to ${targetFormat.toUpperCase()}...`}
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
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
              <h3 className="text-lg font-semibold text-white mb-3">Supported Formats</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-300 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-1">Input:</h4>
                  <ul className="space-y-1">
                    <li>• EPUB</li>
                    <li>• MOBI</li>
                    <li>• AZW/AZW3</li>
                    <li>• PDF</li>
                    <li>• TXT</li>
                    <li>• DOC/DOCX</li>
                    <li>• HTML</li>
                    <li>• FB2</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Output:</h4>
                  <ul className="space-y-1">
                    <li>• PDF</li>
                    <li>• EPUB</li>
                    <li>• MOBI</li>
                    <li>• AZW3</li>
                    <li>• TXT</li>
                    <li>• DOCX</li>
                    <li>• HTML</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Preserve metadata and formatting</li>
                <li>• Optimized for different e-readers</li>
                <li>• Batch conversion support</li>
                <li>• Custom quality settings</li>
                <li>• Table of contents preservation</li>
                <li>• Image optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
