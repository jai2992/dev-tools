"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

export default function MarkdownToHtmlPage() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("code");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple markdown to HTML converter
  const convertMarkdownToHtml = (md: string): string => {
    if (!md.trim()) return "";

    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.*?)_/g, "<em>$1</em>");

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || "text";
      return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" />'
    );

    // Lists
    html = html.replace(/^[\s]*\* (.+)$/gm, "<li>$1</li>");
    html = html.replace(/^[\s]*- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/^[\s]*\+ (.+)$/gm, "<li>$1</li>");

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/g, (match) => {
      return `<ul>${match}</ul>`;
    });

    // Clean up multiple ul tags
    html = html.replace(/<\/ul>\s*<ul>/g, "");

    // Numbered lists
    html = html.replace(/^[\s]*\d+\. (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/g, (match) => {
      if (match.includes("<ul>")) return match;
      return `<ol>${match}</ol>`;
    });
    html = html.replace(/<\/ol>\s*<ol>/g, "");

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

    // Horizontal rules
    html = html.replace(/^---$/gm, "<hr>");
    html = html.replace(/^\*\*\*$/gm, "<hr>");

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    // Wrap in paragraphs
    if (html && !html.startsWith("<")) {
      html = `<p>${html}</p>`;
    }

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, "");
    html = html.replace(/<p><h/g, "<h");
    html = html.replace(/<\/h([1-6])><\/p>/g, "</h$1>");

    return html;
  };

  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const converted = convertMarkdownToHtml(markdown);
      setHtml(converted);
      setIsProcessing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      alert("HTML copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exampleMarkdown = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text** and *italic text*.

Here's a [link to Google](https://google.com) and some \`inline code\`.

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

> This is a blockquote

---

![Alt text](https://via.placeholder.com/150)`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Markdown to HTML Converter"
          description="Convert Markdown text to HTML with live preview"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Markdown Input
              </h2>
              <Button
                onClick={() => setMarkdown(exampleMarkdown)}
                variant="secondary"
                size="sm"
              >
                Load Example
              </Button>
            </div>

            <Textarea
              value={markdown}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMarkdown(e.target.value)
              }
              placeholder="Enter your Markdown text here..."
              rows={20}
              className="font-mono text-sm"
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                HTML Output
              </h2>
              <div className="flex gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode("code")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      previewMode === "code"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setPreviewMode("preview")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      previewMode === "preview"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  disabled={!html || isProcessing}
                >
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  disabled={!html || isProcessing}
                >
                  Download
                </Button>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">Converting...</span>
              </div>
            ) : (
              <div className="min-h-96">
                {previewMode === "code" ? (
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                    {html || "HTML output will appear here..."}
                  </pre>
                ) : (
                  <div
                    className="prose prose-gray max-w-none p-4 border rounded-lg bg-white min-h-96"
                    dangerouslySetInnerHTML={{
                      __html:
                        html ||
                        '<p class="text-gray-500">Preview will appear here...</p>',
                    }}
                  />
                )}
              </div>
            )}
          </Card>
        </div>

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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Live Preview
            </h3>
            <p className="text-gray-600 text-sm">
              See your HTML rendered in real-time as you type
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Code Highlighting
            </h3>
            <p className="text-gray-600 text-sm">
              Syntax highlighting for code blocks in preview
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
              Full Support
            </h3>
            <p className="text-gray-600 text-sm">
              Headers, links, lists, code blocks, and more
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
              Export HTML
            </h3>
            <p className="text-gray-600 text-sm">
              Download converted HTML file instantly
            </p>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mt-12 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Supported Markdown Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Text Formatting
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Headers (H1, H2, H3)</li>
                <li>• Bold and italic text</li>
                <li>• Inline code</li>
                <li>• Code blocks with language support</li>
                <li>• Blockquotes</li>
                <li>• Horizontal rules</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Links & Media
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Links with automatic target=&quot;_blank&quot;</li>
                <li>• Images with alt text</li>
                <li>• Bullet point lists</li>
                <li>• Numbered lists</li>
                <li>• Proper paragraph formatting</li>
                <li>• Line break preservation</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Information Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            About Markdown to HTML Conversion
          </h2>
          <p className="text-blue-800 mb-4">
            Markdown is a lightweight markup language that allows you to format
            text using simple syntax. Converting Markdown to HTML makes your
            content ready for web publication while maintaining proper semantic
            structure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Common Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Documentation websites</li>
                <li>• Blog posts and articles</li>
                <li>• README files</li>
                <li>• Static site generation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Use semantic HTML structure</li>
                <li>• Include alt text for images</li>
                <li>• Test HTML output for validity</li>
                <li>• Consider accessibility</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
