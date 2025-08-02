"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";

type CaseType =
  | "uppercase"
  | "lowercase"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternate"
  | "inverse"
  | "random";

interface ConversionResult {
  type: CaseType;
  label: string;
  result: string;
  description: string;
}

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState("");
  const [preserveFormatting, setPreserveFormatting] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);

  const convertText = (text: string, caseType: CaseType): string => {
    if (!text) return "";

    switch (caseType) {
      case "uppercase":
        return text.toUpperCase();

      case "lowercase":
        return text.toLowerCase();

      case "title":
        return text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );

      case "sentence":
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

      case "camel":
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, "");

      case "pascal":
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, "");

      case "snake":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("_");

      case "kebab":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("-");

      case "constant":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toUpperCase())
          .join("_");

      case "alternate":
        return text
          .split("")
          .map((char, index) =>
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join("");

      case "inverse":
        return text
          .split("")
          .map((char) =>
            char === char.toUpperCase()
              ? char.toLowerCase()
              : char.toUpperCase()
          )
          .join("");

      case "random":
        return text
          .split("")
          .map((char) =>
            Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
          )
          .join("");

      default:
        return text;
    }
  };

  const caseTypes: { type: CaseType; label: string; description: string }[] = [
    {
      type: "uppercase",
      label: "UPPERCASE",
      description: "Converts all characters to uppercase",
    },
    {
      type: "lowercase",
      label: "lowercase",
      description: "Converts all characters to lowercase",
    },
    {
      type: "title",
      label: "Title Case",
      description: "Capitalizes the first letter of each word",
    },
    {
      type: "sentence",
      label: "Sentence case",
      description: "Capitalizes the first letter of each sentence",
    },
    {
      type: "camel",
      label: "camelCase",
      description:
        "First word lowercase, subsequent words capitalized, no spaces",
    },
    {
      type: "pascal",
      label: "PascalCase",
      description: "All words capitalized, no spaces",
    },
    {
      type: "snake",
      label: "snake_case",
      description: "All lowercase with underscores between words",
    },
    {
      type: "kebab",
      label: "kebab-case",
      description: "All lowercase with hyphens between words",
    },
    {
      type: "constant",
      label: "CONSTANT_CASE",
      description: "All uppercase with underscores between words",
    },
    {
      type: "alternate",
      label: "aLtErNaTe CaSe",
      description: "Alternates between lowercase and uppercase",
    },
    {
      type: "inverse",
      label: "iNVERSE cASE",
      description: "Inverts the case of each character",
    },
    {
      type: "random",
      label: "RaNdOm CaSe",
      description: "Randomly applies uppercase or lowercase to each character",
    },
  ];

  const handleInputChange = (value: string) => {
    setInputText(value);

    if (value.trim()) {
      const newResults: ConversionResult[] = caseTypes.map(
        ({ type, label, description }) => ({
          type,
          label,
          description,
          result: convertText(value, type),
        })
      );
      setResults(newResults);
    } else {
      setResults([]);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const examples = [
    {
      title: "Programming Variable",
      text: "user profile settings",
      cases: {
        camelCase: "userProfileSettings",
        PascalCase: "UserProfileSettings",
        snake_case: "user_profile_settings",
        "kebab-case": "user-profile-settings",
      },
    },
    {
      title: "Article Title",
      text: "the quick brown fox jumps over the lazy dog",
      cases: {
        "Title Case": "The Quick Brown Fox Jumps Over The Lazy Dog",
        "Sentence case": "The quick brown fox jumps over the lazy dog",
        UPPERCASE: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
      },
    },
    {
      title: "API Endpoint",
      text: "Get User Account Information",
      cases: {
        "kebab-case": "get-user-account-information",
        snake_case: "get_user_account_information",
        camelCase: "getUserAccountInformation",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="🔄 Case Converter"
        description="Convert text between different cases and naming conventions"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <Textarea
                label="Enter text to convert"
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preserveFormatting}
                  onChange={(e) => setPreserveFormatting(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-300">
                  Preserve line breaks and spacing
                </span>
              </label>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleInputChange(inputText.toUpperCase())}
                disabled={!inputText.trim()}
              >
                UPPERCASE
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleInputChange(inputText.toLowerCase())}
                disabled={!inputText.trim()}
              >
                lowercase
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInputText("")}
                disabled={!inputText.trim()}
              >
                Clear
              </Button>
            </div>

            {/* Results Grid */}
            {results.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">
                  Conversion Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map(({ type, label, description, result }) => (
                    <div key={type} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-blue-400">
                          {label}
                        </h4>
                        <button
                          onClick={() => copyToClipboard(result)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors flex items-center gap-1"
                        >
                          <svg
                            className="w-3 h-3"
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
                      <p className="text-gray-400 text-xs mb-3">
                        {description}
                      </p>
                      <div className="bg-gray-900 rounded p-3">
                        <code className="text-green-400 text-sm break-all">
                          {result || "(empty)"}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Examples Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Examples</h3>
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <h4 className="text-lg font-medium text-blue-400 mb-3">
                    {example.title}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Original:</span>
                      <code className="block bg-gray-800 p-2 rounded text-white mt-1">
                        {example.text}
                      </code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(example.cases).map(
                        ([caseType, result]) => (
                          <div key={caseType}>
                            <span className="text-gray-400 text-xs">
                              {caseType}:
                            </span>
                            <code className="block bg-gray-800 p-2 rounded text-yellow-400 mt-1 text-sm">
                              {result}
                            </code>
                          </div>
                        )
                      )}
                    </div>
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
              Case Convention Guide
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Programming Conventions
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">camelCase</h5>
                      <p className="text-gray-300">
                        Variables, functions in JavaScript, Java
                      </p>
                      <code className="text-green-400">
                        getUserName, calculateTotal
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">PascalCase</h5>
                      <p className="text-gray-300">
                        Classes, components in most languages
                      </p>
                      <code className="text-green-400">
                        UserProfile, DataProcessor
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">snake_case</h5>
                      <p className="text-gray-300">
                        Variables in Python, Ruby, database columns
                      </p>
                      <code className="text-green-400">
                        user_name, total_amount
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">kebab-case</h5>
                      <p className="text-gray-300">
                        URLs, CSS classes, file names
                      </p>
                      <code className="text-green-400">
                        user-profile, main-content
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Writing Conventions
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">Title Case</h5>
                      <p className="text-gray-300">
                        Headings, titles, proper nouns
                      </p>
                      <code className="text-green-400">
                        The Art of Computer Programming
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">
                        Sentence case
                      </h5>
                      <p className="text-gray-300">
                        Regular sentences, descriptions
                      </p>
                      <code className="text-green-400">
                        This is a sentence case example.
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">
                        CONSTANT_CASE
                      </h5>
                      <p className="text-gray-300">
                        Constants, environment variables
                      </p>
                      <code className="text-green-400">
                        MAX_RETRY_COUNT, API_BASE_URL
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="text-blue-400 font-medium">
                        Special Cases
                      </h5>
                      <p className="text-gray-300">
                        Alternative, inverse, random for creative use
                      </p>
                      <code className="text-green-400">aLtErNaTiNg TeXt</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mt-6">
                <h4 className="text-blue-300 font-semibold mb-2">Pro Tip:</h4>
                <p className="text-blue-200 text-sm">
                  Different programming languages and frameworks have their own
                  naming conventions. Always follow the style guide of your
                  specific technology stack for consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
