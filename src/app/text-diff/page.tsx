"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [diffStats, setDiffStats] = useState({
    added: 0,
    removed: 0,
    unchanged: 0,
  });
  const [diffMode, setDiffMode] = useState<"line" | "word">("line");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple line-based diff algorithm
  const computeLineDiff = (str1: string, str2: string): DiffLine[] => {
    const lines1 = str1.split("\n");
    const lines2 = str2.split("\n");
    const result: DiffLine[] = [];

    let i = 0,
      j = 0;
    let lineNum1 = 1,
      lineNum2 = 1;

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Remaining lines in text2 are additions
        result.push({
          type: "added",
          content: lines2[j],
          lineNumber2: lineNum2++,
        });
        j++;
      } else if (j >= lines2.length) {
        // Remaining lines in text1 are deletions
        result.push({
          type: "removed",
          content: lines1[i],
          lineNumber1: lineNum1++,
        });
        i++;
      } else if (lines1[i] === lines2[j]) {
        // Lines are the same
        result.push({
          type: "unchanged",
          content: lines1[i],
          lineNumber1: lineNum1++,
          lineNumber2: lineNum2++,
        });
        i++;
        j++;
      } else {
        // Look ahead to find matching lines
        let found = false;

        // Check if line from text1 appears later in text2
        for (let k = j + 1; k < Math.min(j + 10, lines2.length); k++) {
          if (lines1[i] === lines2[k]) {
            // Add the intervening lines from text2 as additions
            for (let l = j; l < k; l++) {
              result.push({
                type: "added",
                content: lines2[l],
                lineNumber2: lineNum2++,
              });
            }
            j = k;
            found = true;
            break;
          }
        }

        if (!found) {
          // Check if line from text2 appears later in text1
          for (let k = i + 1; k < Math.min(i + 10, lines1.length); k++) {
            if (lines2[j] === lines1[k]) {
              // Add the intervening lines from text1 as deletions
              for (let l = i; l < k; l++) {
                result.push({
                  type: "removed",
                  content: lines1[l],
                  lineNumber1: lineNum1++,
                });
              }
              i = k;
              found = true;
              break;
            }
          }
        }

        if (!found) {
          // No match found nearby, treat as deletion and addition
          result.push({
            type: "removed",
            content: lines1[i],
            lineNumber1: lineNum1++,
          });
          result.push({
            type: "added",
            content: lines2[j],
            lineNumber2: lineNum2++,
          });
          i++;
          j++;
        }
      }
    }

    return result;
  };

  // Simple word-based diff
  const computeWordDiff = (str1: string, str2: string): DiffLine[] => {
    const words1 = str1.split(/(\s+)/);
    const words2 = str2.split(/(\s+)/);
    const result: DiffLine[] = [];

    let i = 0,
      j = 0;

    while (i < words1.length || j < words2.length) {
      if (i >= words1.length) {
        result.push({
          type: "added",
          content: words2[j],
        });
        j++;
      } else if (j >= words2.length) {
        result.push({
          type: "removed",
          content: words1[i],
        });
        i++;
      } else if (words1[i] === words2[j]) {
        result.push({
          type: "unchanged",
          content: words1[i],
        });
        i++;
        j++;
      } else {
        // Simple approach: mark as removed and added
        result.push({
          type: "removed",
          content: words1[i],
        });
        result.push({
          type: "added",
          content: words2[j],
        });
        i++;
        j++;
      }
    }

    return result;
  };

  useEffect(() => {
    if (!text1 && !text2) {
      setDiffResult([]);
      setDiffStats({ added: 0, removed: 0, unchanged: 0 });
      return;
    }

    setIsProcessing(true);
    const timer = setTimeout(() => {
      const diff =
        diffMode === "line"
          ? computeLineDiff(text1, text2)
          : computeWordDiff(text1, text2);

      setDiffResult(diff);

      const stats = diff.reduce(
        (acc, line) => {
          acc[line.type]++;
          return acc;
        },
        { added: 0, removed: 0, unchanged: 0 }
      );

      setDiffStats(stats);
      setIsProcessing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [text1, text2, diffMode]);

  const handleCopyDiff = async () => {
    const diffText = diffResult
      .map((line) => {
        const prefix =
          line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
        return prefix + line.content;
      })
      .join("\n");

    try {
      await navigator.clipboard.writeText(diffText);
      alert("Diff copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportDiff = () => {
    const diffText = diffResult
      .map((line) => {
        const prefix =
          line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
        return prefix + line.content;
      })
      .join("\n");

    const blob = new Blob([diffText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-diff.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exampleText1 = `This is the original text.
It has multiple lines.
Some content will be changed.
This line will be removed.
Another line of text.
The end of the document.`;

  const exampleText2 = `This is the modified text.
It has multiple lines.
Some content has been updated.
This is a new line added.
Another line of text.
More content added here.
The end of the document.`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Text Diff Checker"
          description="Compare two text blocks and highlight differences"
        />

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Diff Mode:
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDiffMode("line")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    diffMode === "line"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Line by Line
                </button>
                <button
                  onClick={() => setDiffMode("word")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    diffMode === "word"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Word by Word
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setText1(exampleText1);
                  setText2(exampleText2);
                }}
                variant="secondary"
                size="sm"
              >
                Load Example
              </Button>
              <Button
                onClick={handleCopyDiff}
                size="sm"
                disabled={diffResult.length === 0}
              >
                Copy Diff
              </Button>
              <Button
                onClick={handleExportDiff}
                size="sm"
                disabled={diffResult.length === 0}
              >
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Original Text
            </h2>
            <Textarea
              value={text1}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText1(e.target.value)
              }
              placeholder="Enter the original text here..."
              rows={15}
              className="font-mono text-sm"
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Modified Text
            </h2>
            <Textarea
              value={text2}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText2(e.target.value)
              }
              placeholder="Enter the modified text here..."
              rows={15}
              className="font-mono text-sm"
            />
          </Card>
        </div>

        {/* Statistics */}
        {(text1 || text2) && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Diff Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {diffStats.added}
                </div>
                <div className="text-sm text-gray-600">Lines Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {diffStats.removed}
                </div>
                <div className="text-sm text-gray-600">Lines Removed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {diffStats.unchanged}
                </div>
                <div className="text-sm text-gray-600">Unchanged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {diffStats.added + diffStats.removed}
                </div>
                <div className="text-sm text-gray-600">Total Changes</div>
              </div>
            </div>
          </Card>
        )}

        {/* Diff Result */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Difference View
          </h2>

          {isProcessing ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Computing differences...</span>
            </div>
          ) : diffResult.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Enter text in both fields to see the differences
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-auto">
                {diffMode === "line" ? (
                  <table className="w-full text-sm font-mono">
                    <thead className="bg-gray-800 text-gray-300">
                      <tr>
                        <th className="px-2 py-1 text-left w-12">Old</th>
                        <th className="px-2 py-1 text-left w-12">New</th>
                        <th className="px-2 py-1 text-left w-8"></th>
                        <th className="px-4 py-1 text-left">Content</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diffResult.map((line, index) => (
                        <tr
                          key={index}
                          className={`
                          ${line.type === "added" ? "bg-green-900/30" : ""}
                          ${line.type === "removed" ? "bg-red-900/30" : ""}
                          ${line.type === "unchanged" ? "bg-gray-800" : ""}
                        `}
                        >
                          <td className="px-2 py-1 text-gray-400 text-right">
                            {line.lineNumber1 || ""}
                          </td>
                          <td className="px-2 py-1 text-gray-400 text-right">
                            {line.lineNumber2 || ""}
                          </td>
                          <td className="px-2 py-1 text-center">
                            {line.type === "added" && (
                              <span className="text-green-400">+</span>
                            )}
                            {line.type === "removed" && (
                              <span className="text-red-400">-</span>
                            )}
                            {line.type === "unchanged" && (
                              <span className="text-gray-500"> </span>
                            )}
                          </td>
                          <td
                            className={`px-4 py-1 ${
                              line.type === "added"
                                ? "text-green-300"
                                : line.type === "removed"
                                ? "text-red-300"
                                : "text-gray-300"
                            }`}
                          >
                            {line.content || " "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 whitespace-pre-wrap">
                    {diffResult.map((word, index) => (
                      <span
                        key={index}
                        className={`${
                          word.type === "added"
                            ? "bg-green-900/50 text-green-300"
                            : word.type === "removed"
                            ? "bg-red-900/50 text-red-300 line-through"
                            : "text-gray-300"
                        }`}
                      >
                        {word.content}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Side by Side
            </h3>
            <p className="text-gray-600 text-sm">
              Compare texts with clear visual indicators
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Statistics
            </h3>
            <p className="text-gray-600 text-sm">
              Track added, removed, and unchanged lines
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Modes
            </h3>
            <p className="text-gray-600 text-sm">
              Line-by-line or word-by-word comparison
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
              Export Results
            </h3>
            <p className="text-gray-600 text-sm">
              Copy or download diff results
            </p>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            About Text Diff Comparison
          </h2>
          <p className="text-blue-800 mb-4">
            Text diff tools are essential for comparing documents, code files,
            and any text content. They help identify changes, track revisions,
            and merge different versions of content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Common Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Code review and version control</li>
                <li>• Document revision tracking</li>
                <li>• Content comparison</li>
                <li>• Merge conflict resolution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Color-coded differences</li>
                <li>• Line number tracking</li>
                <li>• Statistical analysis</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
