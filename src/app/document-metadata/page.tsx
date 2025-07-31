'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay, Input, Textarea } from '@/components/common';

interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
}

export default function DocumentMetadataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
  } | null>(null);
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
      setMetadataLoaded(false);
      
      // Simulate metadata extraction
      setTimeout(() => {
        setMetadata({
          title: 'Sample Document Title',
          author: 'Original Author',
          subject: 'Document Subject',
          keywords: 'keyword1, keyword2, keyword3',
          creator: 'Microsoft Word',
          producer: 'Adobe PDF',
          creationDate: '2024-01-01',
          modificationDate: new Date().toISOString().split('T')[0]
        });
        setMetadataLoaded(true);
      }, 1000);
    }
  };

  const handleMetadataChange = (field: keyof DocumentMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      // Simulate metadata update process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Create updated file (placeholder)
      const updatedBlob = new Blob([await selectedFile.arrayBuffer()], { 
        type: selectedFile.type 
      });
      
      const downloadUrl = URL.createObjectURL(updatedBlob);
      const fileName = selectedFile.name.replace(/(\.[^.]+)$/, '_updated$1');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: 'Document metadata successfully updated!'
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to update metadata. Please try again with a different file.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setMetadata({});
    setMetadataLoaded(false);
  };

  const clearMetadata = () => {
    setMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: ''
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="Document Metadata Editor"
        description="View and edit document metadata including title, author, keywords, and other properties"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                maxSize={100}
                label="Choose document or drag and drop"
                helpText="Maximum file size: 100MB • Supports PDF, Word, Excel, PowerPoint files"
              />
            )}

            {selectedFile && !metadataLoaded && !result && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Extracting document metadata...</p>
              </div>
            )}

            {selectedFile && metadataLoaded && !result && (
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

                {/* Metadata Editor */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white">Document Metadata</h3>
                    <button
                      onClick={clearMetadata}
                      className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <Input
                        value={metadata.title || ''}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                        placeholder="Document title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Author
                      </label>
                      <Input
                        value={metadata.author || ''}
                        onChange={(e) => handleMetadataChange('author', e.target.value)}
                        placeholder="Author name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <Input
                        value={metadata.subject || ''}
                        onChange={(e) => handleMetadataChange('subject', e.target.value)}
                        placeholder="Document subject"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Creator Application
                      </label>
                      <Input
                        value={metadata.creator || ''}
                        onChange={(e) => handleMetadataChange('creator', e.target.value)}
                        placeholder="Application that created the document"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Keywords
                    </label>
                    <Textarea
                      value={metadata.keywords || ''}
                      onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                      placeholder="Comma-separated keywords"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Creation Date
                      </label>
                      <Input
                        type="date"
                        value={metadata.creationDate || ''}
                        onChange={(e) => handleMetadataChange('creationDate', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Modification Date
                      </label>
                      <Input
                        type="date"
                        value={metadata.modificationDate || ''}
                        onChange={(e) => handleMetadataChange('modificationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Options */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Privacy & Security</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-300">Remove all personal information</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-300">Clear document history</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-300">Remove hidden data and comments</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-300">Strip location information</span>
                    </label>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Updating document metadata..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Updating...' : 'Update Metadata'}
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
                title={result.status === 'success' ? 'Metadata Updated!' : 'Update Failed'}
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
              <h3 className="text-lg font-semibold text-white mb-3">Metadata Fields</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Title:</strong> Document name/title</li>
                <li>• <strong>Author:</strong> Document creator</li>
                <li>• <strong>Subject:</strong> Document topic</li>
                <li>• <strong>Keywords:</strong> Search terms</li>
                <li>• <strong>Creator:</strong> Application used</li>
                <li>• <strong>Dates:</strong> Creation/modification</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Privacy Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Remove personal information</li>
                <li>• Clear document history</li>
                <li>• Strip hidden metadata</li>
                <li>• Control information sharing</li>
                <li>• Comply with privacy policies</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
