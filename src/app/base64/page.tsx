"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import FileUpload from "@/components/common/FileUpload";

export default function Base64EncoderPage() {
  const [inputText, setInputText] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "both">("both");
  const [fileMode, setFileMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const handleTextEncode = () => {
    if (!inputText.trim()) return;

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setEncodedResult(encoded);
    } catch {
      setEncodedResult("Error: Invalid input for encoding");
    }
  };

  const handleTextDecode = () => {
    if (!inputText.trim()) return;

    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setDecodedResult(decoded);
    } catch {
      setDecodedResult("Error: Invalid Base64 string");
    }
  };

  const handleFileEncode = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        const binary = bytes.reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          ""
        );
        const encoded = btoa(binary);
        setEncodedResult(encoded);

        // Show preview for images
        if (file.type.startsWith("image/")) {
          setFilePreview(`data:${file.type};base64,${encoded}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch {
      setEncodedResult("Error: Failed to encode file");
    }
  };

  const handleFileDecode = () => {
    if (!inputText.trim()) return;

    try {
      const binaryString = atob(inputText);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile?.name || "decoded-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDecodedResult("File downloaded successfully");
    } catch {
      setDecodedResult("Error: Invalid Base64 string for file");
    }
  };

  const handleProcess = () => {
    if (fileMode && selectedFile) {
      if (mode === "encode" || mode === "both") {
        handleFileEncode(selectedFile);
      }
      if (mode === "decode" || mode === "both") {
        handleFileDecode();
      }
    } else {
      if (mode === "encode" || mode === "both") {
        handleTextEncode();
      }
      if (mode === "decode" || mode === "both") {
        handleTextDecode();
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);

    // Real-time processing for text
    if (!fileMode && value.trim()) {
      if (mode === "encode" || mode === "both") {
        try {
          setEncodedResult(btoa(unescape(encodeURIComponent(value))));
        } catch {
          setEncodedResult("Error: Invalid input for encoding");
        }
      }
      if (mode === "decode" || mode === "both") {
        try {
          setDecodedResult(decodeURIComponent(escape(atob(value))));
        } catch {
          setDecodedResult("Error: Invalid Base64 string");
        }
      }
    } else {
      setEncodedResult("");
      setDecodedResult("");
    }
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setFilePreview("");
    }
  };

  const examples = [
    {
      title: "Simple Text",
      original: "Hello, World!",
      encoded: "SGVsbG8sIFdvcmxkIQ==",
    },
    {
      title: "Special Characters",
      original: "café résumé 日本語",
      encoded: "Y2Fmw6kgcsOpc3Vtw6kgaOaZpeadpeiQkg==",
    },
    {
      title: "JSON Data",
      original: '{"name":"John","age":30}',
      encoded: "eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="🔐 Base64 Encoder/Decoder"
        description="Encode and decode text and files to/from Base64 format"
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
              <div className="flex gap-4 mb-4">
                <Button
                  variant={mode === "encode" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setMode("encode")}
                >
                  Encode Only
                </Button>
                <Button
                  variant={mode === "decode" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setMode("decode")}
                >
                  Decode Only
                </Button>
                <Button
                  variant={mode === "both" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setMode("both")}
                >
                  Both
                </Button>
              </div>

              <label className="block text-sm font-medium text-gray-300 mb-3">
                Input Type
              </label>
              <div className="flex gap-4">
                <Button
                  variant={!fileMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFileMode(false)}
                >
                  Text Input
                </Button>
                <Button
                  variant={fileMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFileMode(true)}
                >
                  File Upload
                </Button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              {fileMode ? (
                <div className="space-y-4">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    maxSize={10}
                    label="Choose a file to encode/decode"
                  />
                  {selectedFile && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-2">
                        Selected File
                      </h4>
                      <p className="text-gray-300">
                        <strong>Name:</strong> {selectedFile.name}
                      </p>
                      <p className="text-gray-300">
                        <strong>Size:</strong>{" "}
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <p className="text-gray-300">
                        <strong>Type:</strong> {selectedFile.type || "Unknown"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Textarea
                  label="Enter text to encode/decode"
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your text here..."
                  rows={4}
                  className="w-full"
                />
              )}
            </div>

            {/* Action Button */}
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={fileMode ? !selectedFile : !inputText.trim()}
                className="w-full md:w-auto"
              >
                {mode === "encode"
                  ? "Encode"
                  : mode === "decode"
                  ? "Decode"
                  : "Encode & Decode"}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {(mode === "encode" || mode === "both") && encodedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Base64 Encoded Result
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
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap break-all">
                    {encodedResult}
                  </pre>
                  {filePreview && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-white mb-2">
                        Image Preview
                      </h4>
                      <div
                        className="max-w-xs max-h-48 rounded-lg border border-gray-700 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${filePreview})`,
                          minHeight: "100px",
                        }}
                        aria-label="Preview"
                      />
                    </div>
                  )}
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
                      <span className="text-gray-400 text-sm">Base64:</span>
                      <code className="block bg-gray-800 p-2 rounded text-yellow-400 mt-1 break-all">
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
              About Base64 Encoding
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                Base64 is a binary-to-text encoding scheme that represents
                binary data as printable ASCII characters. It&apos;s commonly
                used for encoding data in email, web development, and data
                storage.
              </p>

              <h4 className="text-lg font-semibold text-white mb-2">
                Common Use Cases:
              </h4>
              <ul className="text-gray-300 space-y-1 mb-4">
                <li>• Embedding images in HTML/CSS (data URIs)</li>
                <li>• Encoding binary data for JSON APIs</li>
                <li>• Email attachments and MIME encoding</li>
                <li>• Storing binary data in text-based formats</li>
                <li>• Authentication tokens and API keys</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-2">
                Features:
              </h4>
              <ul className="text-gray-300 space-y-1 mb-4">
                <li>• Supports both text and file encoding/decoding</li>
                <li>• Real-time encoding for text input</li>
                <li>• Image preview for encoded image files</li>
                <li>• Automatic file download for decoded files</li>
                <li>• UTF-8 text handling</li>
              </ul>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">Note:</h4>
                <p className="text-yellow-200 text-sm">
                  Base64 encoding increases data size by approximately 33%.
                  It&apos;s not encryption - encoded data can be easily decoded
                  by anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
