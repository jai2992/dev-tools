'use client';

import { useState, useCallback, useRef, useId } from 'react';
import Button from './Button';
import { combineAnimationClasses } from '../../utils/animations';

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onError?: (error: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  label?: string;
  helpText?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'large';
  showFileList?: boolean;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  onError,
  accept,
  multiple = false,
  maxSize = 10,
  maxFiles = 10,
  label,
  helpText,
  disabled = false,
  variant = 'default',
  showFileList = true,
  className = ''
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();

  const defaultLabel = multiple ? 'Choose files or drag and drop' : 'Choose a file or drag and drop';
  const defaultHelpText = `${accept ? `Supported formats: ${accept}. ` : ''}Maximum file size: ${maxSize}MB${multiple ? `. Maximum ${maxFiles} files` : ''}.`;

  const displayLabel = label || defaultLabel;
  const displayHelpText = helpText || defaultHelpText;

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    if (files.length === 0) {
      return { valid, errors };
    }

    if (multiple && files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      files = files.slice(0, maxFiles);
    }

    files.forEach((file, index) => {
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSize) {
        errors.push(`${file.name} exceeds ${maxSize}MB limit`);
        return;
      }

      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isValidType = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(new RegExp(type.replace('*', '.*')));
        });

        if (!isValidType) {
          errors.push(`${file.name} is not a supported file type`);
          return;
        }
      }

      valid.push(file);
    });

    return { valid, errors };
  }, [accept, maxSize, maxFiles, multiple]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const fileArray = Array.from(files);
    const { valid, errors } = validateFiles(fileArray);

    if (errors.length > 0) {
      const errorMessage = errors.join('. ');
      onError?.(errorMessage);
    }

    if (valid.length > 0) {
      setSelectedFiles(valid);
      onFileSelect(valid);
    }

    setIsProcessing(false);
  }, [onFileSelect, onError, validateFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  }, [selectedFiles, onFileSelect]);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    onFileSelect([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  // Variant sizing
  const variantClasses = {
    compact: 'p-4',
    default: 'p-8',
    large: 'p-12'
  };

  const iconSizes = {
    compact: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerClasses = combineAnimationClasses(
    'relative border-2 border-dashed rounded-xl text-center transition-all duration-300 ease-out',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-focus)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background)]',
    variantClasses[variant],
    disabled
      ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface)] opacity-50 cursor-not-allowed'
      : isDragOver
      ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-elevated)] scale-102'
      : 'border-[var(--color-border)] hover:border-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] cursor-pointer',
    className
  ).trim();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={containerClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={`${uploadId}-help`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Upload Icon */}
        <div className={combineAnimationClasses(
          'mx-auto mb-4 text-[var(--color-text-secondary)]',
          iconSizes[variant],
          isDragOver ? 'animate-bounce' : '',
          isProcessing ? 'animate-pulse' : ''
        )}>
          {isProcessing ? (
            <div className="animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
        </div>

        {/* Upload Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-[var(--color-text-primary)]">
            {isProcessing ? 'Processing files...' : displayLabel}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]" id={`${uploadId}-help`}>
            {displayHelpText}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            variant="secondary"
            size={variant === 'compact' ? 'sm' : 'md'}
            disabled={disabled || isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {isProcessing ? 'Processing...' : 'Select Files'}
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="sr-only"
          id={uploadId}
          disabled={disabled}
          aria-describedby={`${uploadId}-help`}
        />
      </div>

      {/* Selected Files List */}
      {showFileList && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
              Selected Files ({selectedFiles.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFiles}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)] ml-2"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
                aria-label={`Remove ${file.name}`}
              >
                Remove
              </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
