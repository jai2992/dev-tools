import LandingCard from "./components/card/LandingCard";
export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen font-bold text-white bg-black items-center ">
      <div className="px-4 pt-4 text-2xl sm:text-5xl text-blue-400 font-black ">
        DEVTOOLS.SOFTWARE
      </div>
      <div className="text-sm sm:text-xl text-semibold pt-2">
        Your One-Stop Free Toolkit for Modern Developers & Document Processing!
      </div>
      <div className="text-xs sm:text-sm pt-2">
        Code tools, document converters, and more - all for free...
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-w-6xl mx-auto">
        {/* Existing Tools */}
        <a href="/qr">
          <LandingCard>🔲 QR Generator</LandingCard>
        </a>
        <a href="/json_validator">
          <LandingCard>📋 JSON Validator</LandingCard>
        </a>

        {/* Code Development Tools */}
        <a href="/regex-tester">
          <LandingCard>🔍 Regex Tester</LandingCard>
        </a>
        <a href="/code-formatter">
          <LandingCard>✨ Code Formatter</LandingCard>
        </a>
        <a href="/code-minifier">
          <LandingCard>📦 Code Minifier</LandingCard>
        </a>
        <a href="/css-gradient-generator">
          <LandingCard>🌈 CSS Gradient</LandingCard>
        </a>
        <a href="/color-palette-generator">
          <LandingCard>🎨 Color Palette</LandingCard>
        </a>
        <a href="/meta-tag-generator">
          <LandingCard>🏷️ Meta Tags</LandingCard>
        </a>
        <a href="/box-shadow-generator">
          <LandingCard>📦 Box Shadow</LandingCard>
        </a>
        <a href="/favicon-generator">
          <LandingCard>🌟 Favicon Generator</LandingCard>
        </a>
        <a href="/border-radius-generator">
          <LandingCard>🔄 Border Radius</LandingCard>
        </a>
        <a href="/flexbox-generator">
          <LandingCard>📐 Flexbox Layout</LandingCard>
        </a>
        <a href="/css-grid-generator">
          <LandingCard>⚡ CSS Grid</LandingCard>
        </a>
        <a href="/htaccess-generator">
          <LandingCard>⚙️ .htaccess Config</LandingCard>
        </a>

        {/* Document Processing Tools */}
        <a href="/pdf-to-word">
          <LandingCard>📄 PDF to Word</LandingCard>
        </a>
        <a href="/pdf-to-excel">
          <LandingCard>📊 PDF to Excel</LandingCard>
        </a>
        <a href="/word-to-pdf">
          <LandingCard>📝 Word to PDF</LandingCard>
        </a>
        <a href="/excel-to-pdf">
          <LandingCard>📈 Excel to PDF</LandingCard>
        </a>
        <a href="/powerpoint-to-pdf">
          <LandingCard>📊 PowerPoint to PDF</LandingCard>
        </a>
        <a href="/pdf-merge-split">
          <LandingCard>🔗 PDF Merge & Split</LandingCard>
        </a>
        <a href="/pdf-compressor">
          <LandingCard>🗜️ PDF Compressor</LandingCard>
        </a>
        <a href="/pdf-extract-pages">
          <LandingCard>📑 PDF Page Extractor</LandingCard>
        </a>
        <a href="/pdf-unlock">
          <LandingCard>🔓 PDF Password Remover</LandingCard>
        </a>
        <a href="/ocr-text-extraction">
          <LandingCard>🔍 OCR Text Extraction</LandingCard>
        </a>
        <a href="/document-viewer">
          <LandingCard>👁️ Document Viewer</LandingCard>
        </a>
        <a href="/ebook-converter">
          <LandingCard>📚 E-book Converter</LandingCard>
        </a>
        <a href="/document-metadata">
          <LandingCard>📋 Document Metadata</LandingCard>
        </a>

        {/* Text & Document Processing Tools */}
        <a href="/url-encoder">
          <LandingCard>🔗 URL Encoder/Decoder</LandingCard>
        </a>
        <a href="/base64">
          <LandingCard>🔐 Base64 Encoder/Decoder</LandingCard>
        </a>
        <a href="/hash-generator">
          <LandingCard>🔒 Hash Generator</LandingCard>
        </a>
        <a href="/password-generator">
          <LandingCard>🔑 Password Generator</LandingCard>
        </a>
        <a href="/case-converter">
          <LandingCard>🔤 Case Converter</LandingCard>
        </a>
        <a href="/text-counter">
          <LandingCard>📊 Text Counter</LandingCard>
        </a>
        <a href="/lorem-ipsum">
          <LandingCard>📝 Lorem Ipsum Generator</LandingCard>
        </a>
        <a href="/markdown-to-html">
          <LandingCard>📄 Markdown to HTML</LandingCard>
        </a>
        <a href="/html-to-markdown">
          <LandingCard>📝 HTML to Markdown</LandingCard>
        </a>
        <a href="/text-diff">
          <LandingCard>🔍 Text Diff Checker</LandingCard>
        </a>
        <a href="/remove-duplicates">
          <LandingCard>🧹 Duplicate Line Remover</LandingCard>
        </a>
        <a href="/ascii-art">
          <LandingCard>🎨 ASCII Art Generator</LandingCard>
        </a>
      </div>
    </div>
  );
}
