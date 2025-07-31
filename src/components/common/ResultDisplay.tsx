'use client';

import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Button from './Button';

interface ResultDisplayProps {
  title: string;
  status: 'success' | 'error' | 'processing';
  message?: string;
  downloadUrl?: string;
  fileName?: string;
  onReset?: () => void;
}

export default function ResultDisplay({ 
  title, 
  status, 
  message, 
  downloadUrl, 
  fileName,
  onReset 
}: ResultDisplayProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      if (fileName) link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="text-center">
        {status === 'success' && (
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        )}
        {status === 'error' && (
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}
        {status === 'processing' && (
          <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        )}
        
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        
        {message && (
          <p className={`text-sm mb-4 ${
            status === 'error' ? 'text-red-400' : 'text-gray-300'
          }`}>
            {message}
          </p>
        )}
        
        <div className="flex gap-3 justify-center">
          {downloadUrl && status === 'success' && (
            <Button variant="primary" onClick={handleDownload}>
              Download {fileName || 'File'}
            </Button>
          )}
          
          {onReset && (
            <Button variant="secondary" onClick={onReset}>
              Convert Another File
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
