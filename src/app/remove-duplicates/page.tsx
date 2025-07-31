"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

interface ProcessingOptions {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  preserveOrder: boolean;
  ignoreEmptyLines: boolean;
}

interface ProcessingStats {
  originalLines: number;
  duplicatesRemoved: number;
  emptyLinesRemoved: number;
  finalLines: number;
}

export default function RemoveDuplicatesPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [options, setOptions] = useState<ProcessingOptions>({
    caseSensitive: true,
    trimWhitespace: true,
    preserveOrder: true,
    ignoreEmptyLines: true,
  });
  const [stats, setStats] = useState<ProcessingStats>({
    originalLines: 0,
    duplicatesRemoved: 0,
    emptyLinesRemoved: 0,
    finalLines: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const removeDuplicates = (
    text: string,
    opts: ProcessingOptions
  ): { result: string; stats: ProcessingStats } => {
    if (!text.trim()) {
      return {
        result: "",
        stats: {
          originalLines: 0,
          duplicatesRemoved: 0,
          emptyLinesRemoved: 0,
          finalLines: 0,
        },
      };
    }

    let lines = text.split("\n");
    const originalCount = lines.length;
    let emptyLinesRemoved = 0;

    // Trim whitespace if option is enabled
    if (opts.trimWhitespace) {
      lines = lines.map((line) => line.trim());
    }

    // Remove empty lines if option is enabled
    if (opts.ignoreEmptyLines) {
      const beforeEmpty = lines.length;
      lines = lines.filter((line) => line.length > 0);
      emptyLinesRemoved = beforeEmpty - lines.length;
    }

    // Remove duplicates
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    let duplicatesCount = 0;

    for (const line of lines) {
      const compareValue = opts.caseSensitive ? line : line.toLowerCase();

      if (!seen.has(compareValue)) {
        seen.add(compareValue);
        uniqueLines.push(line);
      } else {
        duplicatesCount++;
      }
    }

    // Sort if preserve order is disabled
    if (!opts.preserveOrder) {
      uniqueLines.sort((a, b) => {
        const aCompare = opts.caseSensitive ? a : a.toLowerCase();
        const bCompare = opts.caseSensitive ? b : b.toLowerCase();
        return aCompare.localeCompare(bCompare);
      });
    }

    return {
      result: uniqueLines.join("\n"),
      stats: {
        originalLines: originalCount,
        duplicatesRemoved: duplicatesCount,
        emptyLinesRemoved,
        finalLines: uniqueLines.length,
      },
    };
  };

  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const { result, stats: newStats } = removeDuplicates(inputText, options);
      setOutputText(result);
      setStats(newStats);
      setIsProcessing(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [inputText, options]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert("Cleaned text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOptionChange = (option: keyof ProcessingOptions) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const exampleText = `apple
banana
Apple
cherry
banana
date
APPLE
elderberry
cherry

fig
grape
banana
grape
honeydew

date
apple
kiwi`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Duplicate Line Remover"
          description="Remove duplicate lines from text with customizable options"
        />

        {/* Options Panel */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Processing Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.caseSensitive}
                onChange={() => handleOptionChange("caseSensitive")}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-700">Case sensitive</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.trimWhitespace}
                onChange={() => handleOptionChange("trimWhitespace")}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-700">Trim whitespace</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.preserveOrder}
                onChange={() => handleOptionChange("preserveOrder")}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-700">Preserve order</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.ignoreEmptyLines}
                onChange={() => handleOptionChange("ignoreEmptyLines")}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-700">Remove empty lines</span>
            </label>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Input Text
              </h2>
              <Button
                onClick={() => setInputText(exampleText)}
                variant="secondary"
                size="sm"
              >
                Load Example
              </Button>
            </div>

            <Textarea
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInputText(e.target.value)
              }
              placeholder="Enter text with duplicate lines here..."
              rows={20}
              className="font-mono text-sm"
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Cleaned Text
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  size="sm"
                  disabled={!outputText || isProcessing}
                >
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  disabled={!outputText || isProcessing}
                >
                  Download
                </Button>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">Processing...</span>
              </div>
            ) : (
              <Textarea
                value={outputText}
                readOnly
                placeholder="Cleaned text will appear here..."
                rows={20}
                className="font-mono text-sm bg-gray-50"
              />
            )}
          </Card>
        </div>

        {/* Statistics */}
        {inputText && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Processing Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.originalLines}
                </div>
                <div className="text-sm text-gray-600 mt-1">Original Lines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {stats.duplicatesRemoved}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Duplicates Removed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {stats.emptyLinesRemoved}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Empty Lines Removed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.finalLines}
                </div>
                <div className="text-sm text-gray-600 mt-1">Final Lines</div>
              </div>
            </div>

            {stats.originalLines > 0 && (
              <div className="mt-6 text-center">
                <div className="text-lg text-gray-700">
                  Reduction:{" "}
                  <span className="font-semibold text-blue-600">
                    {(
                      ((stats.duplicatesRemoved + stats.emptyLinesRemoved) /
                        stats.originalLines) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Detection
            </h3>
            <p className="text-gray-600 text-sm">
              Intelligently identifies and removes duplicate lines
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Flexible Options
            </h3>
            <p className="text-gray-600 text-sm">
              Case sensitivity, whitespace, and order preferences
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Statistics
            </h3>
            <p className="text-gray-600 text-sm">
              Detailed metrics on duplicates and reductions
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export Ready
            </h3>
            <p className="text-gray-600 text-sm">
              Copy to clipboard or download cleaned text
            </p>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mt-12 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Processing Options Explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Case Sensitivity
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm">
                  <div className="mb-2 font-medium text-gray-700">
                    Case Sensitive (ON):
                  </div>
                  <div className="font-mono text-xs mb-3">
                    apple
                    <br />
                    Apple
                    <br />
                    APPLE
                  </div>
                  <div className="text-gray-600">
                    → All three lines are kept (different cases)
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <div className="text-sm">
                  <div className="mb-2 font-medium text-gray-700">
                    Case Sensitive (OFF):
                  </div>
                  <div className="font-mono text-xs mb-3">apple</div>
                  <div className="text-gray-600">
                    → Only first occurrence kept
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Preservation
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm">
                  <div className="mb-2 font-medium text-gray-700">
                    Preserve Order (ON):
                  </div>
                  <div className="font-mono text-xs mb-3">
                    zebra
                    <br />
                    apple
                    <br />
                    banana
                  </div>
                  <div className="text-gray-600">
                    → Original order maintained
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <div className="text-sm">
                  <div className="mb-2 font-medium text-gray-700">
                    Preserve Order (OFF):
                  </div>
                  <div className="font-mono text-xs mb-3">
                    apple
                    <br />
                    banana
                    <br />
                    zebra
                  </div>
                  <div className="text-gray-600">→ Alphabetically sorted</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Information Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            About Duplicate Line Removal
          </h2>
          <p className="text-blue-800 mb-4">
            Duplicate line removal is essential for data cleaning, list
            management, and text processing. This tool helps you clean up
            datasets, remove redundant entries, and organize text content
            efficiently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Common Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Email list cleaning</li>
                <li>• Data deduplication</li>
                <li>• Log file processing</li>
                <li>• List management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Multiple processing options</li>
                <li>• Real-time statistics</li>
                <li>• Whitespace handling</li>
                <li>• Order preservation</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
