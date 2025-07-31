'use client';

import { useState, useCallback } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  helpText?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  accept, 
  multiple = false, 
  maxSize = 10,
  label = "Choose files or drag and drop",
  helpText = `Maximum file size: ${maxSize}MB`
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      return fileSizeMB <= maxSize;
    });
    
    if (validFiles.length !== fileArray.length) {
      alert(`Some files exceed the ${maxSize}MB limit and were not selected.`);
    }
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [onFileSelect, maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragOver ? 'border-blue-500 bg-blue-50/5' : 'border-gray-600'}
        hover:border-blue-500 cursor-pointer
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-300 mb-2">{label}</p>
      {helpText && (
        <p className="text-sm text-gray-400 mb-4">{helpText}</p>
      )}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="secondary" className="cursor-pointer">
          Select Files
        </Button>
      </label>
    </div>
  );
}
