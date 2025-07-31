'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';
import { convertPdfToExcel } from '@/lib/documentUtils';

export default function PdfToExcelPage() {
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

      const convertedBlob = await convertPdfToExcel(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(convertedBlob);
      const fileName = selectedFile.name.replace('.pdf', '.xlsx');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: 'PDF tables successfully extracted to Excel!'
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to extract tables from PDF. Please ensure your PDF contains tables.'
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
        title="PDF to Excel Converter"
        description="Extract tables and data from PDF documents to Excel spreadsheets"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxSize={50}
                label="Choose PDF file or drag and drop"
                helpText="Maximum file size: 50MB • Best results with PDFs containing tables"
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
                    label="Extracting tables from PDF..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Extracting...' : 'Extract to Excel'}
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
                title={result.status === 'success' ? 'Extraction Complete!' : 'Extraction Failed'}
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
                <li>• Automatic table detection</li>
                <li>• Multiple sheets for multiple tables</li>
                <li>• Data formatting preservation</li>
                <li>• Cell merging support</li>
                <li>• Number format recognition</li>
                <li>• Header row identification</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Best Results</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• PDFs with clearly defined tables</li>
                <li>• Text-based PDFs (not scanned images)</li>
                <li>• Tables with visible borders</li>
                <li>• Consistent column alignment</li>
                <li>• Clean table structure</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
