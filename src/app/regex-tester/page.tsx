'use client';

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

interface CommonPattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const commonPatterns: CommonPattern[] = [
  {
    name: 'Email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Validates email addresses',
    example: 'user@example.com'
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    description: 'Matches HTTP/HTTPS URLs',
    example: 'https://www.example.com'
  },
  {
    name: 'Phone Number (US)',
    pattern: '^\\+?1?[-.\\s]?\\(?[0-9]{3}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}$',
    description: 'US phone number format',
    example: '(555) 123-4567'
  },
  {
    name: 'Date (MM/DD/YYYY)',
    pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d\\d$',
    description: 'Date in MM/DD/YYYY format',
    example: '12/31/2023'
  },
  {
    name: 'IPv4 Address',
    pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'IPv4 address validation',
    example: '192.168.1.1'
  },
  {
    name: 'Credit Card',
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
    description: 'Credit card number validation',
    example: '4111111111111111'
  },
  {
    name: 'Password (Strong)',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description: 'Strong password with 8+ chars, uppercase, lowercase, number, special char',
    example: 'MyP@ssw0rd'
  },
  {
    name: 'Hex Color',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    description: 'Hex color code validation',
    example: '#FF5733'
  }
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const testRegex = useCallback((regexPattern: string, flagsStr: string, text: string) => {
    if (!regexPattern) {
      setMatches([]);
      setError('');
      setIsValid(true);
      setExplanation('');
      return;
    }

    try {
      const regex = new RegExp(regexPattern, flagsStr);
      setIsValid(true);
      setError('');

      const foundMatches: RegexMatch[] = [];
      let match;

      if (flagsStr.includes('g')) {
        // Global search
        while ((match = regex.exec(text)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Single match
        match = regex.exec(text);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);
      generateExplanation(regexPattern);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setMatches([]);
      setExplanation('');
    }
  }, []);

  const debouncedTestRegex = useCallback(
    debounce(testRegex, 300),
    [testRegex]
  );

  useEffect(() => {
    debouncedTestRegex(pattern, flags, testString);
  }, [pattern, flags, testString, debouncedTestRegex]);

  const generateExplanation = (regexPattern: string) => {
    if (!regexPattern) {
      setExplanation('');
      return;
    }

    const explanations: string[] = [];
    
    // Basic explanations for common patterns
    if (regexPattern.includes('^')) explanations.push('^ - Start of string');
    if (regexPattern.includes('$')) explanations.push('$ - End of string');
    if (regexPattern.includes('\\d')) explanations.push('\\d - Any digit (0-9)');
    if (regexPattern.includes('\\w')) explanations.push('\\w - Any word character (a-z, A-Z, 0-9, _)');
    if (regexPattern.includes('\\s')) explanations.push('\\s - Any whitespace character');
    if (regexPattern.includes('.')) explanations.push('. - Any character except newline');
    if (regexPattern.includes('*')) explanations.push('* - Zero or more occurrences');
    if (regexPattern.includes('+')) explanations.push('+ - One or more occurrences');
    if (regexPattern.includes('?')) explanations.push('? - Zero or one occurrence');
    if (regexPattern.includes('|')) explanations.push('| - OR operator');
    if (regexPattern.includes('[')) explanations.push('[] - Character set');
    if (regexPattern.includes('(')) explanations.push('() - Capturing group');
    
    setExplanation(explanations.join('\n'));
  };

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (!matches.length) return text;

    const parts = [];
    let lastIndex = 0;

    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add highlighted match
      parts.push(
        <span 
          key={i} 
          className="bg-yellow-400 text-black px-1 rounded"
          title={`Match ${i + 1}: "${match.match}"`}
        >
          {match.match}
        </span>
      );
      
      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const loadCommonPattern = (commonPattern: CommonPattern) => {
    setPattern(commonPattern.pattern);
    setTestString(commonPattern.example);
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setFlags('g');
    setMatches([]);
    setError('');
    setExplanation('');
    setIsValid(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Regex Tester & Builder | Free Online Tool | devtools.software</title>
        <meta name="description" content="Test regular expressions online with live highlighting, match groups, and explanations. Free regex tester with common patterns library." />
        <meta property="og:title" content="Regex Tester & Builder" />
        <meta property="og:description" content="Test and build regular expressions with live highlighting and pattern explanations" />
        <meta property="og:url" content="https://devtools.software/regex-tester" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">Regex Tester & Builder</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Test regular expressions with live highlighting and explanations</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Pattern Input */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            <div className="space-y-4">
              <div>
                <label htmlFor="pattern" className="block text-sm font-medium text-gray-300 mb-2">
                  Regular Expression Pattern
                </label>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-lg">/</span>
                  <input
                    id="pattern"
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter your regex pattern..."
                    className={`flex-1 bg-gray-800 border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isValid ? 'border-gray-700' : 'border-red-500'
                    }`}
                  />
                  <span className="text-gray-400 text-lg">/</span>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="gim"
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-3 text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Flags: g (global), i (ignore case), m (multiline), s (dotall), u (unicode), y (sticky)
                </p>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard(pattern, 'Pattern')}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  📋 Copy Pattern
                </button>
                <button
                  onClick={clearAll}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  🗑️ Clear All
                </button>
                {copyFeedback && (
                  <span className="text-green-400 text-sm py-1">{copyFeedback}</span>
                )}
              </div>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Common Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {commonPatterns.map((commonPattern, index) => (
                <button
                  key={index}
                  onClick={() => loadCommonPattern(commonPattern)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-left transition-colors"
                  title={commonPattern.description}
                >
                  <div className="font-medium text-blue-400 text-sm">{commonPattern.name}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate">{commonPattern.example}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test String */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <div className="space-y-4">
                <div>
                  <label htmlFor="testString" className="block text-sm font-medium text-gray-300 mb-2">
                    Test String
                  </label>
                  <textarea
                    id="testString"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter text to test against your regex..."
                    rows={8}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>
                
                <div className="text-sm text-gray-400">
                  Characters: {testString.length}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Results {matches.length > 0 && <span className="text-green-400">({matches.length} matches)</span>}
              </h3>
              
              {pattern && testString && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Highlighted Matches</h4>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[120px] whitespace-pre-wrap font-mono text-sm">
                      {highlightMatches(testString, matches)}
                    </div>
                  </div>

                  {matches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Match Details</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {matches.map((match, index) => (
                          <div key={index} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm">
                            <div className="text-yellow-400 font-mono">"{match.match}"</div>
                            <div className="text-gray-400">Index: {match.index}</div>
                            {match.groups && match.groups.length > 0 && (
                              <div className="text-blue-400">
                                Groups: {match.groups.map((group, i) => `$${i + 1}: "${group}"`).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {pattern && testString && matches.length === 0 && isValid && (
                <div className="text-gray-400 text-center py-8">
                  No matches found
                </div>
              )}

              {!pattern && (
                <div className="text-gray-500 text-center py-8">
                  Enter a regex pattern to start testing
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Pattern Explanation</h3>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{explanation}</pre>
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Basic Usage</h4>
                <ul className="space-y-1">
                  <li>• Enter your regex pattern in the first field</li>
                  <li>• Add flags (g, i, m, etc.) as needed</li>
                  <li>• Enter test text to match against</li>
                  <li>• See live results and explanations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Quick Start</h4>
                <ul className="space-y-1">
                  <li>• Click any common pattern to load it</li>
                  <li>• Modify the pattern to fit your needs</li>
                  <li>• Test with your own sample data</li>
                  <li>• Copy the final pattern for use</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
