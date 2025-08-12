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

  const debounce = useCallback(<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
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
    [debounce, testRegex]
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
    } catch (_err) {
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Regex Tester & Builder | Free Online Tool | devtools.software</title>
        <meta name="description" content="Test regular expressions online with live highlighting, match groups, and explanations. Free regex tester with common patterns library." />
        <meta property="og:title" content="Regex Tester & Builder" />
        <meta property="og:description" content="Test and build regular expressions with live highlighting and pattern explanations" />
        <meta property="og:url" content="https://devtools.software/regex-tester" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gray-800 py-12 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Regex Tester & Builder
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              Test regular expressions with live highlighting and explanations
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Live Testing
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Match Highlighting
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Pattern Library
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Quick Start Guide */}
          {!pattern && !testString && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Get Started in 3 Easy Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="text-3xl mb-2">1</div>
                  <h3 className="font-semibold text-white mb-2">Choose a Pattern</h3>
                  <p className="text-sm text-gray-300">Pick from common patterns below or write your own regex</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="text-3xl mb-2">2</div>
                  <h3 className="font-semibold text-white mb-2">Add Test Text</h3>
                  <p className="text-sm text-gray-300">Enter text to test your pattern against</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="text-3xl mb-2">3</div>
                  <h3 className="font-semibold text-white mb-2">See Results</h3>
                  <p className="text-sm text-gray-300">View matches, groups, and explanations instantly</p>
                </div>
              </div>
            </div>
          )}

          {/* Common Patterns */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Common Patterns
                <span className="text-sm font-normal text-gray-400 ml-2">(Click to load)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {commonPatterns.map((commonPattern, index) => (
                <button
                  key={index}
                  onClick={() => loadCommonPattern(commonPattern)}
                  className="bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg p-4 text-left transition-all duration-200"
                  title={commonPattern.description}
                >
                  <div className="font-semibold text-white mb-1">
                    {commonPattern.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {commonPattern.description}
                  </div>
                  <div className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                    {commonPattern.example}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Pattern Input */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor="pattern" className="text-lg font-semibold text-white">
                    Step 1: Enter Your Regex Pattern
                  </label>
                  {isValid && pattern && (
                    <span className="text-green-400 text-sm">✓ Valid</span>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-gray-400 text-2xl font-mono">/</span>
                  <input
                    id="pattern"
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g., \d{3}-\d{3}-\d{4} for phone numbers"
                    className={`flex-1 bg-gray-800 border-2 rounded-lg px-4 py-4 text-white text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isValid ? 'border-gray-600 hover:border-gray-500' : 'border-red-500'
                      }`}
                  />
                  <span className="text-gray-400 text-2xl font-mono">/</span>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="gim"
                    className="w-20 bg-gray-800 border-2 border-gray-600 hover:border-gray-500 rounded-lg px-3 py-4 text-white text-center font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-400">
                  <span className="bg-gray-800 px-2 py-1 rounded">g = global</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">i = ignore case</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">m = multiline</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">s = dotall</span>
                </div>
                {error && (
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mt-3">
                    <p className="text-red-300 text-sm flex items-center gap-2">
                      <span>❌</span>
                      {error}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => copyToClipboard(pattern, 'Pattern')}
                  disabled={!pattern}
                  className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Copy Pattern
                </button>
                <button
                  onClick={clearAll}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
                {copyFeedback && (
                  <span className="text-green-400 text-sm py-2">
                    {copyFeedback}
                  </span>
                )}
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test String */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor="testString" className="text-lg font-semibold text-white">
                    Step 2: Add Your Test Text
                  </label>
                </div>
                <textarea
                  id="testString"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Paste or type text here to test your regex pattern against..."
                  rows={10}
                  className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 rounded-lg px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all"
                />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    Characters: <span className="text-white font-mono">{testString.length}</span>
                  </span>
                  {testString && (
                    <span className="text-green-400">✓ Ready to test</span>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Step 3: View Results
                  {matches.length > 0 && (
                    <span className="ml-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {matches.length} match{matches.length !== 1 ? 'es' : ''}
                    </span>
                  )}
                </h3>
              </div>

              {pattern && testString && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      Highlighted Matches
                    </h4>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 min-h-[140px] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {highlightMatches(testString, matches)}
                    </div>
                  </div>

                  {matches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">
                        Match Details
                      </h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {matches.map((match, index) => (
                          <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-mono font-semibold">
                                Match #{index + 1}: "{match.match}"
                              </span>
                              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                Index: {match.index}
                              </span>
                            </div>
                            {match.groups && match.groups.length > 0 && (
                              <div className="text-gray-300 text-xs">
                                <span className="text-gray-400">Groups:</span> {match.groups.map((group, i) => `$${i + 1}: "${group}"`).join(', ')}
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
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No matches found</div>
                  <div className="text-gray-500 text-sm mt-2">Try adjusting your pattern or test text</div>
                </div>
              )}

              {!pattern && !testString && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">Ready to start testing</div>
                  <div className="text-gray-500 text-sm mt-2">Enter a regex pattern and test text above</div>
                </div>
              )}

              {!pattern && testString && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">Add a regex pattern to begin</div>
                  <div className="text-gray-500 text-sm mt-2">Choose from common patterns or write your own</div>
                </div>
              )}

              {pattern && !testString && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">Add test text to see matches</div>
                  <div className="text-gray-500 text-sm mt-2">Enter some text to test your pattern against</div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-white">Pattern Explanation</h3>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{explanation}</pre>
              </div>
            </div>
          )}

          {/* Usage Instructions - Only show when no pattern is entered */}
          {!pattern && !testString && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-white">Quick Reference</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">
                    Common Symbols
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><code className="bg-gray-800 px-1 rounded">.</code> - Any character</div>
                    <div><code className="bg-gray-800 px-1 rounded">*</code> - Zero or more</div>
                    <div><code className="bg-gray-800 px-1 rounded">+</code> - One or more</div>
                    <div><code className="bg-gray-800 px-1 rounded">?</code> - Zero or one</div>
                    <div><code className="bg-gray-800 px-1 rounded">^</code> - Start of string</div>
                    <div><code className="bg-gray-800 px-1 rounded">$</code> - End of string</div>
                  </div>
                </div>
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">
                    Character Classes
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><code className="bg-gray-800 px-1 rounded">\d</code> - Any digit</div>
                    <div><code className="bg-gray-800 px-1 rounded">\w</code> - Word character</div>
                    <div><code className="bg-gray-800 px-1 rounded">\s</code> - Whitespace</div>
                    <div><code className="bg-gray-800 px-1 rounded">[a-z]</code> - Lowercase letters</div>
                    <div><code className="bg-gray-800 px-1 rounded">[0-9]</code> - Numbers</div>
                    <div><code className="bg-gray-800 px-1 rounded">[^x]</code> - Not x</div>
                  </div>
                </div>
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">
                    Quantifiers
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><code className="bg-gray-800 px-1 rounded">{`{3}`}</code> - Exactly 3</div>
                    <div><code className="bg-gray-800 px-1 rounded">{`{3,}`}</code> - 3 or more</div>
                    <div><code className="bg-gray-800 px-1 rounded">{`{3,5}`}</code> - Between 3-5</div>
                    <div><code className="bg-gray-800 px-1 rounded">()</code> - Capture group</div>
                    <div><code className="bg-gray-800 px-1 rounded">|</code> - OR operator</div>
                    <div><code className="bg-gray-800 px-1 rounded">(?:)</code> - Non-capture group</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
