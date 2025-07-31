'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
  locale: string;
  type: string;
  themeColor: string;
}

interface SocialPreview {
  platform: 'facebook' | 'twitter' | 'linkedin';
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function MetaTagsPage() {
  const [metaData, setMetaData] = useState<MetaData>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    siteName: '',
    twitterHandle: '',
    locale: 'en_US',
    type: 'website',
    themeColor: '#000000'
  });

  const [generatedHTML, setGeneratedHTML] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');

  const generateMetaTags = () => {
    const tags: string[] = [];

    // Basic SEO Meta Tags
    if (metaData.title) {
      tags.push(`<title>${metaData.title}</title>`);
      tags.push(`<meta name="title" content="${metaData.title}">`);
    }

    if (metaData.description) {
      tags.push(`<meta name="description" content="${metaData.description}">`);
    }

    if (metaData.keywords) {
      tags.push(`<meta name="keywords" content="${metaData.keywords}">`);
    }

    if (metaData.author) {
      tags.push(`<meta name="author" content="${metaData.author}">`);
    }

    // Essential Meta Tags
    tags.push(`<meta charset="UTF-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<meta name="robots" content="index, follow">`);
    tags.push(`<meta name="language" content="${metaData.locale.split('_')[0]}">`);

    if (metaData.themeColor) {
      tags.push(`<meta name="theme-color" content="${metaData.themeColor}">`);
    }

    // Open Graph Meta Tags
    if (metaData.title) {
      tags.push(`<meta property="og:title" content="${metaData.title}">`);
    }

    if (metaData.description) {
      tags.push(`<meta property="og:description" content="${metaData.description}">`);
    }

    if (metaData.url) {
      tags.push(`<meta property="og:url" content="${metaData.url}">`);
    }

    if (metaData.image) {
      tags.push(`<meta property="og:image" content="${metaData.image}">`);
      tags.push(`<meta property="og:image:width" content="1200">`);
      tags.push(`<meta property="og:image:height" content="630">`);
      tags.push(`<meta property="og:image:alt" content="${metaData.title}">`);
    }

    if (metaData.siteName) {
      tags.push(`<meta property="og:site_name" content="${metaData.siteName}">`);
    }

    tags.push(`<meta property="og:type" content="${metaData.type}">`);
    tags.push(`<meta property="og:locale" content="${metaData.locale}">`);

    // Twitter Card Meta Tags
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);

    if (metaData.title) {
      tags.push(`<meta name="twitter:title" content="${metaData.title}">`);
    }

    if (metaData.description) {
      tags.push(`<meta name="twitter:description" content="${metaData.description}">`);
    }

    if (metaData.image) {
      tags.push(`<meta name="twitter:image" content="${metaData.image}">`);
    }

    if (metaData.twitterHandle) {
      tags.push(`<meta name="twitter:creator" content="@${metaData.twitterHandle.replace('@', '')}">`);
      tags.push(`<meta name="twitter:site" content="@${metaData.twitterHandle.replace('@', '')}">`);
    }

    // Additional SEO Tags
    if (metaData.url) {
      tags.push(`<link rel="canonical" href="${metaData.url}">`);
    }

    // Schema.org JSON-LD
    if (metaData.title && metaData.description) {
      const schema = {
        "@context": "https://schema.org",
        "@type": metaData.type === 'article' ? 'Article' : 'WebSite',
        "name": metaData.title,
        "description": metaData.description,
        ...(metaData.url && { "url": metaData.url }),
        ...(metaData.image && { "image": metaData.image }),
        ...(metaData.author && { "author": { "@type": "Person", "name": metaData.author } }),
        ...(metaData.siteName && { "publisher": { "@type": "Organization", "name": metaData.siteName } })
      };

      tags.push(`<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`);
    }

    setGeneratedHTML(tags.join('\n'));
  };

  useEffect(() => {
    generateMetaTags();
  }, [metaData]);

  const updateMetaData = (key: keyof MetaData, value: string) => {
    setMetaData(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      setCopyFeedback('Meta tags copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const downloadHTML = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="${metaData.locale.split('_')[0]}">
<head>
${generatedHTML}
</head>
<body>
  <!-- Your content here -->
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setMetaData({
      title: 'Amazing Web Development Tool | DevTools',
      description: 'Discover powerful web development tools to boost your productivity. Free online tools for developers, designers, and content creators.',
      keywords: 'web development, tools, productivity, developers, online tools',
      author: 'DevTools Team',
      url: 'https://devtools.software',
      image: 'https://devtools.software/og-image.jpg',
      siteName: 'DevTools Software',
      twitterHandle: 'devtools',
      locale: 'en_US',
      type: 'website',
      themeColor: '#3b82f6'
    });
  };

  const clearAll = () => {
    setMetaData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      url: '',
      image: '',
      siteName: '',
      twitterHandle: '',
      locale: 'en_US',
      type: 'website',
      themeColor: '#000000'
    });
  };

  const getSocialPreview = (platform: 'facebook' | 'twitter' | 'linkedin'): SocialPreview => {
    return {
      platform,
      title: metaData.title || 'Your Page Title',
      description: metaData.description || 'Your page description will appear here.',
      image: metaData.image || 'https://via.placeholder.com/1200x630/3b82f6/ffffff?text=Preview+Image',
      url: metaData.url || 'https://example.com'
    };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Meta Tag Generator | SEO & Social Media Tags | devtools.software</title>
        <meta name="description" content="Generate HTML meta tags for SEO and social media sharing. Create Open Graph, Twitter Card, and Schema.org markup with live preview." />
        <meta property="og:title" content="Meta Tag Generator - SEO & Social Media Tags" />
        <meta property="og:description" content="Generate meta tags for better SEO and social media sharing" />
        <meta property="og:url" content="https://devtools.software/meta-tags" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">Meta Tag Generator</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Generate HTML meta tags for SEO and social media sharing</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Basic SEO
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'social' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Social Media
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Advanced
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={loadExample}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  📝 Load Example
                </button>
                <button
                  onClick={clearAll}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>

            {/* Basic SEO Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={metaData.title}
                    onChange={(e) => updateMetaData('title', e.target.value)}
                    placeholder="Your page title (50-60 characters)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaData.title.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Page URL *
                  </label>
                  <input
                    type="url"
                    value={metaData.url}
                    onChange={(e) => updateMetaData('url', e.target.value)}
                    placeholder="https://example.com/page"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meta Description *
                  </label>
                  <textarea
                    value={metaData.description}
                    onChange={(e) => updateMetaData('description', e.target.value)}
                    placeholder="Brief description of your page content (150-160 characters)"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaData.description.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={metaData.keywords}
                    onChange={(e) => updateMetaData('keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={metaData.author}
                    onChange={(e) => updateMetaData('author', e.target.value)}
                    placeholder="Author name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Open Graph Image
                  </label>
                  <input
                    type="url"
                    value={metaData.image}
                    onChange={(e) => updateMetaData('image', e.target.value)}
                    placeholder="https://example.com/image.jpg (1200x630px)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px for optimal display</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={metaData.siteName}
                    onChange={(e) => updateMetaData('siteName', e.target.value)}
                    placeholder="Your Site Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={metaData.twitterHandle}
                    onChange={(e) => updateMetaData('twitterHandle', e.target.value)}
                    placeholder="username (without @)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={metaData.type}
                    onChange={(e) => updateMetaData('type', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="blog">Blog</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Locale
                  </label>
                  <select
                    value={metaData.locale}
                    onChange={(e) => updateMetaData('locale', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en_US">English (US)</option>
                    <option value="en_GB">English (UK)</option>
                    <option value="es_ES">Spanish</option>
                    <option value="fr_FR">French</option>
                    <option value="de_DE">German</option>
                    <option value="it_IT">Italian</option>
                    <option value="pt_BR">Portuguese (Brazil)</option>
                    <option value="ja_JP">Japanese</option>
                    <option value="ko_KR">Korean</option>
                    <option value="zh_CN">Chinese (Simplified)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={metaData.themeColor}
                      onChange={(e) => updateMetaData('themeColor', e.target.value)}
                      className="w-12 h-12 rounded border border-gray-600 bg-transparent"
                    />
                    <input
                      type="text"
                      value={metaData.themeColor}
                      onChange={(e) => updateMetaData('themeColor', e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Media Preview */}
          {metaData.title && metaData.description && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media Preview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Facebook Preview */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-3">Facebook</h4>
                  <div className="border border-gray-600 rounded overflow-hidden">
                    {metaData.image && (
                      <div className="aspect-[1.91/1] bg-gray-700">
                        <img 
                          src={metaData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3 bg-gray-700">
                      <div className="text-blue-400 text-xs uppercase mb-1">
                        {new URL(metaData.url || 'https://example.com').hostname}
                      </div>
                      <div className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {metaData.title}
                      </div>
                      <div className="text-gray-400 text-xs line-clamp-2">
                        {metaData.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Twitter Preview */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-3">Twitter</h4>
                  <div className="border border-gray-600 rounded overflow-hidden">
                    {metaData.image && (
                      <div className="aspect-[2/1] bg-gray-700">
                        <img 
                          src={metaData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3 bg-gray-700">
                      <div className="text-white font-medium text-sm mb-1 line-clamp-1">
                        {metaData.title}
                      </div>
                      <div className="text-gray-400 text-xs mb-1 line-clamp-2">
                        {metaData.description}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new URL(metaData.url || 'https://example.com').hostname}
                      </div>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Preview */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-3">LinkedIn</h4>
                  <div className="border border-gray-600 rounded overflow-hidden">
                    {metaData.image && (
                      <div className="aspect-[1.91/1] bg-gray-700">
                        <img 
                          src={metaData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3 bg-gray-700">
                      <div className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {metaData.title}
                      </div>
                      <div className="text-gray-400 text-xs mb-1 line-clamp-2">
                        {metaData.description}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new URL(metaData.url || 'https://example.com').hostname}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated HTML */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Generated HTML Meta Tags</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  📋 Copy HTML
                </button>
                <button
                  onClick={downloadHTML}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  💾 Download
                </button>
                {copyFeedback && (
                  <span className="text-green-400 py-2">{copyFeedback}</span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                {generatedHTML || 'Fill in the form above to generate meta tags'}
              </pre>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">SEO Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Title Tags</h4>
                <ul className="space-y-1">
                  <li>• Keep between 50-60 characters</li>
                  <li>• Include primary keywords near the beginning</li>
                  <li>• Make it compelling and descriptive</li>
                  <li>• Avoid keyword stuffing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Meta Descriptions</h4>
                <ul className="space-y-1">
                  <li>• Keep between 150-160 characters</li>
                  <li>• Include a call-to-action</li>
                  <li>• Accurately describe the page content</li>
                  <li>• Use active voice when possible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Open Graph Images</h4>
                <ul className="space-y-1">
                  <li>• Use 1200x630px for best results</li>
                  <li>• Keep file size under 8MB</li>
                  <li>• Use high-quality, relevant images</li>
                  <li>• Include text overlay if needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Technical Tips</h4>
                <ul className="space-y-1">
                  <li>• Always include viewport meta tag</li>
                  <li>• Use canonical URLs to avoid duplicates</li>
                  <li>• Add structured data for rich snippets</li>
                  <li>• Test with social media debuggers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
