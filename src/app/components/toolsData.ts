export interface Tool {
  id: string;
  name: string;
  href: string;
  icon: string;
  category: string;
  description: string;
  tags: string[];
}

export const toolsData: Tool[] = [
  // Code Development Tools
  {
    id: "qr",
    name: "QR Generator",
    href: "/qr",
    icon: "🔲",
    category: "code",
    description: "Generate QR codes for URLs, text, and more",
    tags: ["qr", "generator", "code", "barcode"]
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    href: "/json_validator",
    icon: "📋",
    category: "code",
    description: "Validate and format JSON data",
    tags: ["json", "validator", "format", "lint"]
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    href: "/regex-tester",
    icon: "🔍",
    category: "code",
    description: "Test and debug regular expressions",
    tags: ["regex", "test", "pattern", "match"]
  },
  {
    id: "code-formatter",
    name: "Code Formatter",
    href: "/code-formatter",
    icon: "✨",
    category: "code",
    description: "Format and beautify your code",
    tags: ["format", "beautify", "pretty", "clean"]
  },
  {
    id: "code-minifier",
    name: "Code Minifier",
    href: "/code-minifier",
    icon: "📦",
    category: "code",
    description: "Minify JavaScript, CSS, and HTML",
    tags: ["minify", "compress", "optimize", "reduce"]
  },
  {
    id: "css-gradient",
    name: "CSS Gradient",
    href: "/css-gradient",
    icon: "🌈",
    category: "code",
    description: "Generate beautiful CSS gradients",
    tags: ["css", "gradient", "color", "background"]
  },
  {
    id: "color-palette",
    name: "Color Palette",
    href: "/color-palette",
    icon: "🎨",
    category: "code",
    description: "Generate color palettes for your projects",
    tags: ["color", "palette", "theme", "design"]
  },
  {
    id: "meta-tags",
    name: "Meta Tags",
    href: "/meta-tags",
    icon: "🏷️",
    category: "code",
    description: "Generate SEO meta tags",
    tags: ["meta", "seo", "tags", "html"]
  },
  {
    id: "box-shadow",
    name: "Box Shadow",
    href: "/box-shadow",
    icon: "📦",
    category: "code",
    description: "Create CSS box shadow effects",
    tags: ["css", "shadow", "effect", "style"]
  },
  {
    id: "favicon-generator",
    name: "Favicon Generator",
    href: "/favicon-generator",
    icon: "🌟",
    category: "code",
    description: "Generate favicons for websites",
    tags: ["favicon", "icon", "website", "generate"]
  },
  {
    id: "border-radius",
    name: "Border Radius",
    href: "/border-radius-generator",
    icon: "🔄",
    category: "code",
    description: "Generate CSS border radius",
    tags: ["css", "border", "radius", "round"]
  },
  {
    id: "flexbox",
    name: "Flexbox Layout",
    href: "/flexbox-generator",
    icon: "📐",
    category: "code",
    description: "Generate CSS flexbox layouts",
    tags: ["css", "flexbox", "layout", "grid"]
  },
  {
    id: "css-grid",
    name: "CSS Grid",
    href: "/css-grid-generator",
    icon: "⚡",
    category: "code",
    description: "Generate CSS grid layouts",
    tags: ["css", "grid", "layout", "design"]
  },
  {
    id: "htaccess",
    name: ".htaccess Config",
    href: "/htaccess-generator",
    icon: "⚙️",
    category: "code",
    description: "Generate Apache .htaccess configurations",
    tags: ["htaccess", "apache", "config", "server"]
  },

  // Image & Media Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    href: "/image-compressor",
    icon: "🗜️",
    category: "image",
    description: "Compress images to reduce file size",
    tags: ["image", "compress", "optimize", "size"]
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    href: "/image-resizer",
    icon: "📏",
    category: "image",
    description: "Resize images to specific dimensions",
    tags: ["image", "resize", "dimensions", "scale"]
  },
  {
    id: "image-converter",
    name: "Image Converter",
    href: "/image-converter",
    icon: "🔄",
    category: "image",
    description: "Convert between image formats",
    tags: ["image", "convert", "format", "jpg", "png"]
  },
  {
    id: "color-picker",
    name: "Color Picker",
    href: "/color-picker",
    icon: "🎨",
    category: "image",
    description: "Pick colors from images or generate palettes",
    tags: ["color", "picker", "palette", "hex"]
  },
  {
    id: "image-to-base64",
    name: "Image to Base64",
    href: "/image-to-base64",
    icon: "📝",
    category: "image",
    description: "Convert images to Base64 encoding",
    tags: ["image", "base64", "encode", "data"]
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    href: "/barcode-generator",
    icon: "📊",
    category: "image",
    description: "Generate various types of barcodes",
    tags: ["barcode", "generate", "code", "scan"]
  },
  {
    id: "photo-filters",
    name: "Photo Filters",
    href: "/photo-filters",
    icon: "📸",
    category: "image",
    description: "Apply filters and effects to photos",
    tags: ["photo", "filter", "effect", "edit"]
  },
  {
    id: "svg-optimizer",
    name: "SVG Optimizer",
    href: "/svg-optimizer",
    icon: "⚡",
    category: "image",
    description: "Optimize and compress SVG files",
    tags: ["svg", "optimize", "compress", "vector"]
  },
  {
    id: "meme-generator",
    name: "Meme Generator",
    href: "/meme-generator",
    icon: "😂",
    category: "image",
    description: "Create memes with custom text",
    tags: ["meme", "generate", "funny", "text"]
  },

  // Document Processing Tools
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    href: "/pdf-to-word",
    icon: "📄",
    category: "document",
    description: "Convert PDF files to Word documents",
    tags: ["pdf", "word", "convert", "doc"]
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    href: "/pdf-to-excel",
    icon: "📊",
    category: "document",
    description: "Convert PDF files to Excel spreadsheets",
    tags: ["pdf", "excel", "convert", "xlsx"]
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    href: "/word-to-pdf",
    icon: "📝",
    category: "document",
    description: "Convert Word documents to PDF",
    tags: ["word", "pdf", "convert", "doc"]
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    href: "/excel-to-pdf",
    icon: "📈",
    category: "document",
    description: "Convert Excel spreadsheets to PDF",
    tags: ["excel", "pdf", "convert", "xlsx"]
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    href: "/powerpoint-to-pdf",
    icon: "📊",
    category: "document",
    description: "Convert PowerPoint presentations to PDF",
    tags: ["powerpoint", "pdf", "convert", "ppt"]
  },
  {
    id: "pdf-merge-split",
    name: "PDF Merge & Split",
    href: "/pdf-merge-split",
    icon: "🔗",
    category: "document",
    description: "Merge multiple PDFs or split into pages",
    tags: ["pdf", "merge", "split", "combine"]
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    href: "/pdf-compressor",
    icon: "🗜️",
    category: "document",
    description: "Compress PDF files to reduce size",
    tags: ["pdf", "compress", "optimize", "size"]
  },
  {
    id: "pdf-extract-pages",
    name: "PDF Page Extractor",
    href: "/pdf-extract-pages",
    icon: "📑",
    category: "document",
    description: "Extract specific pages from PDF files",
    tags: ["pdf", "extract", "pages", "split"]
  },
  {
    id: "pdf-unlock",
    name: "PDF Password Remover",
    href: "/pdf-unlock",
    icon: "🔓",
    category: "document",
    description: "Remove password protection from PDFs",
    tags: ["pdf", "unlock", "password", "remove"]
  },
  {
    id: "ocr-text-extraction",
    name: "OCR Text Extraction",
    href: "/ocr-text-extraction",
    icon: "🔍",
    category: "document",
    description: "Extract text from images using OCR",
    tags: ["ocr", "text", "extract", "image"]
  },
  {
    id: "document-viewer",
    name: "Document Viewer",
    href: "/document-viewer",
    icon: "👁️",
    category: "document",
    description: "View various document formats online",
    tags: ["document", "viewer", "preview", "read"]
  },
  {
    id: "ebook-converter",
    name: "E-book Converter",
    href: "/ebook-converter",
    icon: "📚",
    category: "document",
    description: "Convert between e-book formats",
    tags: ["ebook", "convert", "epub", "mobi"]
  },
  {
    id: "document-metadata",
    name: "Document Metadata",
    href: "/document-metadata",
    icon: "📋",
    category: "document",
    description: "View and edit document metadata",
    tags: ["document", "metadata", "properties", "info"]
  },

  // Text Processing Tools
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    href: "/url-encoder",
    icon: "🔗",
    category: "text",
    description: "Encode and decode URLs",
    tags: ["url", "encode", "decode", "percent"]
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    href: "/base64",
    icon: "🔐",
    category: "text",
    description: "Encode and decode Base64 strings",
    tags: ["base64", "encode", "decode", "string"]
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    href: "/hash-generator",
    icon: "🔒",
    category: "security",
    description: "Generate MD5, SHA1, SHA256 hashes",
    tags: ["hash", "md5", "sha", "checksum"]
  },
  {
    id: "password-generator",
    name: "Password Generator",
    href: "/password-generator",
    icon: "🔑",
    category: "security",
    description: "Generate secure passwords",
    tags: ["password", "generate", "secure", "random"]
  },
  {
    id: "case-converter",
    name: "Case Converter",
    href: "/case-converter",
    icon: "🔤",
    category: "text",
    description: "Convert text between different cases",
    tags: ["case", "convert", "upper", "lower", "camel"]
  },
  {
    id: "text-counter",
    name: "Text Counter",
    href: "/text-counter",
    icon: "📊",
    category: "text",
    description: "Count words, characters, and lines",
    tags: ["text", "count", "words", "characters"]
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    href: "/lorem-ipsum",
    icon: "📝",
    category: "text",
    description: "Generate placeholder Lorem Ipsum text",
    tags: ["lorem", "ipsum", "placeholder", "text"]
  },
  {
    id: "markdown-to-html",
    name: "Markdown to HTML",
    href: "/markdown-to-html",
    icon: "📄",
    category: "text",
    description: "Convert Markdown to HTML",
    tags: ["markdown", "html", "convert", "md"]
  },
  {
    id: "html-to-markdown",
    name: "HTML to Markdown",
    href: "/html-to-markdown",
    icon: "📝",
    category: "text",
    description: "Convert HTML to Markdown",
    tags: ["html", "markdown", "convert", "md"]
  },
  {
    id: "text-diff",
    name: "Text Diff Checker",
    href: "/text-diff",
    icon: "🔍",
    category: "text",
    description: "Compare and find differences between texts",
    tags: ["text", "diff", "compare", "difference"]
  },
  {
    id: "remove-duplicates",
    name: "Duplicate Line Remover",
    href: "/remove-duplicates",
    icon: "🧹",
    category: "text",
    description: "Remove duplicate lines from text",
    tags: ["duplicate", "remove", "lines", "clean"]
  },
  {
    id: "ascii-art",
    name: "ASCII Art Generator",
    href: "/ascii-art",
    icon: "🎨",
    category: "text",
    description: "Generate ASCII art from text",
    tags: ["ascii", "art", "text", "generate"]
  }
];

export const getToolsByCategory = (category: string): Tool[] => {
  if (category === "all") return toolsData;
  return toolsData.filter(tool => tool.category === category);
};

export const searchTools = (query: string): Tool[] => {
  if (!query) return toolsData;
  
  const lowercaseQuery = query.toLowerCase();
  return toolsData.filter(tool =>
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
