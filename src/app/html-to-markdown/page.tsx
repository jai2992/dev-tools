"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

export default function HtmlToMarkdownPage() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("code");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple HTML to Markdown converter
  const convertHtmlToMarkdown = (htmlContent: string): string => {
    if (!htmlContent.trim()) return "";

    let md = htmlContent;

    // Clean up HTML first
    md = md.replace(/<!--[\s\S]*?-->/g, ""); // Remove HTML comments
    md = md.replace(/\s+/g, " "); // Normalize whitespace
    md = md.trim();

    // Headers
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

    // Bold and italic
    md = md.replace(/<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi, "**$1**");
    md = md.replace(/<(?:em|i)[^>]*>(.*?)<\/(?:em|i)>/gi, "*$1*");

    // Code blocks
    md = md.replace(
      /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      (_, code) => {
        const cleanCode = code
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&");
        return `\`\`\`\n${cleanCode}\n\`\`\`\n\n`;
      }
    );

    // Inline code
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

    // Links
    md = md.replace(
      /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
      "[$2]($1)"
    );

    // Images
    md = md.replace(
      /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
      "![$2]($1)"
    );
    md = md.replace(
      /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi,
      "![$1]($2)"
    );
    md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, "![]($1)");

    // Lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
      const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
      return items + "\n";
    });

    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
      let counter = 1;
      const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${counter++}. $1\n`;
      });
      return items + "\n";
    });

    // Blockquotes
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n");

    // Horizontal rules
    md = md.replace(/<hr[^>]*\/?>/gi, "---\n\n");

    // Paragraphs
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

    // Line breaks
    md = md.replace(/<br\s*\/?>/gi, "\n");

    // Remove remaining HTML tags
    md = md.replace(/<[^>]*>/g, "");

    // Decode HTML entities
    md = md.replace(/&amp;/g, "&");
    md = md.replace(/&lt;/g, "<");
    md = md.replace(/&gt;/g, ">");
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&#39;/g, "'");
    md = md.replace(/&nbsp;/g, " ");

    // Clean up extra whitespace
    md = md.replace(/\n\s*\n\s*\n/g, "\n\n");
    md = md.replace(/^\s+|\s+$/g, "");

    return md;
  };

  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const converted = convertHtmlToMarkdown(html);
      setMarkdown(converted);
      setIsProcessing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [html]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      alert("Markdown copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdownPreview = (md: string): string => {
    if (!md.trim())
      return '<p class="text-gray-500">Preview will appear here...</p>';

    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Code blocks
    html = html.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```/g, "").trim();
      return `<pre><code>${code}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Line breaks and paragraphs
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    if (html && !html.startsWith("<")) {
      html = `<p>${html}</p>`;
    }

    return html;
  };

  const exampleHtml = `<h1>Sample HTML Document</h1>
<h2>Introduction</h2>
<p>This is a <strong>sample HTML</strong> document with various <em>formatting elements</em> to demonstrate the conversion to Markdown.</p>

<h3>Features</h3>
<ul>
<li>Bold and italic text</li>
<li>Headers of different levels</li>
<li>Lists and links</li>
<li>Code snippets</li>
</ul>

<p>Here's a link to <a href="https://github.com">GitHub</a> and some <code>inline code</code>.</p>

<pre><code>function example() {
  console.log("This is a code block");
  return true;
}</code></pre>

<blockquote>
This is a blockquote that will be converted to Markdown format.
</blockquote>

<ol>
<li>First numbered item</li>
<li>Second numbered item</li>
<li>Third numbered item</li>
</ol>

<hr>

<p>That's the end of the sample content!</p>`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="HTML to Markdown Converter"
          description="Convert HTML to clean Markdown format with live preview"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                HTML Input
              </h2>
              <Button
                onClick={() => setHtml(exampleHtml)}
                variant="secondary"
                size="sm"
              >
                Load Example
              </Button>
            </div>

            <Textarea
              value={html}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setHtml(e.target.value)
              }
              placeholder="Paste your HTML content here..."
              rows={20}
              className="font-mono text-sm"
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Markdown Output
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
                  disabled={!markdown || isProcessing}
                >
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  disabled={!markdown || isProcessing}
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
                    {markdown || "Markdown output will appear here..."}
                  </pre>
                ) : (
                  <div
                    className="prose prose-gray max-w-none p-4 border rounded-lg bg-white min-h-96"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownPreview(markdown),
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Clean Output
            </h3>
            <p className="text-gray-600 text-sm">
              Removes unnecessary HTML and produces clean Markdown
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Structure Preserved
            </h3>
            <p className="text-gray-600 text-sm">
              Maintains document hierarchy and formatting
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
              See how your Markdown will render in real-time
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
              Export Ready
            </h3>
            <p className="text-gray-600 text-sm">
              Download clean Markdown files instantly
            </p>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mt-12 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Supported HTML Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Text Elements
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Headers (H1-H6) → # ## ###</li>
                <li>• Bold (&lt;strong&gt;, &lt;b&gt;) → **text**</li>
                <li>• Italic (&lt;em&gt;, &lt;i&gt;) → *text*</li>
                <li>• Code (&lt;code&gt;) → `code`</li>
                <li>• Code blocks (&lt;pre&gt;&lt;code&gt;) → ```</li>
                <li>• Paragraphs and line breaks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Structure Elements
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Links (&lt;a&gt;) → [text](url)</li>
                <li>• Images (&lt;img&gt;) → ![alt](src)</li>
                <li>• Unordered lists (&lt;ul&gt;) → -</li>
                <li>• Ordered lists (&lt;ol&gt;) → 1.</li>
                <li>• Blockquotes (&lt;blockquote&gt;) → &gt;</li>
                <li>• Horizontal rules (&lt;hr&gt;) → ---</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Information Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            About HTML to Markdown Conversion
          </h2>
          <p className="text-blue-800 mb-4">
            Converting HTML to Markdown helps migrate content to documentation
            systems, static site generators, or any platform that uses Markdown.
            Our converter preserves the document structure while producing
            clean, readable Markdown syntax.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Perfect For:</h4>
              <ul className="space-y-1">
                <li>• Content migration</li>
                <li>• Documentation conversion</li>
                <li>• Blog post formatting</li>
                <li>• README file creation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Automatic HTML cleanup</li>
                <li>• Entity decoding</li>
                <li>• Structure preservation</li>
                <li>• Real-time processing</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
