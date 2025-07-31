'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';

interface LanguageConfig {
  name: string;
  id: string;
  example: string;
  placeholder: string;
}

const languages: LanguageConfig[] = [
  {
    name: 'JavaScript',
    id: 'javascript',
    example: 'function hello(){console.log("Hello World");}',
    placeholder: 'Enter JavaScript code to format...'
  },
  {
    name: 'HTML',
    id: 'html',
    example: '<div><p>Hello</p></div>',
    placeholder: 'Enter HTML code to format...'
  },
  {
    name: 'CSS',
    id: 'css',
    example: '.class{color:red;margin:0;}',
    placeholder: 'Enter CSS code to format...'
  },
  {
    name: 'JSON',
    id: 'json',
    example: '{"name":"John","age":30}',
    placeholder: 'Enter JSON code to format...'
  },
  {
    name: 'XML',
    id: 'xml',
    example: '<root><item>value</item></root>',
    placeholder: 'Enter XML code to format...'
  },
  {
    name: 'SQL',
    id: 'sql',
    example: 'SELECT * FROM users WHERE id=1;',
    placeholder: 'Enter SQL code to format...'
  }
];

export default function CodeFormatterPage() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [indentType, setIndentType] = useState('spaces');
  const [indentSize, setIndentSize] = useState(2);
  const [isFormatting, setIsFormatting] = useState(false);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  const formatCode = useCallback(async () => {
    if (!inputCode.trim()) {
      setOutputCode('');
      return;
    }

    setIsFormatting(true);
    setError('');

    try {
      let formatted = '';
      const indent = indentType === 'tabs' ? '\t' : ' '.repeat(indentSize);

      switch (selectedLanguage) {
        case 'javascript':
          formatted = formatJavaScript(inputCode, indent);
          break;
        case 'html':
          formatted = formatHTML(inputCode, indent);
          break;
        case 'css':
          formatted = formatCSS(inputCode, indent);
          break;
        case 'json':
          formatted = formatJSON(inputCode, indent);
          break;
        case 'xml':
          formatted = formatXML(inputCode, indent);
          break;
        case 'sql':
          formatted = formatSQL(inputCode, indent);
          break;
        default:
          formatted = inputCode;
      }

      setOutputCode(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format code');
      setOutputCode('');
    } finally {
      setIsFormatting(false);
    }
  }, [inputCode, selectedLanguage, indentType, indentSize]);

  const formatJavaScript = (code: string, indent: string): string => {
    // Basic JavaScript formatting
    let formatted = code
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*(?=\w)/g, ';\n')
      .replace(/}\s*(?=\w)/g, '}\n')
      .replace(/,\s*(?=\w)/g, ',\n');

    return addIndentation(formatted, indent);
  };

  const formatHTML = (code: string, indent: string): string => {
    let formatted = code
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '');

    return addIndentation(formatted, indent);
  };

  const formatCSS = (code: string, indent: string): string => {
    let formatted = code
      .replace(/{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/}\s*/g, '\n}\n')
      .replace(/,\s*(?=[\w.])/g, ',\n');

    return addIndentation(formatted, indent);
  };

  const formatJSON = (code: string, indent: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, indent);
    } catch {
      throw new Error('Invalid JSON syntax');
    }
  };

  const formatXML = (code: string, indent: string): string => {
    let formatted = code
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '');

    return addIndentation(formatted, indent);
  };

  const formatSQL = (code: string, indent: string): string => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    
    let formatted = code.toUpperCase();
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    return formatted.trim();
  };

  const addIndentation = (code: string, indent: string): string => {
    const lines = code.split('\n');
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.includes('}') || trimmed.includes('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indentedLine = indent.repeat(indentLevel) + trimmed;

      if (trimmed.includes('{') || (trimmed.includes('<') && !trimmed.includes('</'))) {
        indentLevel++;
      }

      return indentedLine;
    }).join('\n');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const loadExample = () => {
    const lang = languages.find(l => l.id === selectedLanguage);
    if (lang) {
      setInputCode(lang.example);
    }
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setError('');
  };

  const downloadCode = () => {
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Code Formatter | Free Online Multi-Language Code Beautifier | devtools.software</title>
        <meta name="description" content="Format and beautify HTML, CSS, JavaScript, JSON, XML, and SQL code online. Free code formatter with customizable indentation and syntax validation." />
        <meta property="og:title" content="Code Formatter - Multi-Language Code Beautifier" />
        <meta property="og:description" content="Format and beautify code for various programming languages with customizable options" />
        <meta property="og:url" content="https://devtools.software/code-formatter" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">Code Formatter</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Format and beautify code for multiple programming languages</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="indentType" className="block text-sm font-medium text-gray-300 mb-2">
                  Indentation
                </label>
                <select
                  id="indentType"
                  value={indentType}
                  onChange={(e) => setIndentType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="spaces">Spaces</option>
                  <option value="tabs">Tabs</option>
                </select>
              </div>

              {indentType === 'spaces' && (
                <div>
                  <label htmlFor="indentSize" className="block text-sm font-medium text-gray-300 mb-2">
                    Indent Size
                  </label>
                  <select
                    id="indentSize"
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={formatCode}
                disabled={isFormatting || !inputCode.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                {isFormatting ? '🔄 Formatting...' : '✨ Format Code'}
              </button>
              <button
                onClick={loadExample}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                📝 Load Example
              </button>
              <button
                onClick={clearAll}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>

          {/* Input/Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Input Code</h3>
                <span className="text-sm text-gray-400">{inputCode.length} characters</span>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={languages.find(l => l.id === selectedLanguage)?.placeholder}
                rows={20}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Output */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Formatted Code</h3>
                <div className="flex gap-2">
                  {outputCode && (
                    <>
                      <button
                        onClick={() => copyToClipboard(outputCode)}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={downloadCode}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                      >
                        💾 Download
                      </button>
                    </>
                  )}
                  {copyFeedback && (
                    <span className="text-green-400 text-sm py-1">{copyFeedback}</span>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[480px]">
                <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {outputCode || (inputCode ? 'Click "Format Code" to see the result' : 'Enter code to format')}
                </pre>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Supported Languages</h4>
                <ul className="space-y-1">
                  <li>• JavaScript - Format JS code with proper indentation</li>
                  <li>• HTML - Clean up HTML structure and formatting</li>
                  <li>• CSS - Organize CSS rules and properties</li>
                  <li>• JSON - Validate and format JSON data</li>
                  <li>• XML - Structure XML with proper indentation</li>
                  <li>• SQL - Format SQL queries with keywords</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>• Customizable indentation (spaces or tabs)</li>
                  <li>• Syntax validation for JSON</li>
                  <li>• Before/after comparison</li>
                  <li>• Copy formatted code to clipboard</li>
                  <li>• Download formatted code as file</li>
                  <li>• Example code for each language</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
