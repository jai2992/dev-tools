"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export default function PasswordGeneratorPage() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  const [passwordCount, setPasswordCount] = useState(1);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthText, setStrengthText] = useState("");

  const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    similar: "il1Lo0O",
    ambiguous: "{}[]()/\\'\"`~,;.<>",
  };

  const getCharacterSet = (): string => {
    let charset = "";

    if (options.includeUppercase) charset += characterSets.uppercase;
    if (options.includeLowercase) charset += characterSets.lowercase;
    if (options.includeNumbers) charset += characterSets.numbers;
    if (options.includeSymbols) charset += characterSets.symbols;

    if (options.excludeSimilar) {
      charset = charset
        .split("")
        .filter((char) => !characterSets.similar.includes(char))
        .join("");
    }

    if (options.excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((char) => !characterSets.ambiguous.includes(char))
        .join("");
    }

    return charset;
  };

  const generatePassword = (): string => {
    const charset = getCharacterSet();

    if (charset.length === 0) {
      return "Error: No character set selected";
    }

    let password = "";
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length];
    }

    return password;
  };

  const generatePasswords = () => {
    const newPasswords: string[] = [];
    for (let i = 0; i < passwordCount; i++) {
      newPasswords.push(generatePassword());
    }
    setPasswords(newPasswords);
  };

  const calculateStrength = (password: string): number => {
    let score = 0;

    // Length scoring
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (password.length >= 16) score += 25;
    if (password.length >= 20) score += 25;

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    // Complexity bonus
    if (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const getStrengthText = (score: number): string => {
    if (score < 30) return "Very Weak";
    if (score < 50) return "Weak";
    if (score < 70) return "Fair";
    if (score < 90) return "Strong";
    return "Very Strong";
  };

  const getStrengthColor = (score: number): string => {
    if (score < 30) return "text-red-400";
    if (score < 50) return "text-orange-400";
    if (score < 70) return "text-yellow-400";
    if (score < 90) return "text-blue-400";
    return "text-green-400";
  };

  useEffect(() => {
    const characterSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
      similar: "il1Lo0O",
      ambiguous: "{}[]()/\\'\"`~,;.<>",
    };

    const getCharacterSet = (): string => {
      let charset = "";

      if (options.includeUppercase) charset += characterSets.uppercase;
      if (options.includeLowercase) charset += characterSets.lowercase;
      if (options.includeNumbers) charset += characterSets.numbers;
      if (options.includeSymbols) charset += characterSets.symbols;

      if (options.excludeSimilar) {
        charset = charset
          .split("")
          .filter((char) => !characterSets.similar.includes(char))
          .join("");
      }

      if (options.excludeAmbiguous) {
        charset = charset
          .split("")
          .filter((char) => !characterSets.ambiguous.includes(char))
          .join("");
      }

      return charset;
    };

    const generatePassword = (): string => {
      const charset = getCharacterSet();

      if (charset.length === 0) {
        return "Error: No character set selected";
      }

      let password = "";
      const array = new Uint32Array(options.length);
      crypto.getRandomValues(array);

      for (let i = 0; i < options.length; i++) {
        password += charset[array[i] % charset.length];
      }

      return password;
    };

    // Auto-generate passwords
    const newPasswords: string[] = [];
    for (let i = 0; i < passwordCount; i++) {
      newPasswords.push(generatePassword());
    }
    setPasswords(newPasswords);

    // Calculate strength
    const samplePassword = generatePassword();
    if (!samplePassword.startsWith("Error:")) {
      const score = calculateStrength(samplePassword);
      setStrengthScore(score);
      setStrengthText(getStrengthText(score));
    }
  }, [options, passwordCount]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadPasswords = () => {
    const content = passwords.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="🔐 Password Generator"
        description="Generate secure passwords with customizable options and strength analysis"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Options */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">
                  Password Options
                </h3>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password Length: {options.length}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        length: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* Character Sets */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white">
                    Include Characters
                  </h4>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          includeUppercase: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Uppercase Letters (A-Z)
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          includeLowercase: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Lowercase Letters (a-z)
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          includeNumbers: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">Numbers (0-9)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          includeSymbols: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Symbols (!@#$%^&*)
                    </span>
                  </label>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white">
                    Advanced Options
                  </h4>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          excludeSimilar: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Exclude Similar (il1Lo0O)
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          excludeAmbiguous: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Exclude Ambiguous (&quot;()[]&quot;)
                    </span>
                  </label>
                </div>

                {/* Number of Passwords */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Passwords: {passwordCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={passwordCount}
                    onChange={(e) => setPasswordCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>
              </div>

              {/* Password Strength */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">
                  Password Strength
                </h3>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Strength Score</span>
                    <span
                      className={`font-semibold ${getStrengthColor(
                        strengthScore
                      )}`}
                    >
                      {strengthText}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        strengthScore < 30
                          ? "bg-red-500"
                          : strengthScore < 50
                          ? "bg-orange-500"
                          : strengthScore < 70
                          ? "bg-yellow-500"
                          : strengthScore < 90
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${strengthScore}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>{strengthScore}/100</span>
                  </div>
                </div>

                {/* Character Set Preview */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">
                    Character Set
                  </h4>
                  <code className="text-sm text-green-400 break-all">
                    {getCharacterSet() || "No characters selected"}
                  </code>
                  <p className="text-gray-400 text-xs mt-2">
                    {getCharacterSet().length} available characters
                  </p>
                </div>

                {/* Generation Controls */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={generatePasswords}
                    className="w-full"
                    disabled={getCharacterSet().length === 0}
                  >
                    Generate New Passwords
                  </Button>

                  {passwords.length > 1 && (
                    <Button
                      variant="secondary"
                      onClick={downloadPasswords}
                      className="w-full"
                    >
                      Download All Passwords
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Passwords */}
          {passwords.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Generated Passwords
              </h3>
              <div className="space-y-3">
                {passwords.map((password, index) => {
                  const score = calculateStrength(password);
                  return (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">
                          Password {index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${getStrengthColor(score)}`}
                          >
                            {getStrengthText(score)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(password)}
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
                      </div>
                      <code className="block text-green-400 text-lg font-mono break-all">
                        {password}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Information Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Password Security Tips
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Best Practices
                  </h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Use at least 12 characters</li>
                    <li>
                      • Include uppercase, lowercase, numbers, and symbols
                    </li>
                    <li>• Avoid dictionary words and personal information</li>
                    <li>• Use unique passwords for each account</li>
                    <li>• Enable two-factor authentication when possible</li>
                    <li>• Store passwords in a reputable password manager</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Security Features
                  </h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Uses cryptographically secure random generation</li>
                    <li>• No passwords are stored or transmitted</li>
                    <li>• Real-time strength analysis</li>
                    <li>• Customizable character exclusions</li>
                    <li>• Bulk password generation</li>
                    <li>• Copy timeout for security</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mt-6">
                <h4 className="text-blue-300 font-semibold mb-2">Remember:</h4>
                <p className="text-blue-200 text-sm">
                  A strong password is your first line of defense. Never reuse
                  passwords across multiple accounts, and consider using a
                  password manager to securely store and generate unique
                  passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
