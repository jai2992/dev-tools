import { ReactNode, useState, useRef, useEffect } from 'react';
import Button from './Button';
import { combineAnimationClasses } from '../../utils/animations';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  showLineNumbers?: boolean;
  maxHeight?: string;
  wrap?: boolean;
  variant?: 'default' | 'minimal' | 'elevated';
  children?: ReactNode;
  className?: string;
}

const languageMap: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  json: 'JSON',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  php: 'PHP',
  sql: 'SQL',
  bash: 'Bash',
  sh: 'Shell',
  text: 'Text',
  txt: 'Text'
};

export default function CodeBlock({
  code,
  language = 'text',
  filename,
  showCopy = true,
  showDownload = false,
  showLineNumbers = false,
  maxHeight,
  wrap = false,
  variant = 'default',
  children,
  className = ''
}: CodeBlockProps) {
  const [copyFeedback, setCopyFeedback] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (showLineNumbers && code) {
      setLineCount(code.split('\n').length);
    }
  }, [code, showLineNumbers]);

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
    const getExtension = (lang: string) => {
      const extensions: Record<string, string> = {
        javascript: 'js',
        typescript: 'ts',
        jsx: 'jsx',
        tsx: 'tsx',
        css: 'css',
        scss: 'scss',
        sass: 'sass',
        html: 'html',
        json: 'json',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yml',
        markdown: 'md',
        python: 'py',
        java: 'java',
        php: 'php',
        sql: 'sql',
        bash: 'sh',
        shell: 'sh'
      };
      return extensions[lang.toLowerCase()] || 'txt';
    };
    
    const extension = getExtension(language);
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

  const displayLanguage = languageMap[language.toLowerCase()] || language.toUpperCase();

  const variantClasses = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border-subtle)]',
    minimal: 'bg-[var(--color-surface-elevated)]',
    elevated: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg'
  };

  const containerClasses = combineAnimationClasses(
    'relative rounded-xl overflow-hidden font-mono animate-fade-in',
    variantClasses[variant],
    className
  ).trim();

  const headerClasses = combineAnimationClasses(
    'flex justify-between items-center px-4 py-3',
    'bg-[var(--color-surface-elevated)] border-b border-[var(--color-border-subtle)]',
    'backdrop-blur-sm'
  ).trim();

  const codeContainerClasses = combineAnimationClasses(
    'relative',
    showLineNumbers ? 'flex' : '',
    maxHeight ? 'overflow-auto' : ''
  ).trim();

  const preClasses = combineAnimationClasses(
    'text-[var(--color-text-primary)] text-sm leading-relaxed',
    'p-4 overflow-x-auto',
    wrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
    showLineNumbers ? 'flex-1 pl-2' : ''
  ).trim();

  const lineNumbersClasses = combineAnimationClasses(
    'select-none text-[var(--color-text-secondary)] text-sm leading-relaxed',
    'py-4 pl-4 pr-3 bg-[var(--color-surface-elevated)]',
    'border-r border-[var(--color-border-subtle)]',
    'min-w-[3rem] text-right'
  ).trim();

  return (
    <div 
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with filename/language and actions */}
      {(filename || language || showCopy || showDownload) && (
        <div className={headerClasses}>
          <div className="flex items-center space-x-3">
            {filename && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                <span className="ml-2 text-sm font-medium text-[var(--color-text-primary)]">
                  {filename}
                </span>
              </div>
            )}
            {!filename && language && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
                {displayLanguage}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Copy feedback */}
            {copyFeedback && (
              <span className={combineAnimationClasses(
                'text-sm font-medium animate-fade-in',
                copyFeedback.includes('Failed') ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'
              )}>
                {copyFeedback}
              </span>
            )}
            
            {/* Action buttons - show on hover or always on touch devices */}
            <div className={combineAnimationClasses(
              'flex items-center space-x-1 transition-opacity duration-200',
              isHovered ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            )}>
              {showCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
                aria-label="Copy code"
              >
                Copy
              </Button>
              )}
              
              {showDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                aria-label="Download code"
              >
                Download
              </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Code content */}
      <div 
        className={codeContainerClasses}
        style={{ maxHeight }}
      >
        {/* Line numbers */}
        {showLineNumbers && (
          <div className={lineNumbersClasses}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="block">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Code content */}
        <pre ref={codeRef} className={preClasses}>
          <code>{children || code || 'No code to display'}</code>
        </pre>
      </div>
      
      {/* Scroll gradient overlay for long code */}
      {maxHeight && (
        <>
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[var(--color-surface)] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />
        </>
      )}
    </div>
  );
}
