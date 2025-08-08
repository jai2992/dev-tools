'use client';

import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import ProgressBar from '../../components/common/ProgressBar';
import ResultDisplay from '../../components/common/ResultDisplay';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { mergePdfs } from '../../lib/documentUtils';

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
    <PageLayout 
      title="PDF Merge & Split" 
      description="Combine multiple PDFs into one or split a single PDF into multiple files"
    >
      <div className="max-w-4xl mx-auto">
        <Card variant="default" padding="lg">
          
          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex bg-[var(--color-surface-elevated)] rounded-lg p-1">
              <Button
                variant={mode === 'merge' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => {setMode('merge'); handleReset();}}
                className="flex-1"
              >
                Merge PDFs
              </Button>
              <Button
                variant={mode === 'split' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => {setMode('split'); handleReset();}}
                className="flex-1"
              >
                Split PDF
              </Button>
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
              variant="large"
            />
          )}

          {selectedFiles.length > 0 && !result && (
            <div className="space-y-6">
              <Card variant="elevated" padding="lg">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                  {mode === 'merge' ? 'Files to Merge' : 'File to Split'}
                </h3>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[var(--color-surface-elevated)] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        {mode === 'merge' && selectedFiles.length > 1 && (
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveFile(index, Math.max(0, index - 1))}
                              disabled={index === 0}
                              className="p-1 h-6 w-6"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveFile(index, Math.min(selectedFiles.length - 1, index + 1))}
                              disabled={index === selectedFiles.length - 1}
                              className="p-1 h-6 w-6"
                            >
                              ↓
                            </Button>
                          </div>
                        )}
                        <div>
                          <p className="text-[var(--color-text-primary)]">{file.name}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                
                {mode === 'merge' && (
                  <Button
                    variant="ghost"
                    size="sm"
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
                    className="mt-3"
                  >
                    + Add More Files
                  </Button>
                )}
              </Card>

              {isProcessing && (
                <ProgressBar 
                  progress={progress} 
                  label={mode === 'merge' ? 'Merging PDF files...' : 'Splitting PDF file...'}
                  animated={true}
                  variant="default"
                />
              )}

              <div className="flex gap-3">
                {mode === 'merge' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleMerge}
                    disabled={isProcessing || selectedFiles.length < 2}
                    loading={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Merging...' : `Merge ${selectedFiles.length} PDFs`}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {/* Split functionality */}}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Configure Split
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                >
                  Reset
                </Button>
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
        </Card>

        {/* Information Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Merge Features</h3>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              <li>• Combine unlimited PDF files</li>
              <li>• Drag to reorder files</li>
              <li>• Preserve bookmarks</li>
              <li>• Maintain quality</li>
              <li>• Fast processing</li>
            </ul>
          </Card>
          
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Split Features</h3>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              <li>• Split by page ranges</li>
              <li>• Extract specific pages</li>
              <li>• Multiple output files</li>
              <li>• Preview before splitting</li>
              <li>• Custom naming</li>
            </ul>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
