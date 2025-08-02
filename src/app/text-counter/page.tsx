"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  pages: number;
  readingTime: number;
  speakingTime: number;
  mostCommonWord: string;
  mostCommonWordCount: number;
  averageWordsPerSentence: number;
  averageCharsPerWord: number;
}

export default function TextCounterPage() {
  const [inputText, setInputText] = useState("");
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    pages: 0,
    readingTime: 0,
    speakingTime: 0,
    mostCommonWord: "",
    mostCommonWordCount: 0,
    averageWordsPerSentence: 0,
    averageCharsPerWord: 0,
  });
  const [characterFrequency, setCharacterFrequency] = useState<
    Map<string, number>
  >(new Map());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateStats = (text: string): TextStats => {
    if (!text) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        pages: 0,
        readingTime: 0,
        speakingTime: 0,
        mostCommonWord: "",
        mostCommonWordCount: 0,
        averageWordsPerSentence: 0,
        averageCharsPerWord: 0,
      };
    }

    // Basic counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text.split("\n").length;

    // Words (split by whitespace and filter empty strings)
    const wordsArray = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const words = wordsArray.length;

    // Sentences (split by sentence endings)
    const sentencesArray = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    const sentences = sentencesArray.length;

    // Paragraphs (split by double line breaks)
    const paragraphsArray = text
      .split(/\n\s*\n/)
      .filter((para) => para.trim().length > 0);
    const paragraphs = Math.max(paragraphsArray.length, text.trim() ? 1 : 0);

    // Pages (assuming 250-300 words per page)
    const pages = Math.ceil(words / 275);

    // Reading time (average 200-250 words per minute)
    const readingTime = Math.ceil(words / 225);

    // Speaking time (average 150-160 words per minute)
    const speakingTime = Math.ceil(words / 155);

    // Most common word
    const wordFreq = new Map<string, number>();
    wordsArray.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (cleanWord.length > 2) {
        // Ignore short words
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
      }
    });

    let mostCommonWord = "";
    let mostCommonWordCount = 0;
    wordFreq.forEach((count, word) => {
      if (count > mostCommonWordCount) {
        mostCommonWord = word;
        mostCommonWordCount = count;
      }
    });

    // Averages
    const averageWordsPerSentence =
      sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    const averageCharsPerWord =
      words > 0 ? Math.round((charactersNoSpaces / words) * 10) / 10 : 0;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      pages,
      readingTime,
      speakingTime,
      mostCommonWord,
      mostCommonWordCount,
      averageWordsPerSentence,
      averageCharsPerWord,
    };
  };

  const calculateCharacterFrequency = (text: string) => {
    const frequency = new Map<string, number>();

    for (const char of text.toLowerCase()) {
      if (char.match(/[a-z]/)) {
        frequency.set(char, (frequency.get(char) || 0) + 1);
      }
    }

    setCharacterFrequency(frequency);
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    setStats(calculateStats(value));
    calculateCharacterFrequency(value);
  };

  const exportStats = () => {
    const exportData = {
      text: inputText,
      statistics: stats,
      timestamp: new Date().toISOString(),
      characterFrequency: Object.fromEntries(characterFrequency),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearText = () => {
    setInputText("");
    setStats(calculateStats(""));
    setCharacterFrequency(new Map());
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 minute";
    if (minutes === 1) return "1 minute";
    if (minutes < 60) return `${minutes} minutes`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 1 && remainingMinutes === 0) return "1 hour";
    if (remainingMinutes === 0) return `${hours} hours`;
    if (hours === 1) return `1 hour ${remainingMinutes} minutes`;

    return `${hours} hours ${remainingMinutes} minutes`;
  };

  const topCharacters = Array.from(characterFrequency.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const examples = [
    {
      title: "Short Article",
      text: `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.

It's commonly used in typography and printing to test fonts and layouts. The phrase dates back to the early 20th century.

Modern variations exist, but this remains the most popular version for testing purposes.`,
    },
    {
      title: "Technical Documentation",
      text: `# API Documentation

## Authentication
All API requests require authentication using Bearer tokens.

### Request Headers
- Authorization: Bearer {token}
- Content-Type: application/json

### Response Format
All responses are returned in JSON format with the following structure:
- success: boolean
- data: object
- error: string (optional)`,
    },
    {
      title: "Lorem Ipsum Sample",
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.`,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="📊 Text Counter"
        description="Analyze text with detailed statistics including word count, reading time, and character frequency"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <Textarea
                  label="Enter or paste your text"
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Start typing or paste your text here to see real-time statistics..."
                  rows={12}
                  className="w-full"
                  characterCount
                  maxLength={50000}
                />

                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    onClick={clearText}
                    disabled={!inputText.trim()}
                  >
                    Clear Text
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={exportStats}
                    disabled={!inputText.trim()}
                  >
                    Export Analysis
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Hide" : "Show"} Advanced
                  </Button>
                </div>
              </div>

              {/* Basic Statistics */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Statistics</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.characters.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Characters</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {stats.words.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Words</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {stats.sentences.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Sentences</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {stats.paragraphs.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Paragraphs</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Reading Time
                    </div>
                    <div className="text-blue-400">
                      {formatTime(stats.readingTime)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      @ 225 words/minute
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Speaking Time
                    </div>
                    <div className="text-green-400">
                      {formatTime(stats.speakingTime)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      @ 155 words/minute
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Statistics */}
            {showAdvanced && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Advanced Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Characters (no spaces)
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      {stats.charactersNoSpaces.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Lines
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {stats.lines.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Pages
                    </div>
                    <div className="text-2xl font-bold text-pink-400">
                      {stats.pages.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      @ 275 words/page
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Avg. Word Length
                    </div>
                    <div className="text-2xl font-bold text-indigo-400">
                      {stats.averageCharsPerWord}
                    </div>
                    <div className="text-gray-400 text-xs">characters</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {stats.mostCommonWord && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-lg font-semibold text-white mb-2">
                        Most Common Word
                      </div>
                      <div className="text-xl font-bold text-green-400">
                        &quot;{stats.mostCommonWord}&quot;
                      </div>
                      <div className="text-gray-400 text-sm">
                        appears {stats.mostCommonWordCount} times
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-lg font-semibold text-white mb-2">
                      Avg. Words per Sentence
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {stats.averageWordsPerSentence}
                    </div>
                  </div>
                </div>

                {/* Character Frequency */}
                {topCharacters.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Character Frequency (Top 5)
                    </h4>
                    <div className="grid grid-cols-5 gap-4">
                      {topCharacters.map(([char, count]) => (
                        <div
                          key={char}
                          className="bg-gray-800 rounded-lg p-3 text-center"
                        >
                          <div className="text-xl font-bold text-blue-400">
                            {char.toUpperCase()}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {count} times
                          </div>
                          <div className="text-gray-500 text-xs">
                            {((count / stats.charactersNoSpaces) * 100).toFixed(
                              1
                            )}
                            %
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Examples Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Example Texts
            </h3>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-blue-400">
                      {example.title}
                    </h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInputChange(example.text)}
                    >
                      Load Example
                    </Button>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-gray-300 text-sm max-h-32 overflow-y-auto">
                    {example.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              About Text Analysis
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Reading Speed Guidelines
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      • <strong>Slow readers:</strong> 125-200 words/minute
                    </div>
                    <div>
                      • <strong>Average readers:</strong> 200-250 words/minute
                    </div>
                    <div>
                      • <strong>Fast readers:</strong> 250-350 words/minute
                    </div>
                    <div>
                      • <strong>Speed readers:</strong> 350+ words/minute
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Writing Guidelines
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>
                      • <strong>Sentences:</strong> 15-20 words for readability
                    </div>
                    <div>
                      • <strong>Paragraphs:</strong> 3-5 sentences typically
                    </div>
                    <div>
                      • <strong>Pages:</strong> ~275 words per page
                      (double-spaced)
                    </div>
                    <div>
                      • <strong>Speaking:</strong> 150-160 words/minute average
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mt-6">
                <h4 className="text-green-300 font-semibold mb-2">
                  Use Cases:
                </h4>
                <p className="text-green-200 text-sm">
                  Perfect for writers, content creators, students, and
                  professionals who need to analyze text length, estimate
                  reading time, check word counts for assignments, or optimize
                  content for specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
