'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay, Input } from '@/components/common';
import { extractPdfPages } from '@/lib/documentUtils';

export default function PdfExtractPagesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageNumbers, setPageNumbers] = useState('');
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

  const parsePageNumbers = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
        if (start && end && start <= end) {
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (pageNum) {
          pages.push(pageNum);
        }
      }
    }
    
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!selectedFile || !pageNumbers.trim()) return;

    const pages = parsePageNumbers(pageNumbers);
    if (pages.length === 0) {
      setResult({
        status: 'error',
        message: 'Please enter valid page numbers (e.g., 1,3,5-8)'
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 300);

      const extractedBlob = await extractPdfPages(selectedFile, pages);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(extractedBlob);
      const fileName = selectedFile.name.replace('.pdf', '-extracted.pdf');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: `Successfully extracted ${pages.length} pages: ${pages.join(', ')}`
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to extract pages. Please check your page numbers and try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setPageNumbers('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="PDF Page Extractor"
        description="Extract specific pages from PDF documents to create new PDF files"
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
                helpText="Maximum file size: 50MB • Any PDF with multiple pages"
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

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Select Pages to Extract</h3>
                  
                  <Input
                    label="Page Numbers"
                    value={pageNumbers}
                    onChange={(e) => setPageNumbers(e.target.value)}
                    placeholder="e.g., 1,3,5-8,12"
                    helperText="Enter individual pages (1,3,5) or ranges (5-8). Separate with commas."
                  />

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-700 rounded p-3">
                      <h4 className="font-medium text-white mb-2">Examples:</h4>
                      <ul className="text-gray-300 space-y-1">
                        <li>• <code>1,3,5</code> - Pages 1, 3, and 5</li>
                        <li>• <code>1-5</code> - Pages 1 through 5</li>
                        <li>• <code>1,3-7,10</code> - Mixed selection</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded p-3">
                      <h4 className="font-medium text-white mb-2">Quick Select:</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => setPageNumbers('1')}
                          className="block text-blue-400 hover:text-blue-300"
                        >
                          First page only
                        </button>
                        <button
                          onClick={() => setPageNumbers('1-5')}
                          className="block text-blue-400 hover:text-blue-300"
                        >
                          First 5 pages
                        </button>
                        <button
                          onClick={() => setPageNumbers('1-10')}
                          className="block text-blue-400 hover:text-blue-300"
                        >
                          First 10 pages
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded p-3">
                      <h4 className="font-medium text-white mb-2">Preview:</h4>
                      <p className="text-gray-300">
                        {pageNumbers.trim() ? (
                          <>
                            Will extract: {parsePageNumbers(pageNumbers).length > 0 ? 
                              parsePageNumbers(pageNumbers).join(', ') : 
                              'Invalid format'}
                          </>
                        ) : (
                          'Enter page numbers above'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Extracting pages..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleExtract}
                    disabled={isProcessing || !pageNumbers.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Extracting...' : 'Extract Pages'}
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
              <h3 className="text-lg font-semibold text-white mb-3">Use Cases</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Extract specific chapters</li>
                <li>• Create summary documents</li>
                <li>• Share relevant pages only</li>
                <li>• Remove unwanted content</li>
                <li>• Create custom compilations</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Page range selection</li>
                <li>• Individual page extraction</li>
                <li>• Maintains original quality</li>
                <li>• Preserves formatting</li>
                <li>• Fast processing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
