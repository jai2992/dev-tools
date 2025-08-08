'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import CodeBlock from '../../components/common/CodeBlock';
import TextResultDisplay from '../../components/common/TextResultDisplay';

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
      setError('');
      return;
    }

    setIsFormatting(true);
    setError('');

    try {
      const indent = indentType === 'tab' ? '	' : ' '.repeat(indentSize);
      let formatted: string;

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

  const formatJavaScript = useCallback((code: string, indent: string): string => {
    // Basic JavaScript formatting
    const formatted = code
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*(?=\w)/g, ';\n')
      .replace(/}\s*(?=\w)/g, '}\n')
      .replace(/,\s*(?=\w)/g, ',\n');

    return addIndentation(formatted, indent);
  }, []);

  const formatHTML = useCallback((code: string, indent: string): string => {
    const formatted = code
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '');

    return addIndentation(formatted, indent);
  }, []);

  const formatCSS = useCallback((code: string, indent: string): string => {
    const formatted = code
      .replace(/{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/}\s*/g, '\n}\n')
      .replace(/,\s*(?=[\w.])/g, ',\n');

    return addIndentation(formatted, indent);
  }, []);

  const formatJSON = useCallback((code: string, indent: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, indent);
    } catch {
      throw new Error('Invalid JSON syntax');
    }
  }, []);

  const formatXML = useCallback((code: string, indent: string): string => {
    const formatted = code
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '');

    return addIndentation(formatted, indent);
  }, []);

  const formatSQL = (code: string, _indent: string): string => {
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
    } catch (_err) {
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
    <>
      <Head>
        <title>Code Formatter | Free Online Multi-Language Code Beautifier | devtools.software</title>
        <meta name="description" content="Format and beautify HTML, CSS, JavaScript, JSON, XML, and SQL code online. Free code formatter with customizable indentation and syntax validation." />
        <meta property="og:title" content="Code Formatter - Multi-Language Code Beautifier" />
        <meta property="og:description" content="Format and beautify code for various programming languages with customizable options" />
        <meta property="og:url" content="https://devtools.software/code-formatter" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageLayout 
        title="Code Formatter" 
        description="Format and beautify code for multiple programming languages"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <Card variant="default" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                options={languages.map(lang => ({ value: lang.id, label: lang.name }))}
              />

              <Select
                label="Indentation"
                value={indentType}
                onChange={(e) => setIndentType(e.target.value)}
                options={[
                  { value: 'spaces', label: 'Spaces' },
                  { value: 'tabs', label: 'Tabs' }
                ]}
              />

              {indentType === 'spaces' && (
                <Select
                  label="Indent Size"
                  value={indentSize.toString()}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  options={[
                    { value: '2', label: '2 spaces' },
                    { value: '4', label: '4 spaces' },
                    { value: '8', label: '8 spaces' }
                  ]}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                variant="primary"
                size="md"
                onClick={formatCode}
                disabled={isFormatting || !inputCode.trim()}
                loading={isFormatting}
              >
                {isFormatting ? 'Formatting...' : 'Format Code'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={loadExample}
              >
                Load Example
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          </Card>

          {/* Input/Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card variant="default" padding="lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Input Code</h3>
                <span className="text-sm text-[var(--color-text-secondary)]">{inputCode.length} characters</span>
              </div>
              <Textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={languages.find(l => l.id === selectedLanguage)?.placeholder}
                rows={20}
                className="font-mono text-sm"
              />
            </Card>

            {/* Output */}
            <Card variant="default" padding="lg">
              {error && (
                <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg p-4 mb-4">
                  <p className="text-[var(--color-error)]">{error}</p>
                </div>
              )}

              {outputCode ? (
                <TextResultDisplay
                  title="Formatted Code"
                  result={outputCode}
                  type={selectedLanguage as any}
                  downloadable={true}
                  filename={`formatted-code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`}
                  maxHeight="500px"
                  showLineNumbers={true}
                  wrap={false}
                />
              ) : (
                <div className="text-center py-12 text-[var(--color-text-secondary)]">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)]">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <p>{inputCode ? 'Click "Format Code" to see the result' : 'Enter code to format'}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[var(--color-text-primary)] mb-3">Supported Languages</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• JavaScript - Format JS code with proper indentation</li>
                  <li>• HTML - Clean up HTML structure and formatting</li>
                  <li>• CSS - Organize CSS rules and properties</li>
                  <li>• JSON - Validate and format JSON data</li>
                  <li>• XML - Structure XML with proper indentation</li>
                  <li>• SQL - Format SQL queries with keywords</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[var(--color-text-primary)] mb-3">Features</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• Customizable indentation (spaces or tabs)</li>
                  <li>• Syntax validation for JSON</li>
                  <li>• Before/after comparison</li>
                  <li>• Copy formatted code to clipboard</li>
                  <li>• Download formatted code as file</li>
                  <li>• Example code for each language</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </PageLayout>
    </>)
  );
}
