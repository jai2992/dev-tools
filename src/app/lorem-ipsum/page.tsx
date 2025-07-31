"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";

type GenerationType = "words" | "sentences" | "paragraphs";
type LoremType = "classic" | "hipster" | "corporate" | "tech" | "food";

export default function LoremIpsumPage() {
  const [generationType, setGenerationType] =
    useState<GenerationType>("paragraphs");
  const [count, setCount] = useState(3);
  const [loremType, setLoremType] = useState<LoremType>("classic");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [htmlTags, setHtmlTags] = useState<string[]>(["p"]);
  const [generatedText, setGeneratedText] = useState("");

  const loremSets = {
    classic: [
      "lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
      "aliqua",
      "enim",
      "ad",
      "minim",
      "veniam",
      "quis",
      "nostrud",
      "exercitation",
      "ullamco",
      "laboris",
      "nisi",
      "aliquip",
      "ex",
      "ea",
      "commodo",
      "consequat",
      "duis",
      "aute",
      "irure",
      "in",
      "reprehenderit",
      "voluptate",
      "velit",
      "esse",
      "cillum",
      "fugiat",
      "nulla",
      "pariatur",
      "excepteur",
      "sint",
      "occaecat",
      "cupidatat",
      "non",
      "proident",
      "sunt",
      "culpa",
      "qui",
      "officia",
      "deserunt",
      "mollit",
      "anim",
      "id",
      "est",
      "laborum",
      "at",
      "vero",
      "eos",
      "accusamus",
      "accusantium",
      "doloremque",
      "laudantium",
      "totam",
      "rem",
      "aperiam",
      "eaque",
      "ipsa",
      "quae",
      "ab",
      "illo",
      "inventore",
      "veritatis",
      "et",
      "quasi",
      "architecto",
      "beatae",
      "vitae",
      "dicta",
      "sunt",
      "explicabo",
      "nemo",
      "enim",
      "ipsam",
      "voluptatem",
      "quia",
      "voluptas",
      "aspernatur",
      "aut",
      "odit",
      "fugit",
      "sed",
      "quia",
      "consequuntur",
      "magni",
      "dolores",
      "ratione",
      "voluptatem",
      "sequi",
      "nesciunt",
      "neque",
      "porro",
      "quisquam",
      "est",
      "qui",
      "dolorem",
    ],
    hipster: [
      "artisan",
      "craft",
      "beer",
      "organic",
      "sustainable",
      "local",
      "farm-to-table",
      "vinyl",
      "fixie",
      "bicycle",
      "mustache",
      "beard",
      "flannel",
      "brooklyn",
      "portland",
      "austin",
      "kale",
      "quinoa",
      "kombucha",
      "matcha",
      "avocado",
      "toast",
      "cold-pressed",
      "juice",
      "mason",
      "jar",
      "reclaimed",
      "wood",
      "vintage",
      "retro",
      "authentic",
      "handcrafted",
      "small-batch",
      "rooftop",
      "garden",
      "meditation",
      "yoga",
      "chakras",
      "cleanse",
      "detox",
      "mindfulness",
      "wanderlust",
      "adventure",
      "explore",
      "discover",
      "journey",
      "experience",
      "creative",
      "inspire",
      "passion",
      "dream",
      "vision",
      "purpose",
      "meaning",
      "connection",
    ],
    corporate: [
      "synergy",
      "leverage",
      "optimize",
      "streamline",
      "maximize",
      "strategic",
      "innovative",
      "solution",
      "paradigm",
      "framework",
      "methodology",
      "scalable",
      "sustainable",
      "robust",
      "comprehensive",
      "integrated",
      "dynamic",
      "proactive",
      "collaborative",
      "efficient",
      "effective",
      "performance",
      "metrics",
      "analytics",
      "insights",
      "intelligence",
      "data-driven",
      "customer-centric",
      "value-added",
      "best-practice",
      "world-class",
      "cutting-edge",
      "next-generation",
      "mission-critical",
      "game-changing",
      "disruptive",
      "transformation",
      "digital",
      "agile",
      "workflow",
      "process",
      "implementation",
      "deployment",
      "rollout",
      "adoption",
      "engagement",
    ],
    tech: [
      "algorithm",
      "blockchain",
      "artificial",
      "intelligence",
      "machine",
      "learning",
      "neural",
      "network",
      "cloud",
      "computing",
      "microservices",
      "container",
      "kubernetes",
      "docker",
      "devops",
      "continuous",
      "integration",
      "deployment",
      "scalability",
      "performance",
      "latency",
      "throughput",
      "bandwidth",
      "optimization",
      "caching",
      "database",
      "api",
      "microservice",
      "serverless",
      "edge",
      "computing",
      "quantum",
      "cryptography",
      "cybersecurity",
      "encryption",
      "decryption",
      "authentication",
      "authorization",
      "oauth",
      "jwt",
      "rest",
      "graphql",
      "json",
      "xml",
      "yaml",
      "configuration",
      "environment",
      "variable",
      "dependency",
      "package",
      "module",
    ],
    food: [
      "artisanal",
      "gourmet",
      "organic",
      "free-range",
      "grass-fed",
      "locally-sourced",
      "seasonal",
      "fresh",
      "crisp",
      "tender",
      "succulent",
      "flavorful",
      "aromatic",
      "savory",
      "sweet",
      "spicy",
      "tangy",
      "zesty",
      "rich",
      "creamy",
      "smooth",
      "velvety",
      "buttery",
      "caramelized",
      "roasted",
      "grilled",
      "sautéed",
      "braised",
      "poached",
      "steamed",
      "blanched",
      "marinated",
      "seasoned",
      "herb-crusted",
      "wine-infused",
      "truffle",
      "saffron",
      "vanilla",
      "chocolate",
      "pistachio",
      "almond",
      "walnut",
      "pecan",
      "hazelnut",
      "coconut",
      "citrus",
      "berry",
      "stone-fruit",
      "heirloom",
      "heritage",
      "traditional",
      "contemporary",
      "fusion",
      "molecular",
    ],
  };

  const htmlTagOptions = [
    { value: "p", label: "Paragraphs <p>" },
    { value: "div", label: "Divisions <div>" },
    { value: "span", label: "Spans <span>" },
    { value: "h1", label: "Heading 1 <h1>" },
    { value: "h2", label: "Heading 2 <h2>" },
    { value: "h3", label: "Heading 3 <h3>" },
    { value: "li", label: "List Items <li>" },
    { value: "blockquote", label: "Blockquotes <blockquote>" },
  ];

  const getRandomWord = (wordSet: string[]): string => {
    return wordSet[Math.floor(Math.random() * wordSet.length)];
  };

  const generateSentence = (
    wordSet: string[],
    minWords = 8,
    maxWords = 20
  ): string => {
    const wordCount =
      Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord(wordSet));
    }

    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    return words.join(" ") + ".";
  };

  const generateParagraph = (wordSet: string[], sentenceCount = 5): string => {
    const sentences: string[] = [];

    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(wordSet));
    }

    return sentences.join(" ");
  };

  const generateWords = (wordSet: string[], wordCount: number): string => {
    const words: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord(wordSet));
    }

    return words.join(" ");
  };

  const generateText = (): string => {
    const wordSet = loremSets[loremType];
    let result = "";

    if (generationType === "words") {
      result = generateWords(wordSet, count);
      if (startWithLorem && loremType === "classic") {
        const loremStart = "Lorem ipsum dolor sit amet";
        const remainingWords = Math.max(0, count - 5);
        if (remainingWords > 0) {
          result = loremStart + " " + generateWords(wordSet, remainingWords);
        } else {
          result = loremStart.split(" ").slice(0, count).join(" ");
        }
      }
    } else if (generationType === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(wordSet));
      }
      result = sentences.join(" ");

      if (startWithLorem && loremType === "classic") {
        sentences[0] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        result = sentences.join(" ");
      }
    } else if (generationType === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
        paragraphs.push(generateParagraph(wordSet, sentenceCount));
      }
      result = paragraphs.join("\n\n");

      if (startWithLorem && loremType === "classic") {
        paragraphs[0] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
          paragraphs[0].substring(paragraphs[0].indexOf(".") + 2);
        result = paragraphs.join("\n\n");
      }
    }

    // Add HTML tags if requested
    if (includeHtml) {
      const tag = htmlTags[0] || "p";
      if (generationType === "paragraphs") {
        result = result
          .split("\n\n")
          .map((para) => `<${tag}>${para}</${tag}>`)
          .join("\n\n");
      } else {
        result = `<${tag}>${result}</${tag}>`;
      }
    }

    return result;
  };

  const handleGenerate = () => {
    setGeneratedText(generateText());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorem-ipsum-${generationType}-${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader
        title="📝 Lorem Ipsum Generator"
        description="Generate placeholder text for design and development projects"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tool Interface */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Options Panel */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Options</h3>

                {/* Generation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Generate
                  </label>
                  <div className="space-y-2">
                    {(
                      ["words", "sentences", "paragraphs"] as GenerationType[]
                    ).map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          value={type}
                          checked={generationType === type}
                          onChange={(e) =>
                            setGenerationType(e.target.value as GenerationType)
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-300 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of {generationType}: {count}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={
                      generationType === "words"
                        ? 100
                        : generationType === "sentences"
                        ? 20
                        : 10
                    }
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>
                      {generationType === "words"
                        ? 100
                        : generationType === "sentences"
                        ? 20
                        : 10}
                    </span>
                  </div>
                </div>

                {/* Lorem Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Style
                  </label>
                  <div className="space-y-2">
                    {Object.keys(loremSets).map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          value={type}
                          checked={loremType === (type as LoremType)}
                          onChange={(e) =>
                            setLoremType(e.target.value as LoremType)
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-300 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white">
                    Advanced Options
                  </h4>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      disabled={loremType !== "classic"}
                    />
                    <span className="ml-3 text-gray-300">
                      Start with &quot;Lorem ipsum&quot;
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeHtml}
                      onChange={(e) => setIncludeHtml(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300">
                      Wrap in HTML tags
                    </span>
                  </label>

                  {includeHtml && (
                    <div className="ml-7">
                      <label className="block text-sm text-gray-400 mb-2">
                        HTML Tag:
                      </label>
                      <select
                        value={htmlTags[0] || "p"}
                        onChange={(e) => setHtmlTags([e.target.value])}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2"
                      >
                        {htmlTagOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  className="w-full"
                >
                  Generate Lorem Ipsum
                </Button>
              </div>

              {/* Generated Text Display */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Generated Text
                  </h3>
                  {generatedText && (
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
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
                      <button
                        onClick={downloadText}
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-96">
                  {generatedText ? (
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedText}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p>
                          Click &quot;Generate Lorem Ipsum&quot; to create
                          placeholder text
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              About Lorem Ipsum
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    What is Lorem Ipsum?
                  </h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. It has been the industry&apos;s
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>

                  <h4 className="text-lg font-semibold text-white mb-3">
                    Why Use Lorem Ipsum?
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Focuses attention on design rather than content</li>
                    <li>• Standard placeholder text since the 1500s</li>
                    <li>
                      • Prevents distraction from layout and visual elements
                    </li>
                    <li>• Widely recognized by designers and developers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Text Varieties
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h5 className="text-blue-400 font-medium">
                        Classic Lorem
                      </h5>
                      <p className="text-gray-300">
                        Traditional Latin-based placeholder text
                      </p>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-medium">
                        Hipster Ipsum
                      </h5>
                      <p className="text-gray-300">
                        Modern, trendy alternative with contemporary terms
                      </p>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-medium">
                        Corporate Ipsum
                      </h5>
                      <p className="text-gray-300">
                        Business jargon for professional mockups
                      </p>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-medium">Tech Ipsum</h5>
                      <p className="text-gray-300">
                        Technology-focused terms for tech projects
                      </p>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-medium">Food Ipsum</h5>
                      <p className="text-gray-300">
                        Culinary terms for food and restaurant websites
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 mt-6">
                <h4 className="text-purple-300 font-semibold mb-2">Pro Tip:</h4>
                <p className="text-purple-200 text-sm">
                  Use different Lorem Ipsum variants to match your
                  project&apos;s theme. Corporate ipsum works great for business
                  websites, while tech ipsum is perfect for software
                  documentation and apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
