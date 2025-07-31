'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';
import { convertExcelToPdf } from '@/lib/documentUtils';

export default function ExcelToPdfPage() {
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
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const convertedBlob = await convertExcelToPdf(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(convertedBlob);
      const fileName = selectedFile.name.replace(/\.(xlsx?|xls)$/i, '.pdf');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: 'Excel spreadsheet successfully converted to PDF!'
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to convert Excel file. Please try again with a different file.'
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
        title="Excel to PDF Converter"
        description="Convert Excel spreadsheets to PDF format for professional reports and sharing"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".xls,.xlsx"
                maxSize={50}
                label="Choose Excel file or drag and drop"
                helpText="Maximum file size: 50MB • Supports .xls and .xlsx formats"
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

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Converting Excel to PDF..."
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
                <li>• Multiple worksheet handling</li>
                <li>• Page breaks and formatting</li>
                <li>• Chart and graph conversion</li>
                <li>• Print settings optimization</li>
                <li>• Landscape/portrait options</li>
                <li>• Custom page ranges</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Perfect For</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Business reports</li>
                <li>• Financial statements</li>
                <li>• Data presentations</li>
                <li>• Professional sharing</li>
                <li>• Print-ready documents</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
