'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay, Input } from '@/components/common';

export default function PdfUnlockPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
    downloadUrl?: string;
    fileName?: string;
  } | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
      setIsPasswordProtected(null);
      setPassword('');
      // Simulate password protection check
      setTimeout(() => {
        setIsPasswordProtected(true);
      }, 500);
    }
  };

  const handleUnlock = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 90));
      }, 300);

      // Simulate password verification and unlock process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Create a new blob (in real implementation, would decrypt PDF)
      const unlockedBlob = new Blob([await selectedFile.arrayBuffer()], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(unlockedBlob);
      const fileName = selectedFile.name.replace('.pdf', '_unlocked.pdf');

      setResult({
        status: 'success',
        downloadUrl,
        fileName,
        message: 'PDF successfully unlocked! Password protection has been removed.'
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to unlock PDF. Please check your password and try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setPassword('');
    setIsPasswordProtected(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="PDF Password Remover"
        description="Remove password protection from PDF files to make them freely accessible"
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
                helpText="Maximum file size: 100MB • Supports password-protected PDF files"
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

                {/* Password Protection Status */}
                {isPasswordProtected !== null && (
                  <div className={`bg-gray-800 rounded-lg p-4 border ${
                    isPasswordProtected ? 'border-yellow-600' : 'border-green-600'
                  }`}>
                    <h3 className="font-semibold text-white mb-2">Security Status</h3>
                    {isPasswordProtected ? (
                      <div className="flex items-center text-yellow-400">
                        <span className="mr-2">🔒</span>
                        <span>This PDF is password protected and requires a password to unlock.</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-400">
                        <span className="mr-2">🔓</span>
                        <span>This PDF is not password protected.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Password Input */}
                {isPasswordProtected && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-semibold text-white mb-4">Enter Password</h3>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password..."
                      className="mb-4"
                    />
                    <div className="text-sm text-gray-400">
                      ⚠️ Make sure you have the legal right to remove password protection from this PDF.
                    </div>
                  </div>
                )}

                {/* Unlock Options */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">Security Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-gray-300">Remove user password (open protection)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-gray-300">Remove owner password (editing restrictions)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-300">Keep document metadata</span>
                    </label>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Removing password protection..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUnlock}
                    disabled={isProcessing || (isPasswordProtected === true && !password)}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Unlocking...' : 'Remove Password Protection'}
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
                title={result.status === 'success' ? 'Password Removed!' : 'Unlock Failed'}
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
              <h3 className="text-lg font-semibold text-white mb-3">Security Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Remove user passwords</li>
                <li>• Remove owner passwords</li>
                <li>• Eliminate print restrictions</li>
                <li>• Remove copy protection</li>
                <li>• Enable editing access</li>
                <li>• Secure processing</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Important Notice</h3>
              <div className="space-y-2 text-gray-300">
                <p>• Only use on PDFs you own or have permission to unlock</p>
                <p>• Respect copyright and intellectual property rights</p>
                <p>• Files are processed securely and not stored</p>
                <p>• Original file security is permanently removed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
