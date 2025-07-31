'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';
import { Button, Select, Textarea, Card, CodeBlock, PageHeader } from '@/components/common';

interface MinificationOptions {
  removeComments: boolean;
  removeWhitespace: boolean;
  obfuscateVariables: boolean;
  preserveNewlines: boolean;
}

interface MinificationResult {
  original: string;
  minified: string;
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
}

type SupportedLanguage = 'javascript' | 'css' | 'html' | 'json';

export default function CodeMinifierPage() {
  const [inputCode, setInputCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('javascript');
  const [isMinifying, setIsMinifying] = useState(false);
  const [result, setResult] = useState<MinificationResult | null>(null);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<MinificationOptions>({
    removeComments: true,
    removeWhitespace: true,
    obfuscateVariables: false,
    preserveNewlines: false
  });

  const examples = {
    javascript: `// Example JavaScript code
function calculateTotal(items) {
    let total = 0;
    
    /* Loop through all items
       and add their prices */
    for (let i = 0; i < items.length; i++) {
        if (items[i].price > 0) {
            total += items[i].price;
        }
    }
    
    return total;
}

const taxRate = 0.08;
const finalTotal = calculateTotal(items) * (1 + taxRate);`,

    css: `/* Main styles for the website */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Navigation styles */
.nav {
    background-color: #333;
    color: white;
    padding: 1rem;
}

.nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

.nav li {
    margin-right: 20px;
}

.nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

.nav a:hover {
    text-decoration: underline;
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags for SEO -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Page</title>
</head>
<body>
    <!-- Main content area -->
    <div class="container">
        <header>
            <h1>Welcome to Our Website</h1>
            <p>This is an example of HTML content.</p>
        </header>
        
        <main>
            <section>
                <h2>About Us</h2>
                <p>We are a company that does amazing things.</p>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2024 Example Company</p>
        </footer>
    </div>
</body>
</html>`,

    json: `{
  "name": "example-project",
  "version": "1.0.0",
  "description": "An example project with configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21",
    "moment": "^2.29.0"
  },
  "devDependencies": {
    "jest": "^28.0.0",
    "nodemon": "^2.0.15",
    "webpack": "^5.70.0"
  }
}`
  };

  const minifyJavaScript = (code: string, opts: MinificationOptions): string => {
    let minified = code;

    // Remove comments
    if (opts.removeComments) {
      // Remove single line comments
      minified = minified.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove extra whitespace
    if (opts.removeWhitespace) {
      if (opts.preserveNewlines) {
        // Keep newlines but remove other whitespace
        minified = minified.replace(/[ \t]+/g, ' ');
        minified = minified.replace(/[ \t]*\n[ \t]*/g, '\n');
      } else {
        // Remove all unnecessary whitespace including newlines
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/;\s*}/g, ';}');
        minified = minified.replace(/{\s*/g, '{');
        minified = minified.replace(/}\s*/g, '}');
        minified = minified.replace(/,\s*/g, ',');
        minified = minified.replace(/:\s*/g, ':');
        minified = minified.replace(/;\s*/g, ';');
      }
    }

    // Basic variable obfuscation (very simple)
    if (opts.obfuscateVariables) {
      const varNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      let varIndex = 0;
      
      // This is a very basic obfuscation - in real scenarios you'd use proper AST parsing
      minified = minified.replace(/\blet\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match, varName) => {
        if (varIndex < varNames.length) {
          const newName = varNames[varIndex++];
          // Replace subsequent uses of this variable (basic approach)
          minified = minified.replace(new RegExp(`\\b${varName}\\b`, 'g'), newName);
          return `let ${newName}`;
        }
        return match;
      });
    }

    return minified.trim();
  };

  const minifyCSS = (code: string, opts: MinificationOptions): string => {
    let minified = code;

    // Remove comments
    if (opts.removeComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove extra whitespace
    if (opts.removeWhitespace) {
      if (opts.preserveNewlines) {
        minified = minified.replace(/[ \t]+/g, ' ');
        minified = minified.replace(/[ \t]*\n[ \t]*/g, '\n');
      } else {
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/;\s*}/g, ';}');
        minified = minified.replace(/{\s*/g, '{');
        minified = minified.replace(/}\s*/g, '}');
        minified = minified.replace(/;\s*/g, ';');
        minified = minified.replace(/:\s*/g, ':');
        minified = minified.replace(/,\s*/g, ',');
      }
    }

    return minified.trim();
  };

  const minifyHTML = (code: string, opts: MinificationOptions): string => {
    let minified = code;

    // Remove comments
    if (opts.removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove extra whitespace
    if (opts.removeWhitespace) {
      if (opts.preserveNewlines) {
        minified = minified.replace(/[ \t]+/g, ' ');
        minified = minified.replace(/[ \t]*\n[ \t]*/g, '\n');
      } else {
        minified = minified.replace(/>\s+</g, '><');
        minified = minified.replace(/\s+/g, ' ');
      }
    }

    return minified.trim();
  };

  const minifyJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed);
    } catch (_err) {
      throw new Error('Invalid JSON syntax');
    }
  };

  const minifyCode = useCallback(async () => {
    if (!inputCode.trim()) {
      setResult(null);
      return;
    }

    setIsMinifying(true);
    setError('');

    try {
      let minified = '';

      switch (selectedLanguage) {
        case 'javascript':
          minified = minifyJavaScript(inputCode, options);
          break;
        case 'css':
          minified = minifyCSS(inputCode, options);
          break;
        case 'html':
          minified = minifyHTML(inputCode, options);
          break;
        case 'json':
          minified = minifyJSON(inputCode);
          break;
        default:
          minified = inputCode;
      }

      const originalSize = new Blob([inputCode]).size;
      const minifiedSize = new Blob([minified]).size;
      const compressionRatio = ((originalSize - minifiedSize) / originalSize) * 100;

      setResult({
        original: inputCode,
        minified,
        originalSize,
        minifiedSize,
        compressionRatio
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to minify code');
      setResult(null);
    } finally {
      setIsMinifying(false);
    }
  }, [inputCode, selectedLanguage, options]);

  const beautifyCode = () => {
    if (!result?.minified) return;

    // Simple beautification (in real scenarios, you'd use proper formatters)
    let beautified = result.minified;

    switch (selectedLanguage) {
      case 'javascript':
      case 'css':
        beautified = beautified.replace(/;/g, ';\n');
        beautified = beautified.replace(/{/g, ' {\n  ');
        beautified = beautified.replace(/}/g, '\n}\n');
        beautified = beautified.replace(/,/g, ',\n  ');
        break;
      case 'html':
        beautified = beautified.replace(/></g, '>\n<');
        break;
      case 'json':
        try {
          const parsed = JSON.parse(beautified);
          beautified = JSON.stringify(parsed, null, 2);
        } catch (_err) {
          // Keep original if parsing fails
        }
        break;
    }

    setInputCode(beautified);
    setResult(null);
  };

  const loadExample = () => {
    setInputCode(examples[selectedLanguage]);
  };

  const clearAll = () => {
    setInputCode('');
    setResult(null);
    setError('');
  };

  const updateOption = (key: keyof MinificationOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Code Minifier | JavaScript CSS HTML Minifier | devtools.software</title>
        <meta name="description" content="Minify JavaScript, CSS, HTML, and JSON code online. Reduce file sizes, remove comments and whitespace with advanced options." />
        <meta property="og:title" content="Code Minifier - Compress Your Code" />
        <meta property="og:description" content="Minify and compress code for production with customizable options" />
        <meta property="og:url" content="https://devtools.software/code-minifier" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title="Code Minifier"
        description="Minify and compress your code for production"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <Card title="Minification Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Select
                label="Language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              >
                <option value="javascript">JavaScript</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
              </Select>
            </div>

            {/* Options for JS/CSS/HTML */}
            {selectedLanguage !== 'json' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={options.removeComments}
                    onChange={(e) => updateOption('removeComments', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-300">Remove Comments</span>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={options.removeWhitespace}
                    onChange={(e) => updateOption('removeWhitespace', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-300">Remove Whitespace</span>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={options.preserveNewlines}
                    onChange={(e) => updateOption('preserveNewlines', e.target.checked)}
                    disabled={!options.removeWhitespace}
                    className="rounded"
                  />
                  <span className="text-gray-300">Preserve Newlines</span>
                </label>

                {selectedLanguage === 'javascript' && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.obfuscateVariables}
                      onChange={(e) => updateOption('obfuscateVariables', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Obfuscate Variables</span>
                  </label>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={minifyCode} disabled={isMinifying || !inputCode.trim()}>
                {isMinifying ? '🔄 Minifying...' : '🗜️ Minify Code'}
              </Button>
              <Button variant="secondary" onClick={loadExample}>
                📝 Load Example
              </Button>
              {result && (
                <Button variant="secondary" onClick={beautifyCode}>
                  ✨ Beautify Minified
                </Button>
              )}
              <Button variant="danger" onClick={clearAll}>
                🗑️ Clear All
              </Button>
            </div>
          </Card>

          {/* Input */}
          <Card title="Input Code">
            <Textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={`Enter ${selectedLanguage} code to minify...`}
              rows={15}
              characterCount
              className="font-mono text-sm"
            />
          </Card>

          {/* Error Display */}
          {error && (
            <Card>
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            </Card>
          )}

          {/* Results */}
          {result && (
            <>
              {/* Statistics */}
              <Card title="Compression Statistics">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {(result.originalSize / 1024).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Original KB</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {(result.minifiedSize / 1024).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Minified KB</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {result.compressionRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Compression</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {((result.originalSize - result.minifiedSize) / 1024).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Saved KB</div>
                  </div>
                </div>
              </Card>

              {/* Minified Output */}
              <Card title="Minified Code">
                <CodeBlock
                  code={result.minified}
                  language={selectedLanguage}
                  filename={`minified.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`}
                  showCopy
                  showDownload
                />
              </Card>

              {/* Before/After Comparison */}
              <Card title="Before / After Comparison">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Original</h4>
                    <CodeBlock
                      code={result.original}
                      language={selectedLanguage}
                      showCopy={false}
                      className="max-h-64 overflow-auto"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Minified</h4>
                    <CodeBlock
                      code={result.minified}
                      language={selectedLanguage}
                      showCopy={false}
                      className="max-h-64 overflow-auto"
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Usage Instructions */}
          <Card title="How to Use">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Minification Options</h4>
                <ul className="space-y-1">
                  <li>• <strong>Remove Comments:</strong> Strips all code comments</li>
                  <li>• <strong>Remove Whitespace:</strong> Eliminates unnecessary spaces</li>
                  <li>• <strong>Preserve Newlines:</strong> Keeps line breaks for readability</li>
                  <li>• <strong>Obfuscate Variables:</strong> Renames variables (JS only)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Supported Languages</h4>
                <ul className="space-y-1">
                  <li>• <strong>JavaScript:</strong> ES5/ES6+ minification</li>
                  <li>• <strong>CSS:</strong> Stylesheet compression</li>
                  <li>• <strong>HTML:</strong> Markup minification</li>
                  <li>• <strong>JSON:</strong> Data structure compression</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>• Real-time compression statistics</li>
                  <li>• Before/after code comparison</li>
                  <li>• Reverse operation (beautify minified code)</li>
                  <li>• Download minified files</li>
                  <li>• Copy to clipboard functionality</li>
                  <li>• File size reduction metrics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Use Cases</h4>
                <ul className="space-y-1">
                  <li>• Production build optimization</li>
                  <li>• Reducing bandwidth usage</li>
                  <li>• Faster page load times</li>
                  <li>• CDN deployment preparation</li>
                  <li>• Mobile performance optimization</li>
                  <li>• Bundle size reduction</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
