'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay } from '@/components/common';
import { mergePdfs } from '@/lib/documentUtils';

export default function PdfMergeSplitPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'merge' | 'split'>('merge');
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (mode === 'merge') {
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      setSelectedFiles([files[0]]);
    }
    setResult(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 400);

      const mergedBlob = await mergePdfs(selectedFiles);
      
      clearInterval(progressInterval);
      setProgress(100);

      const downloadUrl = URL.createObjectURL(mergedBlob);
      const fileName = 'merged-document.pdf';

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: `Successfully merged ${selectedFiles.length} PDF files!`
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to merge PDF files. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="PDF Merge & Split"
        description="Combine multiple PDFs into one or split a single PDF into multiple files"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {/* Mode Selection */}
            <div className="mb-6">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => {setMode('merge'); handleReset();}}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    mode === 'merge' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Merge PDFs
                </button>
                <button
                  onClick={() => {setMode('split'); handleReset();}}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    mode === 'split' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Split PDF
                </button>
              </div>
            </div>

            {selectedFiles.length === 0 && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                multiple={mode === 'merge'}
                maxSize={50}
                label={mode === 'merge' ? 'Choose PDF files or drag and drop' : 'Choose PDF file to split'}
                helpText={mode === 'merge' 
                  ? 'Select multiple PDF files to merge • Maximum 50MB per file'
                  : 'Select one PDF file to split • Maximum 50MB'
                }
              />
            )}

            {selectedFiles.length > 0 && !result && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">
                    {mode === 'merge' ? 'Files to Merge' : 'File to Split'}
                  </h3>
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-3">
                          {mode === 'merge' && selectedFiles.length > 1 && (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveFile(index, Math.max(0, index - 1))}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveFile(index, Math.min(selectedFiles.length - 1, index + 1))}
                                disabled={index === selectedFiles.length - 1}
                                className="text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-300">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {mode === 'merge' && (
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf';
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = Array.from((e.target as HTMLInputElement).files || []);
                          handleFileSelect(files);
                        };
                        input.click();
                      }}
                      className="mt-3 text-blue-400 hover:text-blue-300"
                    >
                      + Add More Files
                    </button>
                  )}
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label={mode === 'merge' ? 'Merging PDF files...' : 'Splitting PDF file...'}
                  />
                )}

                <div className="flex gap-3">
                  {mode === 'merge' ? (
                    <button
                      onClick={handleMerge}
                      disabled={isProcessing || selectedFiles.length < 2}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      {isProcessing ? 'Merging...' : `Merge ${selectedFiles.length} PDFs`}
                    </button>
                  ) : (
                    <button
                      onClick={() => {/* Split functionality */}}
                      disabled={isProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Configure Split
                    </button>
                  )}
                  
                  <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {result && (
              <ResultDisplay
                title={result.status === 'success' ? 'Operation Complete!' : 'Operation Failed'}
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
              <h3 className="text-lg font-semibold text-white mb-3">Merge Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Combine unlimited PDF files</li>
                <li>• Drag to reorder files</li>
                <li>• Preserve bookmarks</li>
                <li>• Maintain quality</li>
                <li>• Fast processing</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Split Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Split by page ranges</li>
                <li>• Extract specific pages</li>
                <li>• Multiple output files</li>
                <li>• Preview before splitting</li>
                <li>• Custom naming</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
