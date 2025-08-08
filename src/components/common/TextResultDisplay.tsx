'use client';

import { useState } from 'react';
import Button from './Button';
import { combineAnimationClasses } from '../../utils/animations';

export interface TextResultDisplayProps {
  title: string;
  result: string;
  type?: 'text' | 'code' | 'json' | 'xml' | 'html' | 'css';
  downloadable?: boolean;
  filename?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  wrap?: boolean;
  variant?: 'default' | 'minimal' | 'elevated';
  className?: string;
}

export function TextResultDisplay({
  title,
  result,
  type = 'text',
  downloadable = true,
  filename = 'result.txt',
  maxHeight = '24rem',
  showLineNumbers = false,
  wrap = true,
  variant = 'default',
  className = ''
}: TextResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadFile = () => {
    const getExtension = (fileType: string) => {
      const extensions: Record<string, string> = {
        text: 'txt',
        code: 'txt',
        json: 'json',
        xml: 'xml',
        html: 'html',
        css: 'css'
      };
      return extensions[fileType] || 'txt';
    };

    const extension = getExtension(type);
    const finalFilename = filename.includes('.') ? filename : `${filename}.${extension}`;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageLabel = (fileType: string) => {
    const labels: Record<string, string> = {
      text: 'Text',
      code: 'Code',
      json: 'JSON',
      xml: 'XML',
      html: 'HTML',
      css: 'CSS'
    };
    return labels[fileType] || fileType.toUpperCase();
  };

  const variantClasses = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
    minimal: 'bg-[var(--color-surface-elevated)]',
    elevated: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg'
  };

  const containerClasses = combineAnimationClasses(
    'rounded-xl overflow-hidden animate-fade-in',
    variantClasses[variant],
    className
  ).trim();

  const headerClasses = combineAnimationClasses(
    'flex items-center justify-between px-4 py-3',
    'bg-[var(--color-surface-elevated)] border-b border-[var(--color-border-subtle)]',
    'backdrop-blur-sm'
  ).trim();

  const contentClasses = combineAnimationClasses(
    'relative overflow-hidden'
  ).trim();

  const preClasses = combineAnimationClasses(
    'text-[var(--color-text-primary)] text-sm leading-relaxed',
    'p-4 overflow-auto',
    wrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
    type === 'code' || type === 'json' || type === 'xml' || type === 'html' || type === 'css' 
      ? 'font-mono' 
      : 'font-sans',
    showLineNumbers ? 'pl-12' : ''
  ).trim();

  const lineCount = result.split('\n').length;

  return (
    <div 
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className={headerClasses}>
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
            {getLanguageLabel(type)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Copy feedback */}
          {copied && (
            <span className={combineAnimationClasses(
              'text-sm font-medium text-[var(--color-success)] animate-fade-in'
            )}>
              Copied!
            </span>
          )}
          
          {/* Action buttons */}
          <div className={combineAnimationClasses(
            'flex items-center space-x-1 transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-70 hover:opacity-100'
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              icon={
                copied ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              }
              aria-label="Copy to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            {downloadable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                aria-label="Download file"
              >
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={contentClasses}>
        {/* Line numbers */}
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-[var(--color-surface-elevated)] border-r border-[var(--color-border-subtle)] flex flex-col text-xs text-[var(--color-text-secondary)] font-mono">
            <div className="p-4 pb-0">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="text-right leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Text content */}
        <div style={{ maxHeight }} className="overflow-auto">
          <pre className={preClasses}>
            {result || 'No content to display'}
          </pre>
        </div>
        
        {/* Scroll gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[var(--color-surface)] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />
      </div>
      
      {/* Result stats */}
      {result && (
        <div className="px-4 py-2 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>
              {result.length.toLocaleString()} characters, {lineCount.toLocaleString()} lines
            </span>
            <span>
              {(new Blob([result]).size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextResultDisplay;
