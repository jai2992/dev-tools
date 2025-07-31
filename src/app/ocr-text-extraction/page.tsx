'use client';

import { useState } from 'react';
import { PageHeader, FileUpload, ProgressBar, ResultDisplay, Textarea } from '@/components/common';

export default function OcrTextExtractionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [result, setResult] = useState<{
    status: 'success' | 'error';
    message?: string;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
      setExtractedText('');
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate OCR processing
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      // Simulate text extraction (in real implementation, use Tesseract.js)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);

      const sampleText = `Sample extracted text from ${selectedFile.name}

This is a demonstration of OCR text extraction. In a real implementation, this would use Tesseract.js to perform optical character recognition on the uploaded image or PDF.

The extracted text would appear here, maintaining the original structure and formatting as much as possible.

Features would include:
• Multi-language support
• High accuracy text recognition
• Formatting preservation
• Editable output
• Copy to clipboard functionality

This tool would support common image formats like PNG, JPEG, and PDF files with scanned content.`;

      setExtractedText(sampleText);
      setResult({
        status: 'success',
        message: `Successfully extracted ${sampleText.split(' ').length} words from the image!`
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to extract text. Please try with a clearer image.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      // You could show a toast notification here
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = extractedText;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${selectedFile?.name || 'document'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setExtractedText('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="OCR Text Extraction"
        description="Extract text from images and scanned PDFs using optical character recognition"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && !result && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".png,.jpg,.jpeg,.pdf,.gif,.bmp,.tiff"
                maxSize={25}
                label="Choose image or PDF file"
                helpText="Maximum file size: 25MB • Supports PNG, JPG, PDF, GIF, BMP, TIFF"
              />
            )}

            {selectedFile && !extractedText && (
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

                {/* Language Selection */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">OCR Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="eng">English</option>
                        <option value="spa">Spanish</option>
                        <option value="fra">French</option>
                        <option value="deu">German</option>
                        <option value="ita">Italian</option>
                        <option value="por">Portuguese</option>
                        <option value="rus">Russian</option>
                        <option value="ara">Arabic</option>
                        <option value="chi_sim">Chinese (Simplified)</option>
                        <option value="jpn">Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        OCR Engine Mode
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="1">Automatic (Recommended)</option>
                        <option value="2">Uniform Text</option>
                        <option value="3">Single Block</option>
                        <option value="4">Single Line</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <ProgressBar 
                    progress={progress} 
                    label="Extracting text from image..."
                  />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleExtract}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Extracting Text...' : 'Extract Text'}
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

            {extractedText && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">Extracted Text</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyText}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Copy Text
                      </button>
                      <button
                        onClick={handleDownloadText}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                  
                  <div className="mt-3 text-sm text-gray-400">
                    Word count: {extractedText.split(/\s+/).filter(word => word.length > 0).length} words
                    • Character count: {extractedText.length} characters
                  </div>
                </div>

                {result && (
                  <div className={`p-4 rounded-lg ${
                    result.status === 'success' 
                      ? 'bg-green-900 border border-green-700 text-green-100' 
                      : 'bg-red-900 border border-red-700 text-red-100'
                  }`}>
                    <p>{result.message}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Extract from New File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Best Results</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• High contrast, clear text</li>
                <li>• Minimum 300 DPI resolution</li>
                <li>• Horizontal text orientation</li>
                <li>• Clean, uncluttered background</li>
                <li>• Standard fonts and sizes</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Supported Content</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Scanned documents</li>
                <li>• Screenshots of text</li>
                <li>• Photos of documents</li>
                <li>• PDF with images</li>
                <li>• Historical documents</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
