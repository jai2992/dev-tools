"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";

export default function UrlEncoderPage() {
  const [inputText, setInputText] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "both">("both");

  const handleEncode = () => {
    if (!inputText.trim()) return;

    try {
      const encoded = encodeURIComponent(inputText);
      setEncodedResult(encoded);
    } catch {
      setEncodedResult("Error: Invalid input for encoding");
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) return;

    try {
      const decoded = decodeURIComponent(inputText);
      setDecodedResult(decoded);
    } catch {
      setDecodedResult("Error: Invalid URL encoding");
    }
  };

  const handleProcess = () => {
    if (mode === "encode" || mode === "both") {
      handleEncode();
    }
    if (mode === "decode" || mode === "both") {
      handleDecode();
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);

    // Real-time processing
    if (value.trim()) {
      if (mode === "encode" || mode === "both") {
        try {
          setEncodedResult(encodeURIComponent(value));
        } catch {
          setEncodedResult("Error: Invalid input for encoding");
        }
      }
      if (mode === "decode" || mode === "both") {
        try {
          setDecodedResult(decodeURIComponent(value));
        } catch {
          setDecodedResult("Error: Invalid URL encoding");
        }
      }
    } else {
      setEncodedResult("");
      setDecodedResult("");
    }
  };

  const examples = [
    {
      title: "Query Parameter",
      original: "search query with spaces",
      encoded: "search%20query%20with%20spaces",
    },
    {
      title: "Special Characters",
      original: "hello@world!#$%",
      encoded: "hello%40world!%23%24%25",
    },
    {
      title: "International Characters",
      original: "café résumé naïve",
      encoded: "caf%C3%A9%20r%C3%A9sum%C3%A9%20na%C3%AFve",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="🔗 URL Encoder/Decoder"
        description="Encode and decode URLs for safe transmission and processing"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Operation Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="encode"
                    checked={mode === "encode"}
                    onChange={(e) => setMode(e.target.value as "encode")}
                    className="sr-only"
                  />
                  <Button
                    variant={mode === "encode" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setMode("encode")}
                  >
                    Encode Only
                  </Button>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="decode"
                    checked={mode === "decode"}
                    onChange={(e) => setMode(e.target.value as "decode")}
                    className="sr-only"
                  />
                  <Button
                    variant={mode === "decode" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setMode("decode")}
                  >
                    Decode Only
                  </Button>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="both"
                    checked={mode === "both"}
                    onChange={(e) => setMode(e.target.value as "both")}
                    className="sr-only"
                  />
                  <Button
                    variant={mode === "both" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setMode("both")}
                  >
                    Both
                  </Button>
                </label>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <Textarea
                label="Enter text to encode/decode"
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter your text here..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Action Button */}
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={!inputText.trim()}
                className="w-full md:w-auto"
              >
                {mode === "encode"
                  ? "Encode URL"
                  : mode === "decode"
                  ? "Decode URL"
                  : "Encode & Decode"}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {(mode === "encode" || mode === "both") && encodedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Encoded Result
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(encodedResult)
                        }
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                    {encodedResult}
                  </pre>
                </div>
              )}

              {(mode === "decode" || mode === "both") && decodedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Decoded Result
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(decodedResult)
                        }
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                    {decodedResult}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Examples Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Examples</h3>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <h4 className="text-lg font-medium text-blue-400 mb-2">
                    {example.title}
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 text-sm">Original:</span>
                      <code className="block bg-gray-800 p-2 rounded text-green-400 mt-1">
                        {example.original}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Encoded:</span>
                      <code className="block bg-gray-800 p-2 rounded text-yellow-400 mt-1">
                        {example.encoded}
                      </code>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleInputChange(example.original)}
                    className="mt-3"
                  >
                    Try This Example
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              About URL Encoding
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                URL encoding (also called percent encoding) is a mechanism for
                encoding information in URLs. It&apos;s essential when URLs
                contain special characters or spaces that need to be transmitted
                safely over the internet.
              </p>

              <h4 className="text-lg font-semibold text-white mb-2">
                When to Use URL Encoding:
              </h4>
              <ul className="text-gray-300 space-y-1 mb-4">
                <li>• Query parameters with spaces or special characters</li>
                <li>• Form data submission</li>
                <li>• API requests with dynamic parameters</li>
                <li>• Storing URLs in databases</li>
                <li>• Email links with parameters</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-2">
                Common Characters:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-blue-400">Space</div>
                  <div className="text-yellow-400">%20</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-blue-400">@</div>
                  <div className="text-yellow-400">%40</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-blue-400">#</div>
                  <div className="text-yellow-400">%23</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-blue-400">%</div>
                  <div className="text-yellow-400">%25</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
