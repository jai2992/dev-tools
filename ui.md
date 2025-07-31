# 🎨 DevTools.Software UI Design System

## Overview
This document defines the consistent UI/UX design system for all tools on devtools.software to ensure a cohesive, professional, and user-friendly experience across the entire platform.

## 🎯 Design Principles

### 1. **Consistency First**
- All tools should feel like part of the same platform
- Consistent spacing, colors, typography, and interactions
- Predictable user experience across different tools

### 2. **Mobile-First Approach**
- Every tool must work perfectly on mobile devices
- Touch-friendly interfaces with adequate spacing
- Responsive design that adapts to all screen sizes

### 3. **Performance-Oriented**
- Fast loading times with skeleton loading states
- Smooth animations and transitions
- Efficient component rendering

### 4. **Accessibility-Focused**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

---

## 🎨 Visual Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6;      /* Main brand color */
--primary-blue-dark: #1D4ED8; /* Hover states */
--primary-blue-light: #93C5FD; /* Disabled states */

/* Background Colors */
--bg-black: #000000;          /* Main background */
--bg-dark: #111827;           /* Card backgrounds */
--bg-darker: #0F172A;         /* Tool containers */
--bg-gradient: radial-gradient(at 75% 50%, #0EA5E9 0%, #3B82F6 50%, #1E40AF 100%);

/* Text Colors */
--text-white: #FFFFFF;        /* Primary text */
--text-gray-light: #E5E7EB;   /* Secondary text */
--text-gray: #9CA3AF;         /* Muted text */
--text-blue: #60A5FA;         /* Accent text */

/* Status Colors */
--success-green: #10B981;     /* Success states */
--error-red: #EF4444;         /* Error states */
--warning-yellow: #F59E0B;    /* Warning states */
--info-blue: #3B82F6;         /* Info states */

/* Border Colors */
--border-gray: #374151;       /* Default borders */
--border-blue: #3B82F6;       /* Focus borders */
--border-success: #10B981;    /* Success borders */
--border-error: #EF4444;      /* Error borders */
```

### Typography
```css
/* Font Family */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System
```css
/* Spacing Scale (rem) */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius: 0.5rem;       /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
--radius-full: 9999px;  /* Fully rounded */
```

---

## 📱 Component Library

### 1. Page Layout Structure
```tsx
// Standard tool page layout
export default function ToolPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <ToolHeader title="Tool Name" description="Tool description" />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Interface */}
          <ToolContainer>
            {/* Tool content goes here */}
          </ToolContainer>
          
          {/* Additional Information */}
          <ToolInfo />
        </div>
      </main>
      
      {/* Footer */}
      <ToolFooter />
    </div>
  );
}
```

### 2. Tool Header Component
```tsx
interface ToolHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function ToolHeader({ title, description, icon, breadcrumbs }: ToolHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
      <div className="container mx-auto px-4">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        
        <div className="flex items-center gap-4 mb-4">
          {icon && <div className="text-4xl">{icon}</div>}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mt-2">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Free</Badge>
          <Badge variant="secondary">No Registration</Badge>
          <Badge variant="secondary">Privacy-First</Badge>
        </div>
      </div>
    </header>
  );
}
```

### 3. Tool Container Component
```tsx
export function ToolContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
      {children}
    </div>
  );
}
```

### 4. Input Components
```tsx
// Text Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ label, error, helpText, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
          text-white placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, helpText, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
          text-white placeholder-gray-400 resize-none
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 min-h-[120px]
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  );
}
```

### 5. Button Components
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon, 
  children, 
  className,
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner className="w-4 h-4" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
```

### 6. File Upload Component
```tsx
interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept, 
  multiple, 
  maxSize = 10,
  label = "Choose files or drag and drop"
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragOver ? 'border-blue-500 bg-blue-50/5' : 'border-gray-600'}
        hover:border-blue-500 cursor-pointer
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        onFileSelect(files);
      }}
    >
      <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-300 mb-2">{label}</p>
      <p className="text-sm text-gray-400 mb-4">
        Maximum file size: {maxSize}MB
      </p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          onFileSelect(files);
        }}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="outline" className="cursor-pointer">
          Select Files
        </Button>
      </label>
    </div>
  );
}
```

### 7. Result Display Component
```tsx
interface ResultDisplayProps {
  title: string;
  result: string;
  type?: 'text' | 'code' | 'json' | 'xml';
  downloadable?: boolean;
  filename?: string;
}

export function ResultDisplay({ 
  title, 
  result, 
  type = 'text', 
  downloadable = true,
  filename = 'result.txt'
}: ResultDisplayProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    // Show toast notification
  };

  const downloadFile = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ClipboardIcon />}
            onClick={copyToClipboard}
          >
            Copy
          </Button>
          {downloadable && (
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowDownTrayIcon />}
              onClick={downloadFile}
            >
              Download
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <pre className={`
          bg-gray-800 border border-gray-700 rounded-lg p-4 
          text-sm text-gray-300 overflow-auto max-h-96
          ${type === 'code' ? 'font-mono' : ''}
        `}>
          <code>{result}</code>
        </pre>
      </div>
    </div>
  );
}
```

### 8. Loading States
```tsx
// Loading Spinner
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-blue-500 ${className}`} />
  );
}

// Skeleton Loader
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  );
}

// Processing State
export function ProcessingState({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
```

### 9. Status Components
```tsx
// Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({ type, title, children, dismissible, onDismiss }: AlertProps) {
  const styles = {
    success: 'bg-green-900/20 border-green-500 text-green-400',
    error: 'bg-red-900/20 border-red-500 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-500 text-blue-400'
  };

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg p-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {dismissible && (
          <button onClick={onDismiss} className="flex-shrink-0">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Progress Bar
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, label, showPercentage = true }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && <span className="text-gray-400">{value}%</span>}
        </div>
      )}
      <div className="bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
```

### 10. Navigation Components
```tsx
// Breadcrumbs
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      <Link href="/" className="text-blue-400 hover:text-blue-300">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          {item.href ? (
            <Link href={item.href} className="text-blue-400 hover:text-blue-300">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Tab Navigation
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === item.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {items.find(item => item.id === activeTab)?.content}
      </div>
    </div>
  );
}
```

---

## 📐 Layout Patterns

### 1. Two-Column Layout (Input/Output)
```tsx
export function TwoColumnLayout({ 
  leftTitle, 
  leftContent, 
  rightTitle, 
  rightContent 
}: TwoColumnLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{leftTitle}</h3>
        {leftContent}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{rightTitle}</h3>
        {rightContent}
      </div>
    </div>
  );
}
```

### 2. Single Column with Actions
```tsx
export function SingleColumnLayout({ 
  title, 
  content, 
  actions 
}: SingleColumnLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      </div>
      <div className="max-w-2xl mx-auto">
        {content}
      </div>
      {actions && (
        <div className="flex justify-center gap-4">
          {actions}
        </div>
      )}
    </div>
  );
}
```

### 3. Multi-Step Process
```tsx
interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function MultiStepLayout({ steps }: { steps: Step[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-16 h-0.5 mx-2
                ${index < currentStep ? 'bg-blue-600' : 'bg-gray-700'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {steps[currentStep]?.content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## 🎮 Interactive Patterns

### 1. Real-time Processing
```tsx
export function useRealTimeProcessing<T>(
  input: string,
  processor: (input: string) => T,
  debounceMs: number = 300
) {
  const [result, setResult] = useState<T | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    setIsProcessing(true);
    const timeoutId = setTimeout(() => {
      try {
        const processed = processor(input);
        setResult(processed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Processing failed');
        setResult(null);
      } finally {
        setIsProcessing(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [input, processor, debounceMs]);

  return { result, isProcessing, error };
}
```

### 2. Copy to Clipboard with Feedback
```tsx
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  return { copy, copied };
}
```

---

## 📱 Responsive Design Guidelines

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Optimizations
- Minimum touch target size: 44px
- Adequate spacing between interactive elements
- Optimized keyboard on mobile devices
- Swipe gestures where appropriate
- Thumb-friendly navigation placement

---

## ♿ Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Clear focus indicators
- Logical tab order
- Skip links for main content

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Alternative text for images
- Status announcements for dynamic content

### Color and Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Don't rely solely on color to convey information

---

## 🚀 Performance Guidelines

### Loading States
- Show skeleton loaders for content areas
- Display progress indicators for file processing
- Provide cancel options for long operations
- Graceful degradation for slow connections

### Optimization Techniques
- Lazy load non-critical components
- Optimize images and assets
- Use efficient algorithms for processing
- Implement virtual scrolling for large lists

---

## 📊 Analytics & Tracking

### User Interaction Events
```tsx
// Track tool usage
trackEvent('tool_used', {
  tool_name: 'json-formatter',
  input_size: inputText.length,
  processing_time: processingTime
});

// Track feature usage
trackEvent('feature_used', {
  feature: 'copy_to_clipboard',
  tool: 'url-encoder'
});

// Track errors
trackEvent('tool_error', {
  tool_name: 'pdf-converter',
  error_type: 'file_too_large',
  file_size: fileSize
});
```

---

## 🎯 Implementation Checklist

For each new tool, ensure:

### ✅ UI/UX Checklist
- [ ] Follows the design system colors and typography
- [ ] Uses consistent spacing and layout patterns
- [ ] Includes proper loading states
- [ ] Has error handling and user feedback
- [ ] Supports keyboard navigation
- [ ] Works on mobile devices
- [ ] Includes copy/download functionality
- [ ] Has clear instructions and examples

### ✅ Technical Checklist
- [ ] Uses reusable UI components
- [ ] Implements proper TypeScript types
- [ ] Includes error boundaries
- [ ] Has proper SEO meta tags
- [ ] Implements analytics tracking
- [ ] Follows performance guidelines
- [ ] Includes accessibility features
- [ ] Has consistent file structure

### ✅ Content Checklist
- [ ] Clear tool description
- [ ] Usage instructions
- [ ] Examples and use cases
- [ ] FAQ section
- [ ] Related tools suggestions
- [ ] Privacy and security information

---

This UI design system ensures that every tool on devtools.software provides a consistent, professional, and user-friendly experience while maintaining the flexibility to accommodate different tool requirements.
