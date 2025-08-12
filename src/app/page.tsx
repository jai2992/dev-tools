"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tools = [
    // Code & Development
    { name: "QR Generator", href: "/qr", icon: "🔲", category: "code", description: "Generate QR codes for URLs and text" },
    { name: "Regex Tester", href: "/regex-tester", icon: "🔍", category: "code", description: "Test and debug regular expressions" },
    { name: "Code Formatter", href: "/code-formatter", icon: "✨", category: "code", description: "Format and beautify your code" },
    { name: "Code Minifier", href: "/code-minifier", icon: "📦", category: "code", description: "Minify JavaScript, CSS, and HTML" },
    { name: "JSON Formatter", href: "/json-formatter", icon: "📋", category: "code", description: "Format and validate JSON data" },
    { name: "SQL Formatter", href: "/sql-formatter", icon: "🗄️", category: "code", description: "Format and beautify SQL queries" },
    { name: "API Formatter", href: "/api-formatter", icon: "🔌", category: "code", description: "Format API responses and requests" },
    { name: "JWT Decoder", href: "/jwt-decoder", icon: "🔐", category: "code", description: "Decode and verify JWT tokens" },

    // CSS & Design
    { name: "CSS Gradient", href: "/css-gradient", icon: "🌈", category: "design", description: "Generate beautiful CSS gradients" },
    { name: "Box Shadow", href: "/box-shadow", icon: "📦", category: "design", description: "Create CSS box shadow effects" },
    { name: "Border Radius", href: "/border-radius-generator", icon: "🔄", category: "design", description: "Generate CSS border radius" },
    { name: "Flexbox Generator", href: "/flexbox-generator", icon: "📐", category: "design", description: "Generate CSS flexbox layouts" },
    { name: "CSS Grid Generator", href: "/css-grid-generator", icon: "⚡", category: "design", description: "Generate CSS grid layouts" },
    { name: "Color Palette", href: "/color-palette", icon: "🎨", category: "design", description: "Generate color palettes" },
    { name: "Color Picker", href: "/color-picker", icon: "🎨", category: "design", description: "Pick colors from images" },

    // Images & Media
    { name: "Image Compressor", href: "/image-compressor", icon: "🗜️", category: "image", description: "Compress images to reduce file size" },
    { name: "Image Resizer", href: "/image-resizer", icon: "📏", category: "image", description: "Resize images to specific dimensions" },
    { name: "Image Converter", href: "/image-converter", icon: "🔄", category: "image", description: "Convert between image formats" },
    { name: "Image to Base64", href: "/image-to-base64", icon: "📝", category: "image", description: "Convert images to Base64 encoding" },
    { name: "Photo Filters", href: "/photo-filters", icon: "📸", category: "image", description: "Apply filters and effects to photos" },
    { name: "SVG Optimizer", href: "/svg-optimizer", icon: "⚡", category: "image", description: "Optimize and compress SVG files" },
    { name: "Meme Generator", href: "/meme-generator", icon: "😂", category: "image", description: "Create memes with custom text" },
    { name: "Barcode Generator", href: "/barcode-generator", icon: "📊", category: "image", description: "Generate various types of barcodes" },

    // Documents & PDFs
    { name: "PDF to Word", href: "/pdf-to-word", icon: "📄", category: "document", description: "Convert PDF files to Word documents" },
    { name: "PDF to Excel", href: "/pdf-to-excel", icon: "📊", category: "document", description: "Convert PDF files to Excel spreadsheets" },
    { name: "Word to PDF", href: "/word-to-pdf", icon: "📝", category: "document", description: "Convert Word documents to PDF" },
    { name: "Excel to PDF", href: "/excel-to-pdf", icon: "📈", category: "document", description: "Convert Excel spreadsheets to PDF" },
    { name: "PowerPoint to PDF", href: "/powerpoint-to-pdf", icon: "📊", category: "document", description: "Convert PowerPoint presentations to PDF" },
    { name: "PDF Merge & Split", href: "/pdf-merge-split", icon: "🔗", category: "document", description: "Merge multiple PDFs or split into pages" },
    { name: "PDF Compressor", href: "/pdf-compressor", icon: "🗜️", category: "document", description: "Compress PDF files to reduce size" },
    { name: "PDF Extract Pages", href: "/pdf-extract-pages", icon: "📑", category: "document", description: "Extract specific pages from PDF files" },
    { name: "PDF Unlock", href: "/pdf-unlock", icon: "🔓", category: "document", description: "Remove password protection from PDFs" },
    { name: "Document Viewer", href: "/document-viewer", icon: "👁️", category: "document", description: "View various document formats online" },
    { name: "Document Metadata", href: "/document-metadata", icon: "📋", category: "document", description: "View and edit document metadata" },
    { name: "E-book Converter", href: "/ebook-converter", icon: "📚", category: "document", description: "Convert between e-book formats" },
    { name: "OCR Text Extraction", href: "/ocr-text-extraction", icon: "🔍", category: "document", description: "Extract text from images using OCR" },

    // Text Processing
    { name: "Case Converter", href: "/case-converter", icon: "🔤", category: "text", description: "Convert text between different cases" },
    { name: "Text Counter", href: "/text-counter", icon: "📊", category: "text", description: "Count words, characters, and lines" },
    { name: "Text Diff", href: "/text-diff", icon: "🔍", category: "text", description: "Compare and find differences between texts" },
    { name: "Remove Duplicates", href: "/remove-duplicates", icon: "🧹", category: "text", description: "Remove duplicate lines from text" },
    { name: "Lorem Ipsum", href: "/lorem-ipsum", icon: "📝", category: "text", description: "Generate placeholder Lorem Ipsum text" },
    { name: "ASCII Art", href: "/ascii-art", icon: "🎨", category: "text", description: "Generate ASCII art from text" },
    { name: "Markdown to HTML", href: "/markdown-to-html", icon: "📄", category: "text", description: "Convert Markdown to HTML" },
    { name: "HTML to Markdown", href: "/html-to-markdown", icon: "📝", category: "text", description: "Convert HTML to Markdown" },

    // Converters & Encoders
    { name: "Base64 Encoder", href: "/base64", icon: "🔐", category: "converter", description: "Encode and decode Base64 strings" },
    { name: "URL Encoder", href: "/url-encoder", icon: "🔗", category: "converter", description: "Encode and decode URLs" },
    { name: "CSV to JSON", href: "/csv-to-json", icon: "📊", category: "converter", description: "Convert CSV data to JSON format" },
    { name: "Timestamp Converter", href: "/timestamp-converter", icon: "⏰", category: "converter", description: "Convert between timestamp formats" },

    // Security & Generators
    { name: "Password Generator", href: "/password-generator", icon: "🔑", category: "security", description: "Generate secure passwords" },
    { name: "Hash Generator", href: "/hash-generator", icon: "🔒", category: "security", description: "Generate MD5, SHA1, SHA256 hashes" },
    { name: "Favicon Generator", href: "/favicon-generator", icon: "🌟", category: "security", description: "Generate favicons for websites" },
    { name: "Meta Tags", href: "/meta-tags", icon: "🏷️", category: "security", description: "Generate SEO meta tags" },
    { name: "Mock Data", href: "/mock-data", icon: "📊", category: "security", description: "Generate mock data for testing" },
    { name: ".htaccess Generator", href: "/htaccess-generator", icon: "⚙️", category: "security", description: "Generate Apache .htaccess configurations" }
  ];

  const categories = [
    { id: "all", name: "All Tools", count: tools.length },
    { id: "code", name: "Code & Dev", count: tools.filter(t => t.category === "code").length },
    { id: "design", name: "CSS & Design", count: tools.filter(t => t.category === "design").length },
    { id: "image", name: "Images", count: tools.filter(t => t.category === "image").length },
    { id: "document", name: "Documents", count: tools.filter(t => t.category === "document").length },
    { id: "text", name: "Text", count: tools.filter(t => t.category === "text").length },
    { id: "converter", name: "Converters", count: tools.filter(t => t.category === "converter").length },
    { id: "security", name: "Security", count: tools.filter(t => t.category === "security").length }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
      ? "bg-black text-white"
      : "bg-white text-black"
      }`}>
      {/* Header */}
      <header className={`text-center py-12 px-4 border-b transition-colors ${isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className={`text-4xl md:text-6xl font-black mb-4 ${isDarkMode ? "text-white" : "text-black"
                }`}>
                DevTools
              </h1>
              <p className={`text-lg md:text-xl ${isDarkMode ? "text-gray-500" : "text-gray-600"
                }`}>
                {tools.length}+ tools for developers and creators
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all ${isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-black"
                  }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.id
                ? "bg-blue-600 text-white shadow-lg"
                : isDarkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:shadow-md"
                  : "bg-white text-black border border-gray-300 hover:border-gray-400 hover:shadow-md"
                }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className={`group block rounded-lg border transition-all duration-200 hover:shadow-lg ${isDarkMode
                ? "bg-gray-900 border-gray-800 hover:border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-500"
                }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <h3 className={`text-lg font-semibold group-hover:text-blue-600 transition-colors ${isDarkMode ? "text-white" : "text-black"
                    }`}>
                    {tool.name}
                  </h3>
                </div>
                <p className={`text-sm transition-colors ${isDarkMode
                  ? "text-gray-400 group-hover:text-gray-300"
                  : "text-gray-600 group-hover:text-gray-700"
                  }`}>
                  {tool.description}
                </p>
                <div className={`mt-4 flex items-center transition-colors group-hover:text-blue-600 ${isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}>
                  <span className="text-xs">Open tool</span>
                  <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"
              }`}>No tools found</h3>
            <p className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className={`text-center mt-20 pt-12 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}>
          <p className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
            Built for developers, by developers • {tools.length} tools available
          </p>
        </footer>
      </main>
    </div>
  );
}
