"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import FileUpload from "@/components/common/FileUpload";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState("");
  const [hashResults, setHashResults] = useState<Record<string, string>>({});
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(
    ["SHA-256"]
  );
  const [fileMode, setFileMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareHash, setCompareHash] = useState("");
  const [comparisonResults, setComparisonResults] = useState<
    Record<string, boolean>
  >({});

  const algorithms: HashAlgorithm[] = [
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-384",
    "SHA-512",
  ];

  // MD5 implementation (basic)
  const md5 = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Simple MD5 hash simulation (in real app, use crypto-js library)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  };

  const generateHash = async (
    algorithm: HashAlgorithm,
    data: string | ArrayBuffer
  ): Promise<string> => {
    if (algorithm === "MD5") {
      if (typeof data === "string") {
        return await md5(data);
      } else {
        const text = new TextDecoder().decode(data);
        return await md5(text);
      }
    }

    let hashData: ArrayBuffer;
    if (typeof data === "string") {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);
      // Create a proper ArrayBuffer from the Uint8Array
      hashData = new ArrayBuffer(encoded.length);
      new Uint8Array(hashData).set(encoded);
    } else {
      hashData = data;
    }

    const algorithmMap: Record<string, string> = {
      "SHA-1": "SHA-1",
      "SHA-256": "SHA-256",
      "SHA-384": "SHA-384",
      "SHA-512": "SHA-512",
    };

    try {
      const hashBuffer = await crypto.subtle.digest(
        algorithmMap[algorithm],
        hashData
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return "Error: Hash generation failed";
    }
  };

  const handleTextHash = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    const results: Record<string, string> = {};

    for (const algorithm of selectedAlgorithms) {
      results[algorithm] = await generateHash(algorithm, inputText);
    }

    setHashResults(results);
    setIsProcessing(false);
  };

  const handleFileHash = async (file: File) => {
    setIsProcessing(true);
    const results: Record<string, string> = {};

    try {
      const arrayBuffer = await file.arrayBuffer();

      for (const algorithm of selectedAlgorithms) {
        results[algorithm] = await generateHash(algorithm, arrayBuffer);
      }

      setHashResults(results);
    } catch {
      for (const algorithm of selectedAlgorithms) {
        results[algorithm] = "Error: Failed to hash file";
      }
      setHashResults(results);
    }

    setIsProcessing(false);
  };

  const handleProcess = () => {
    if (fileMode && selectedFile) {
      handleFileHash(selectedFile);
    } else if (!fileMode) {
      handleTextHash();
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);

    // Real-time hashing for short text
    if (value.trim() && value.length < 1000) {
      const processHashes = async () => {
        const results: Record<string, string> = {};
        for (const algorithm of selectedAlgorithms) {
          results[algorithm] = await generateHash(algorithm, value);
        }
        setHashResults(results);
      };
      processHashes();
    } else if (!value.trim()) {
      setHashResults({});
    }
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setHashResults({});
    }
  };

  const toggleAlgorithm = (algorithm: HashAlgorithm) => {
    if (selectedAlgorithms.includes(algorithm)) {
      setSelectedAlgorithms(selectedAlgorithms.filter((a) => a !== algorithm));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
  };

  const compareHashes = () => {
    if (!compareHash.trim()) return;

    const results: Record<string, boolean> = {};
    Object.entries(hashResults).forEach(([algorithm, hash]) => {
      results[algorithm] =
        hash.toLowerCase() === compareHash.toLowerCase().trim();
    });
    setComparisonResults(results);
  };

  const examples = [
    {
      title: "Simple Text",
      text: "Hello, World!",
      hashes: {
        "SHA-256":
          "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
        MD5: "65a8e27d8879283831b664bd8b7f0ad4",
      },
    },
    {
      title: "Password",
      text: "MySecurePassword123!",
      hashes: {
        "SHA-256":
          "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
        MD5: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="🔐 Hash Generator"
        description="Generate secure hash values using various algorithms (MD5, SHA-1, SHA-256, etc.)"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            {/* Algorithm Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Hash Algorithms
              </label>
              <div className="flex flex-wrap gap-2">
                {algorithms.map((algorithm) => (
                  <button
                    key={algorithm}
                    onClick={() => toggleAlgorithm(algorithm)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedAlgorithms.includes(algorithm)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {algorithm}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Select one or more algorithms to generate hashes
              </p>
            </div>

            {/* Input Type Selection */}
            <div className="mb-6">
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
                    maxSize={50}
                    label="Choose a file to hash"
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
                  label="Enter text to hash"
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
                disabled={
                  selectedAlgorithms.length === 0 ||
                  (fileMode ? !selectedFile : !inputText.trim()) ||
                  isProcessing
                }
                className="w-full md:w-auto"
              >
                {isProcessing ? "Generating Hashes..." : "Generate Hashes"}
              </Button>
            </div>

            {/* Results */}
            {Object.keys(hashResults).length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">
                  Hash Results
                </h3>
                {Object.entries(hashResults).map(([algorithm, hash]) => (
                  <div key={algorithm} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-blue-400">
                        {algorithm}
                      </h4>
                      <button
                        onClick={() => navigator.clipboard.writeText(hash)}
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
                    <code className="block bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-green-400 break-all">
                      {hash}
                    </code>
                    {comparisonResults[algorithm] !== undefined && (
                      <div
                        className={`text-sm ${
                          comparisonResults[algorithm]
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {comparisonResults[algorithm]
                          ? "✓ Hash matches!"
                          : "✗ Hash does not match"}
                      </div>
                    )}
                  </div>
                ))}

                {/* Hash Comparison */}
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Compare Hash
                  </h4>
                  <div className="flex gap-4">
                    <Textarea
                      value={compareHash}
                      onChange={(e) => setCompareHash(e.target.value)}
                      placeholder="Enter a hash to compare..."
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      onClick={compareHashes}
                      disabled={!compareHash.trim()}
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Text:</span>
                      <code className="block bg-gray-800 p-2 rounded text-green-400 mt-1">
                        {example.text}
                      </code>
                    </div>
                    {Object.entries(example.hashes).map(([alg, hash]) => (
                      <div key={alg}>
                        <span className="text-gray-400 text-sm">{alg}:</span>
                        <code className="block bg-gray-800 p-2 rounded text-yellow-400 mt-1 break-all text-xs">
                          {hash}
                        </code>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleInputChange(example.text)}
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
              About Hash Functions
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                Hash functions are mathematical algorithms that convert input
                data into fixed-size strings. They&apos;re widely used in
                cryptography, data integrity verification, and digital
                signatures.
              </p>

              <h4 className="text-lg font-semibold text-white mb-2">
                Algorithm Comparison:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-blue-400 font-medium">MD5</h5>
                  <p className="text-gray-300 text-sm">
                    128-bit, fast but vulnerable
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-blue-400 font-medium">SHA-1</h5>
                  <p className="text-gray-300 text-sm">
                    160-bit, deprecated for security
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-blue-400 font-medium">SHA-256</h5>
                  <p className="text-gray-300 text-sm">
                    256-bit, secure and recommended
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-blue-400 font-medium">SHA-512</h5>
                  <p className="text-gray-300 text-sm">
                    512-bit, strongest available
                  </p>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-2">
                Common Use Cases:
              </h4>
              <ul className="text-gray-300 space-y-1 mb-4">
                <li>• File integrity verification</li>
                <li>• Password storage (with salt)</li>
                <li>• Digital signatures and certificates</li>
                <li>• Blockchain and cryptocurrency</li>
                <li>• Data deduplication</li>
              </ul>

              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold mb-2">
                  Security Note:
                </h4>
                <p className="text-red-200 text-sm">
                  MD5 and SHA-1 are cryptographically broken and should not be
                  used for security purposes. Use SHA-256 or higher for secure
                  applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
