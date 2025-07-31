import { ReactNode, useState } from 'react';
import Button from './Button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function CodeBlock({
  code,
  language = 'text',
  filename,
  showCopy = true,
  showDownload = false,
  children,
  className = ''
}: CodeBlockProps) {
  const [copyFeedback, setCopyFeedback] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const downloadCode = () => {
    const extension = language === 'javascript' ? 'js' : 
                     language === 'css' ? 'css' : 
                     language === 'html' ? 'html' : 'txt';
    const name = filename || `code.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {(filename || showCopy || showDownload) && (
        <div className="flex justify-between items-center px-4 py-2 bg-gray-700 border-b border-gray-600">
          <div className="text-sm text-gray-300">
            {filename && <span className="font-mono">{filename}</span>}
            {language && !filename && <span className="text-gray-400">{language}</span>}
          </div>
          <div className="flex gap-2 items-center">
            {copyFeedback && (
              <span className="text-green-400 text-sm">{copyFeedback}</span>
            )}
            {showCopy && (
              <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                📋 Copy
              </Button>
            )}
            {showDownload && (
              <Button variant="secondary" size="sm" onClick={downloadCode}>
                💾 Download
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="p-4">
        {children || (
          <pre className="text-white font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {code || 'No code to display'}
          </pre>
        )}
      </div>
    </div>
  );
}
