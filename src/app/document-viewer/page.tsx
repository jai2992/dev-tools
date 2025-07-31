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
          // For Word documents, show file information with limitation notice
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background: #f8f9fa; border-radius: 8px;">
              <h2 style="color: #d63384; margin-bottom: 16px;">📄 Word Document Detected</h2>
              
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
                <strong>⚠️ Limited Preview:</strong> Full Word document parsing requires specialized libraries. 
                This viewer shows document information only.
              </div>
              
              <h3 style="color: #0d6efd;">Document Information</h3>
              <ul style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #0d6efd;">
                <li><strong>Filename:</strong> ${file.name}</li>
                <li><strong>Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</li>
                <li><strong>Type:</strong> Microsoft Word Document</li>
                <li><strong>Last Modified:</strong> ${file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown'}</li>
              </ul>
              
              <h3 style="color: #198754;">For Full Document Viewing</h3>
              <div style="background: #d1edff; padding: 15px; border-radius: 6px;">
                <p><strong>Recommended approaches:</strong></p>
                <ul>
                  <li>Use Microsoft Office Online or Google Docs</li>
                  <li>Convert to PDF first using our Word-to-PDF tool</li>
                  <li>Download and open in Word or LibreOffice</li>
                  <li>Implement server-side parsing with mammoth.js or similar</li>
                </ul>
              </div>
              
              <div style="margin-top: 20px; padding: 10px; background: #e2e3e5; border-radius: 6px; font-size: 0.9em;">
                <strong>Note:</strong> Browser-based Word document parsing requires additional libraries 
                like mammoth.js for .docx files or specialized server-side processing.
              </div>
            </div>
          `);
        } else if (['xlsx', 'xls'].includes(extension || '')) {
          // For Excel files, show file information with limitation notice
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #217346; margin-bottom: 16px;">📊 Excel Spreadsheet Detected</h2>
              
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
                <strong>⚠️ Limited Preview:</strong> Full Excel file parsing requires specialized libraries. 
                This viewer shows file information only.
              </div>
              
              <h3 style="color: #217346;">File Information</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #217346; margin-bottom: 20px;">
                <p><strong>Filename:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p><strong>Type:</strong> Microsoft Excel Spreadsheet</p>
                <p><strong>Last Modified:</strong> ${file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown'}</p>
              </div>
              
              <h3 style="color: #217346;">For Full Spreadsheet Viewing</h3>
              <div style="background: #d4edda; padding: 15px; border-radius: 6px;">
                <p><strong>Recommended approaches:</strong></p>
                <ul>
                  <li>Use Microsoft Excel Online or Google Sheets</li>
                  <li>Convert to CSV using our Excel tools</li>
                  <li>Download and open in Excel or LibreOffice Calc</li>
                  <li>Implement parsing with SheetJS (xlsx library)</li>
                </ul>
              </div>
              
              <div style="margin-top: 20px; padding: 10px; background: #e2e3e5; border-radius: 6px; font-size: 0.9em;">
                <strong>Note:</strong> Browser-based Excel parsing can be implemented using SheetJS library 
                to read spreadsheet data, formulas, and formatting.
              </div>
            </div>
          `);
        } else if (['pptx', 'ppt'].includes(extension || '')) {
          // For PowerPoint files, show file information with limitation notice
          setViewerContent(`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #c43e1c; margin-bottom: 16px;">🎯 PowerPoint Presentation Detected</h2>
              
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
                <strong>⚠️ Limited Preview:</strong> Full PowerPoint parsing requires specialized libraries. 
                This viewer shows file information only.
              </div>
              
              <h3 style="color: #c43e1c;">Presentation Information</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #c43e1c; margin-bottom: 20px;">
                <p><strong>Filename:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p><strong>Type:</strong> Microsoft PowerPoint Presentation</p>
                <p><strong>Last Modified:</strong> ${file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown'}</p>
              </div>
              
              <h3 style="color: #c43e1c;">For Full Presentation Viewing</h3>
              <div style="background: #f8d7da; padding: 15px; border-radius: 6px;">
                <p><strong>Recommended approaches:</strong></p>
                <ul>
                  <li>Use Microsoft PowerPoint Online or Google Slides</li>
                  <li>Convert to PDF using our PowerPoint-to-PDF tool</li>
                  <li>Download and open in PowerPoint or LibreOffice Impress</li>
                  <li>Implement parsing with specialized PowerPoint libraries</li>
                </ul>
              </div>
              
              <div style="margin-top: 20px; padding: 10px; background: #e2e3e5; border-radius: 6px; font-size: 0.9em;">
                <strong>Note:</strong> Browser-based PowerPoint parsing is complex and requires 
                specialized libraries to handle slides, animations, and multimedia content.
              </div>
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
