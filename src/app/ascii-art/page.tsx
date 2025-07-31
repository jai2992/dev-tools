"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Select from "@/components/common/Select";

const ASCII_FONTS = {
  block: {
    name: "Block",
    chars: {
      A: ["  ▄▄  ", " ████ ", "██  ██", "██████", "██  ██", "██  ██", "      "],
      B: ["██████", "██  ██", "██████", "██████", "██  ██", "██████", "      "],
      C: [" █████", "██    ", "██    ", "██    ", "██    ", " █████", "      "],
      D: ["██████", "██  ██", "██  ██", "██  ██", "██  ██", "██████", "      "],
      E: ["██████", "██    ", "█████ ", "█████ ", "██    ", "██████", "      "],
      F: ["██████", "██    ", "█████ ", "█████ ", "██    ", "██    ", "      "],
      G: [" █████", "██    ", "██ ███", "██  ██", "██  ██", " █████", "      "],
      H: ["██  ██", "██  ██", "██████", "██████", "██  ██", "██  ██", "      "],
      I: ["██████", "  ██  ", "  ██  ", "  ██  ", "  ██  ", "██████", "      "],
      J: ["██████", "    ██", "    ██", "    ██", "██  ██", " █████", "      "],
      K: ["██  ██", "██ ██ ", "████  ", "████  ", "██ ██ ", "██  ██", "      "],
      L: ["██    ", "██    ", "██    ", "██    ", "██    ", "██████", "      "],
      M: ["██  ██", "██████", "██████", "██  ██", "██  ██", "██  ██", "      "],
      N: ["██  ██", "███ ██", "██████", "██ ███", "██  ██", "██  ██", "      "],
      O: [" █████", "██  ██", "██  ██", "██  ██", "██  ██", " █████", "      "],
      P: ["██████", "██  ██", "██████", "██    ", "██    ", "██    ", "      "],
      Q: [
        " █████",
        "██  ██",
        "██  ██",
        "██ ███",
        "██  ██",
        " ██████",
        "     █",
      ],
      R: ["██████", "██  ██", "██████", "██ ██ ", "██  ██", "██  ██", "      "],
      S: [" █████", "██    ", " ████ ", "    ██", "    ██", "█████ ", "      "],
      T: ["██████", "  ██  ", "  ██  ", "  ██  ", "  ██  ", "  ██  ", "      "],
      U: ["██  ██", "██  ██", "██  ██", "██  ██", "██  ██", " █████", "      "],
      V: ["██  ██", "██  ██", "██  ██", "██  ██", " ████ ", "  ██  ", "      "],
      W: ["██  ██", "██  ██", "██  ██", "██████", "██████", "██  ██", "      "],
      X: ["██  ██", " ████ ", "  ██  ", "  ██  ", " ████ ", "██  ██", "      "],
      Y: ["██  ██", "██  ██", " ████ ", "  ██  ", "  ██  ", "  ██  ", "      "],
      Z: ["██████", "    ██", "   ██ ", "  ██  ", " ██   ", "██████", "      "],
      " ": [
        "      ",
        "      ",
        "      ",
        "      ",
        "      ",
        "      ",
        "      ",
      ],
      "0": [
        " █████",
        "██  ██",
        "██ ███",
        "███ ██",
        "██  ██",
        " █████",
        "      ",
      ],
      "1": [
        "  ██  ",
        " ███  ",
        "  ██  ",
        "  ██  ",
        "  ██  ",
        "██████",
        "      ",
      ],
      "2": [
        " █████",
        "██  ██",
        "   ██ ",
        " ████ ",
        "██    ",
        "██████",
        "      ",
      ],
      "3": [
        " █████",
        "██  ██",
        "  ███ ",
        "   ███",
        "██  ██",
        " █████",
        "      ",
      ],
      "4": [
        "██  ██",
        "██  ██",
        "██████",
        "    ██",
        "    ██",
        "    ██",
        "      ",
      ],
      "5": [
        "██████",
        "██    ",
        "██████",
        "    ██",
        "██  ██",
        " █████",
        "      ",
      ],
      "6": [
        " █████",
        "██    ",
        "██████",
        "██  ██",
        "██  ██",
        " █████",
        "      ",
      ],
      "7": [
        "██████",
        "    ██",
        "   ██ ",
        "  ██  ",
        " ██   ",
        "██    ",
        "      ",
      ],
      "8": [
        " █████",
        "██  ██",
        " █████",
        " █████",
        "██  ██",
        " █████",
        "      ",
      ],
      "9": [
        " █████",
        "██  ██",
        " ██████",
        "    ██",
        "    ██",
        " █████",
        "      ",
      ],
      "!": [
        "  ██  ",
        "  ██  ",
        "  ██  ",
        "  ██  ",
        "      ",
        "  ██  ",
        "      ",
      ],
      "?": [
        " █████",
        "██  ██",
        "   ██ ",
        "  ██  ",
        "      ",
        "  ██  ",
        "      ",
      ],
      ".": [
        "      ",
        "      ",
        "      ",
        "      ",
        "      ",
        "  ██  ",
        "      ",
      ],
      ",": [
        "      ",
        "      ",
        "      ",
        "      ",
        "  ██  ",
        " ██   ",
        "      ",
      ],
    },
  },
  small: {
    name: "Small",
    chars: {
      A: ["▄▀█", "█▀█", "   "],
      B: ["█▄▄", "█▄█", "   "],
      C: ["▄▀█", "█▄▄", "   "],
      D: ["█▀▄", "█▄▀", "   "],
      E: ["█▀▀", "█▄▄", "   "],
      F: ["█▀▀", "█▀▀", "   "],
      G: ["▄▀█", "█▄█", "   "],
      H: ["█ █", "█▀█", "   "],
      I: ["█", "█", " "],
      J: ["  █", "▄▄█", "   "],
      K: ["█ █", "██ ", "   "],
      L: ["█  ", "█▄▄", "   "],
      M: ["█▄█", "█▀█", "   "],
      N: ["█▄█", "█▀█", "   "],
      O: ["▄▀█", "█▄█", "   "],
      P: ["█▀▄", "█▀ ", "   "],
      Q: ["▄▀█", "█▄█", "   "],
      R: ["█▀▄", "█▀▄", "   "],
      S: ["▄▀█", "▀▀█", "   "],
      T: ["▀█▀", " █ ", "   "],
      U: ["█ █", "█▄█", "   "],
      V: ["█ █", " █ ", "   "],
      W: ["█ █", "█▄█", "   "],
      X: ["█ █", " █ ", "   "],
      Y: ["█ █", " █ ", "   "],
      Z: ["▀▀▀", "▄▄▄", "   "],
      " ": [" ", " ", " "],
      "0": ["▄▀█", "█▄█", "   "],
      "1": ["█", "█", " "],
      "2": ["▀▀▄", "▄▄▀", "   "],
      "3": ["▀▀▄", "▄▄▀", "   "],
      "4": ["█ █", "▀▀█", "   "],
      "5": ["█▀▀", "▀▀█", "   "],
      "6": ["▄▀▀", "█▄█", "   "],
      "7": ["▀▀▀", "  █", "   "],
      "8": ["▄▀▄", "█▄█", "   "],
      "9": ["█▀█", "▀▀█", "   "],
      "!": ["█", "█", " "],
      "?": ["▀▄", " █", " "],
      ".": [" ", "▄", " "],
      ",": [" ", "▄", " "],
    },
  },
  dots: {
    name: "Dots",
    chars: {
      A: ["  ●●  ", " ●  ● ", "●●●●●●", "●    ●", "●    ●", "      "],
      B: ["●●●●● ", "●    ●", "●●●●● ", "●    ●", "●●●●● ", "      "],
      C: [" ●●●● ", "●     ", "●     ", "●     ", " ●●●● ", "      "],
      D: ["●●●●● ", "●    ●", "●    ●", "●    ●", "●●●●● ", "      "],
      E: ["●●●●●●", "●     ", "●●●●● ", "●     ", "●●●●●●", "      "],
      F: ["●●●●●●", "●     ", "●●●●● ", "●     ", "●     ", "      "],
      G: [" ●●●● ", "●     ", "● ●●●", "●   ●", " ●●●● ", "      "],
      H: ["●    ●", "●    ●", "●●●●●●", "●    ●", "●    ●", "      "],
      I: ["●●●●●●", "  ●●  ", "  ●●  ", "  ●●  ", "●●●●●●", "      "],
      J: ["●●●●●●", "    ●●", "    ●●", "●   ●●", " ●●●● ", "      "],
      K: ["●   ●●", "●  ●● ", "●●●   ", "●  ●● ", "●   ●●", "      "],
      L: ["●     ", "●     ", "●     ", "●     ", "●●●●●●", "      "],
      M: ["●    ●", "●●  ●●", "● ●● ●", "●    ●", "●    ●", "      "],
      N: ["●    ●", "●●   ●", "● ●  ●", "●  ● ●", "●   ●●", "      "],
      O: [" ●●●● ", "●    ●", "●    ●", "●    ●", " ●●●● ", "      "],
      P: ["●●●●● ", "●    ●", "●●●●● ", "●     ", "●     ", "      "],
      Q: [" ●●●● ", "●    ●", "● ●● ●", "●   ●●", " ●●●●●", "      "],
      R: ["●●●●● ", "●    ●", "●●●●● ", "●  ●● ", "●   ●●", "      "],
      S: [" ●●●●●", "●     ", " ●●●● ", "     ●", "●●●●● ", "      "],
      T: ["●●●●●●", "  ●●  ", "  ●●  ", "  ●●  ", "  ●●  ", "      "],
      U: ["●    ●", "●    ●", "●    ●", "●    ●", " ●●●● ", "      "],
      V: ["●    ●", "●    ●", "●    ●", " ●  ● ", "  ●●  ", "      "],
      W: ["●    ●", "●    ●", "● ●● ●", "●●  ●●", "●    ●", "      "],
      X: ["●    ●", " ●  ● ", "  ●●  ", " ●  ● ", "●    ●", "      "],
      Y: ["●    ●", "●    ●", " ●  ● ", "  ●●  ", "  ●●  ", "      "],
      Z: ["●●●●●●", "    ●●", "   ●● ", "  ●●  ", "●●●●●●", "      "],
      " ": ["      ", "      ", "      ", "      ", "      ", "      "],
      "0": [" ●●●● ", "●   ●●", "●  ● ●", "●●   ●", " ●●●● ", "      "],
      "1": ["  ●●  ", " ●●●  ", "  ●●  ", "  ●●  ", "●●●●●●", "      "],
      "2": [" ●●●● ", "●    ●", "   ●● ", " ●●   ", "●●●●●●", "      "],
      "3": [" ●●●● ", "●    ●", "  ●●● ", "●    ●", " ●●●● ", "      "],
      "4": ["●    ●", "●    ●", "●●●●●●", "     ●", "     ●", "      "],
      "5": ["●●●●●●", "●     ", "●●●●● ", "     ●", "●●●●● ", "      "],
      "6": [" ●●●● ", "●     ", "●●●●● ", "●    ●", " ●●●● ", "      "],
      "7": ["●●●●●●", "     ●", "    ●●", "   ●● ", "  ●●  ", "      "],
      "8": [" ●●●● ", "●    ●", " ●●●● ", "●    ●", " ●●●● ", "      "],
      "9": [" ●●●● ", "●    ●", " ●●●●●", "     ●", " ●●●● ", "      "],
      "!": ["  ●●  ", "  ●●  ", "  ●●  ", "      ", "  ●●  ", "      "],
      "?": [" ●●●● ", "●    ●", "   ●● ", "      ", "  ●●  ", "      "],
      ".": ["      ", "      ", "      ", "      ", "  ●●  ", "      "],
      ",": ["      ", "      ", "      ", "  ●●  ", " ●●   ", "      "],
    },
  },
  shadow: {
    name: "Shadow",
    chars: {
      A: ["  ██  ", " ████ ", "██████", "██████", "██  ██", "      "],
      B: ["██████", "██████", "██████", "██████", "██████", "      "],
      C: [" █████", "██████", "██    ", "██████", " █████", "      "],
      D: ["██████", "██████", "██  ██", "██████", "██████", "      "],
      E: ["██████", "██████", "██████", "██████", "██████", "      "],
      F: ["██████", "██████", "██████", "██    ", "██    ", "      "],
      G: [" █████", "██████", "██████", "██████", " █████", "      "],
      H: ["██  ██", "██████", "██████", "██████", "██  ██", "      "],
      I: ["██████", "██████", "  ██  ", "██████", "██████", "      "],
      J: ["██████", "██████", "    ██", "██████", " █████", "      "],
      K: ["██  ██", "██████", "██████", "██████", "██  ██", "      "],
      L: ["██    ", "██    ", "██    ", "██████", "██████", "      "],
      M: ["██  ██", "██████", "██████", "██████", "██  ██", "      "],
      N: ["██  ██", "██████", "██████", "██████", "██  ██", "      "],
      O: [" █████", "██████", "██  ██", "██████", " █████", "      "],
      P: ["██████", "██████", "██████", "██    ", "██    ", "      "],
      Q: [" █████", "██████", "██████", "██████", " ██████", "      "],
      R: ["██████", "██████", "██████", "██████", "██  ██", "      "],
      S: [" █████", "██████", " █████", "██████", " █████", "      "],
      T: ["██████", "██████", "  ██  ", "  ██  ", "  ██  ", "      "],
      U: ["██  ██", "██  ██", "██  ██", "██████", " █████", "      "],
      V: ["██  ██", "██  ██", "██  ██", "██████", "  ██  ", "      "],
      W: ["██  ██", "██  ██", "██████", "██████", "██  ██", "      "],
      X: ["██  ██", "██████", "  ██  ", "██████", "██  ██", "      "],
      Y: ["██  ██", "██████", "  ██  ", "  ██  ", "  ██  ", "      "],
      Z: ["██████", "██████", "  ██  ", "██████", "██████", "      "],
      " ": ["      ", "      ", "      ", "      ", "      ", "      "],
      "0": [" █████", "██████", "██████", "██████", " █████", "      "],
      "1": ["  ██  ", "████  ", "  ██  ", "  ██  ", "██████", "      "],
      "2": [" █████", "██████", " █████", "██████", "██████", "      "],
      "3": [" █████", "██████", " █████", "██████", " █████", "      "],
      "4": ["██  ██", "██████", "██████", "    ██", "    ██", "      "],
      "5": ["██████", "██████", "█████ ", "██████", " █████", "      "],
      "6": [" █████", "██████", "██████", "██████", " █████", "      "],
      "7": ["██████", "██████", "   ██ ", "  ██  ", " ██   ", "      "],
      "8": [" █████", "██████", " █████", "██████", " █████", "      "],
      "9": [" █████", "██████", " ██████", "██████", " █████", "      "],
      "!": ["  ██  ", "  ██  ", "  ██  ", "      ", "  ██  ", "      "],
      "?": [" █████", "██████", "  ██  ", "      ", "  ██  ", "      "],
      ".": ["      ", "      ", "      ", "      ", "  ██  ", "      "],
      ",": ["      ", "      ", "      ", "  ██  ", " ██   ", "      "],
    },
  },
};

export default function AsciiArtPage() {
  const [inputText, setInputText] = useState("");
  const [selectedFont, setSelectedFont] = useState("block");
  const [asciiArt, setAsciiArt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generateAsciiArt = (text: string, fontKey: string): string => {
    if (!text.trim()) return "";

    const font = ASCII_FONTS[fontKey as keyof typeof ASCII_FONTS];
    const lines = text.toUpperCase().split("\n");
    const result: string[] = [];

    for (const line of lines) {
      const charHeight = Object.values(font.chars)[0].length;
      const artLines: string[] = Array(charHeight).fill("");

      for (const char of line) {
        const charArt =
          font.chars[char as keyof typeof font.chars] || font.chars[" "];
        for (let i = 0; i < charHeight; i++) {
          artLines[i] += charArt[i] || "      ";
        }
      }

      result.push(...artLines);
      if (lines.length > 1 && line !== lines[lines.length - 1]) {
        result.push(""); // Add empty line between text lines
      }
    }

    return result.join("\n");
  };

  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const art = generateAsciiArt(inputText, selectedFont);
      setAsciiArt(art);
      setIsProcessing(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [inputText, selectedFont]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiArt);
      alert("ASCII art copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([asciiArt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fontOptions = Object.entries(ASCII_FONTS).map(([key, font]) => ({
    value: key,
    label: font.name,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="ASCII Art Generator"
          description="Convert text to ASCII art with various font styles"
        />

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Text
              </label>
              <Input
                value={inputText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputText(e.target.value)
                }
                placeholder="Type your text here..."
                className="w-full"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Style
              </label>
              <Select
                value={selectedFont}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedFont(e.target.value)
                }
                className="w-full sm:w-48"
              >
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex gap-2 pt-6">
              <Button
                onClick={() => setInputText("HELLO")}
                variant="secondary"
                size="sm"
              >
                Example
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                disabled={!asciiArt || isProcessing}
              >
                Copy
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                disabled={!asciiArt || isProcessing}
              >
                Download
              </Button>
            </div>
          </div>
        </Card>

        {/* ASCII Art Output */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ASCII Art Output
          </h2>

          {isProcessing ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Generating ASCII art...</span>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-6 overflow-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre leading-none">
                {asciiArt || "Enter text above to generate ASCII art..."}
              </pre>
            </div>
          )}
        </Card>

        {/* Font Preview */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Font Styles Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ASCII_FONTS).map(([key, font]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {font.name}
                  </h3>
                  <Button
                    onClick={() => setSelectedFont(key)}
                    variant={selectedFont === key ? "primary" : "secondary"}
                    size="sm"
                  >
                    {selectedFont === key ? "Selected" : "Select"}
                  </Button>
                </div>
                <div className="bg-gray-900 rounded p-3 overflow-auto">
                  <pre className="text-green-400 font-mono text-xs leading-none">
                    {generateAsciiArt("ABC", key)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Fonts
            </h3>
            <p className="text-gray-600 text-sm">
              Choose from various ASCII art font styles
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Generation
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time ASCII art generation as you type
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-line Support
            </h3>
            <p className="text-gray-600 text-sm">
              Create ASCII art with multiple lines of text
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
              Easy Export
            </h3>
            <p className="text-gray-600 text-sm">
              Copy to clipboard or download ASCII art files
            </p>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mt-12 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            ASCII Art Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Perfect For
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Banner text in terminal applications</li>
                <li>• README file headers</li>
                <li>• Email signatures</li>
                <li>• Forum posts and comments</li>
                <li>• Text-based art projects</li>
                <li>• Retro-style designs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Supported Characters
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• All letters (A-Z)</li>
                <li>• Numbers (0-9)</li>
                <li>• Basic punctuation (!, ?, ., ,)</li>
                <li>• Spaces for formatting</li>
                <li>• Multi-line text support</li>
                <li>• Automatic uppercase conversion</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Tips Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            ASCII Art Tips
          </h2>
          <p className="text-blue-800 mb-4">
            ASCII art is a graphic design technique that uses printable
            characters to create images and designs. It&apos;s perfect for
            text-based environments and adds visual appeal to plain text
            content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Design Tips:</h4>
              <ul className="space-y-1">
                <li>• Keep text short for better readability</li>
                <li>• Try different fonts for various styles</li>
                <li>• Use monospace fonts when displaying</li>
                <li>• Consider your audience and context</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Test in your target environment</li>
                <li>• Avoid very long lines of text</li>
                <li>• Preview before finalizing</li>
                <li>• Save frequently used designs</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
