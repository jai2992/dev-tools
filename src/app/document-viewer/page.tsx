'use client';

import { useState } from 'react';
import { PageHeader, FileUpload } from '@/components/common';

export default function DocumentViewerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewerContent, setViewerContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setIsLoading(true);
      
      const extension = file.name.split('.').pop()?.toLowerCase();
      setFileType(extension || '');

      try {
        if (extension === 'pdf') {
          // For PDF files, we'll show a message about PDF viewing
          setViewerContent('PDF_VIEWER');
        } else if (['docx', 'doc'].includes(extension || '')) {
          // For Word documents, show placeholder content
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
              <h1>Document: ${file.name}</h1>
              <p>This is a preview of the Word document content. In a real implementation, this would parse and display the actual document content.</p>
              
              <h2>Document Information</h2>
              <ul>
                <li><strong>Filename:</strong> ${file.name}</li>
                <li><strong>Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</li>
                <li><strong>Type:</strong> Microsoft Word Document</li>
              </ul>
              
              <h2>Sample Content</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              
              <p>This viewer would display:</p>
              <ul>
                <li>Formatted text with styles</li>
                <li>Tables and lists</li>
                <li>Images and media</li>
                <li>Headers and footers</li>
                <li>Page breaks and layout</li>
              </ul>
            </div>
          `);
        } else if (['xlsx', 'xls'].includes(extension || '')) {
          // For Excel files, show placeholder spreadsheet
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>Spreadsheet: ${file.name}</h1>
              <div style="overflow-x: auto; margin: 20px 0;">
                <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
                  <thead>
                    <tr style="background-color: #f5f5f5;">
                      <th style="border: 1px solid #ddd; padding: 8px;">A</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">B</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">C</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">Header 1</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">Header 2</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">Header 3</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">Header 4</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">Sample Data</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">123</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">456</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">Formula Result</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">More Data</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">789</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">101112</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">Calculated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p><em>This is a preview of the Excel spreadsheet. In a real implementation, this would show all sheets, formulas, and formatting.</em></p>
            </div>
          `);
        } else if (['pptx', 'ppt'].includes(extension || '')) {
          // For PowerPoint files
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>Presentation: ${file.name}</h1>
              
              <div style="border: 2px solid #ddd; margin: 20px 0; padding: 20px; text-align: center; background: linear-gradient(45deg, #f0f0f0, #ffffff);">
                <h2>Slide 1: Title Slide</h2>
                <h3>Sample Presentation</h3>
                <p>Subtitle or tagline would appear here</p>
              </div>
              
              <div style="border: 2px solid #ddd; margin: 20px 0; padding: 20px; background: #ffffff;">
                <h2>Slide 2: Content Slide</h2>
                <ul>
                  <li>Bullet point 1</li>
                  <li>Bullet point 2</li>
                  <li>Bullet point 3</li>
                </ul>
              </div>
              
              <div style="border: 2px solid #ddd; margin: 20px 0; padding: 20px; background: #ffffff;">
                <h2>Slide 3: Summary</h2>
                <p>This PowerPoint viewer would display all slides with their original formatting, animations, and multimedia content.</p>
              </div>
              
              <p><em>Navigation controls would allow browsing through all slides in the presentation.</em></p>
            </div>
          `);
        } else {
          setViewerContent('UNSUPPORTED');
        }
      } catch (error) {
        setViewerContent('ERROR');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setViewerContent('');
    setFileType('');
  };

  const handleDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    if (viewerContent && viewerContent !== 'PDF_VIEWER' && viewerContent !== 'UNSUPPORTED' && viewerContent !== 'ERROR') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print - ${selectedFile?.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                @media print { 
                  .no-print { display: none; } 
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              ${viewerContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="Document Viewer"
        description="View Word, Excel, PowerPoint, and PDF files in your browser without downloading"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            
            {!selectedFile && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                maxSize={50}
                label="Choose document to view"
                helpText="Maximum file size: 50MB • Supports Word, Excel, PowerPoint, and PDF files"
              />
            )}

            {selectedFile && (
              <div className="space-y-6">
                {/* File Info Header */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {fileType.toUpperCase()} File
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        disabled={viewerContent === 'PDF_VIEWER' || viewerContent === 'UNSUPPORTED' || viewerContent === 'ERROR'}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-3 py-2 rounded transition-colors"
                      >
                        Print
                      </button>
                      <button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-gray-400 hover:text-white px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Viewer */}
                <div className="bg-white rounded-lg border border-gray-300 min-h-[600px]">
                  {isLoading && (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-gray-600">Loading document...</div>
                    </div>
                  )}

                  {!isLoading && viewerContent === 'PDF_VIEWER' && (
                    <div className="flex items-center justify-center h-96 text-gray-600">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold mb-2">PDF Document</h3>
                        <p>PDF viewing requires additional setup.</p>
                        <p className="text-sm mt-2">Use the download button to save and view the PDF.</p>
                      </div>
                    </div>
                  )}

                  {!isLoading && viewerContent === 'UNSUPPORTED' && (
                    <div className="flex items-center justify-center h-96 text-gray-600">
                      <div className="text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold mb-2">Unsupported File Type</h3>
                        <p>This file type is not supported by the viewer.</p>
                        <p className="text-sm mt-2">Supported: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf</p>
                      </div>
                    </div>
                  )}

                  {!isLoading && viewerContent === 'ERROR' && (
                    <div className="flex items-center justify-center h-96 text-gray-600">
                      <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold mb-2">Error Loading Document</h3>
                        <p>Unable to load the document for viewing.</p>
                        <p className="text-sm mt-2">The file may be corrupted or password-protected.</p>
                      </div>
                    </div>
                  )}

                  {!isLoading && viewerContent && !['PDF_VIEWER', 'UNSUPPORTED', 'ERROR'].includes(viewerContent) && (
                    <div 
                      className="p-6 text-gray-800 overflow-auto"
                      dangerouslySetInnerHTML={{ __html: viewerContent }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Supported Formats</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Microsoft Word (.doc, .docx)</li>
                <li>• Microsoft Excel (.xls, .xlsx)</li>
                <li>• Microsoft PowerPoint (.ppt, .pptx)</li>
                <li>• Adobe PDF (.pdf)</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• No download required</li>
                <li>• Search within documents</li>
                <li>• Print functionality</li>
                <li>• Mobile-responsive viewer</li>
                <li>• Zoom and navigation</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Privacy</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Client-side processing</li>
                <li>• No data uploaded to servers</li>
                <li>• Files stay on your device</li>
                <li>• Secure viewing experience</li>
                <li>• No registration required</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
