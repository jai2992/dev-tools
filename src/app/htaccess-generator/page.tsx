'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Button, Input, Select, Card, CodeBlock, PageHeader, Textarea } from '@/components/common';

interface RedirectRule {
  id: string;
  from: string;
  to: string;
  type: '301' | '302' | '307';
  enabled: boolean;
}

interface SecurityRule {
  id: string;
  name: string;
  enabled: boolean;
  code: string;
}

interface CacheRule {
  extension: string;
  duration: string;
  enabled: boolean;
}

export default function HtaccessGeneratorPage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [customCode, setCustomCode] = useState('');
  const [enableGzip, setEnableGzip] = useState(true);
  const [enableHttps, setEnableHttps] = useState(true);
  const [enableWWW, setEnableWWW] = useState(false);
  const [wwwMode, setWwwMode] = useState<'add' | 'remove'>('add');
  const [indexFiles, setIndexFiles] = useState('index.html index.php');
  const [enableHSTS, setEnableHSTS] = useState(false);
  const [hstsMaxAge, setHstsMaxAge] = useState('31536000');
  
  const [securityRules, setSecurityRules] = useState<SecurityRule[]>([
    {
      id: 'xss-protection',
      name: 'XSS Protection',
      enabled: true,
      code: 'Header always set X-XSS-Protection "1; mode=block"'
    },
    {
      id: 'content-type',
      name: 'Content Type Options',
      enabled: true,
      code: 'Header always set X-Content-Type-Options "nosniff"'
    },
    {
      id: 'frame-options',
      name: 'Frame Options',
      enabled: true,
      code: 'Header always set X-Frame-Options "SAMEORIGIN"'
    },
    {
      id: 'referrer-policy',
      name: 'Referrer Policy',
      enabled: false,
      code: 'Header always set Referrer-Policy "strict-origin-when-cross-origin"'
    },
    {
      id: 'csp',
      name: 'Content Security Policy',
      enabled: false,
      code: 'Header always set Content-Security-Policy "default-src \'self\'"'
    }
  ]);

  const [cacheRules, setCacheRules] = useState<CacheRule[]>([
    { extension: 'css', duration: '1 year', enabled: true },
    { extension: 'js', duration: '1 year', enabled: true },
    { extension: 'png|jpg|jpeg|gif|ico|svg', duration: '1 year', enabled: true },
    { extension: 'woff|woff2|ttf|eot', duration: '1 year', enabled: true },
    { extension: 'pdf', duration: '1 month', enabled: true },
    { extension: 'html|htm', duration: '1 day', enabled: false }
  ]);

  const addRedirect = () => {
    const newRedirect: RedirectRule = {
      id: Date.now().toString(),
      from: '',
      to: '',
      type: '301',
      enabled: true
    };
    setRedirects([...redirects, newRedirect]);
  };

  const updateRedirect = (id: string, field: keyof RedirectRule, value: string | boolean) => {
    setRedirects(redirects.map(redirect => 
      redirect.id === id ? { ...redirect, [field]: value } : redirect
    ));
  };

  const removeRedirect = (id: string) => {
    setRedirects(redirects.filter(redirect => redirect.id !== id));
  };

  const toggleSecurityRule = (id: string) => {
    setSecurityRules(securityRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateSecurityRule = (id: string, code: string) => {
    setSecurityRules(securityRules.map(rule => 
      rule.id === id ? { ...rule, code } : rule
    ));
  };

  const toggleCacheRule = (index: number) => {
    setCacheRules(cacheRules.map((rule, i) => 
      i === index ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateCacheRule = (index: number, field: keyof CacheRule, value: string) => {
    setCacheRules(cacheRules.map((rule, i) => 
      i === index ? { ...rule, [field]: value } : rule
    ));
  };

  const generateHtaccess = () => {
    const lines: string[] = [];
    
    lines.push('# Generated by devtools.software');
    lines.push('# .htaccess file');
    lines.push('');

    // Basic settings
    if (indexFiles.trim()) {
      lines.push('# Directory index files');
      lines.push(`DirectoryIndex ${indexFiles}`);
      lines.push('');
    }

    // HTTPS redirect
    if (enableHttps) {
      lines.push('# Force HTTPS');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTPS} off');
      lines.push('RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    // WWW redirect
    if (enableWWW) {
      lines.push(`# ${wwwMode === 'add' ? 'Force' : 'Remove'} www`);
      lines.push('RewriteEngine On');
      
      if (wwwMode === 'add') {
        lines.push('RewriteCond %{HTTP_HOST} !^www\\.');
        lines.push('RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      } else {
        lines.push('RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]');
        lines.push('RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]');
      }
      lines.push('');
    }

    // Custom redirects
    if (redirects.length > 0) {
      const enabledRedirects = redirects.filter(r => r.enabled && r.from && r.to);
      if (enabledRedirects.length > 0) {
        lines.push('# Custom redirects');
        lines.push('RewriteEngine On');
        enabledRedirects.forEach(redirect => {
          lines.push(`Redirect ${redirect.type} ${redirect.from} ${redirect.to}`);
        });
        lines.push('');
      }
    }

    // Security headers
    const enabledSecurityRules = securityRules.filter(rule => rule.enabled);
    if (enabledSecurityRules.length > 0) {
      lines.push('# Security headers');
      lines.push('<IfModule mod_headers.c>');
      enabledSecurityRules.forEach(rule => {
        lines.push(`    ${rule.code}`);
      });
      
      if (enableHSTS) {
        lines.push(`    Header always set Strict-Transport-Security "max-age=${hstsMaxAge}; includeSubDomains"`);
      }
      
      lines.push('</IfModule>');
      lines.push('');
    }

    // Gzip compression
    if (enableGzip) {
      lines.push('# Gzip compression');
      lines.push('<IfModule mod_deflate.c>');
      lines.push('    # Compress HTML, CSS, JavaScript, Text, XML and fonts');
      lines.push('    AddOutputFilterByType DEFLATE application/javascript');
      lines.push('    AddOutputFilterByType DEFLATE application/rss+xml');
      lines.push('    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject');
      lines.push('    AddOutputFilterByType DEFLATE application/x-font');
      lines.push('    AddOutputFilterByType DEFLATE application/x-font-opentype');
      lines.push('    AddOutputFilterByType DEFLATE application/x-font-otf');
      lines.push('    AddOutputFilterByType DEFLATE application/x-font-truetype');
      lines.push('    AddOutputFilterByType DEFLATE application/x-font-ttf');
      lines.push('    AddOutputFilterByType DEFLATE application/x-javascript');
      lines.push('    AddOutputFilterByType DEFLATE application/xhtml+xml');
      lines.push('    AddOutputFilterByType DEFLATE application/xml');
      lines.push('    AddOutputFilterByType DEFLATE font/opentype');
      lines.push('    AddOutputFilterByType DEFLATE font/otf');
      lines.push('    AddOutputFilterByType DEFLATE font/ttf');
      lines.push('    AddOutputFilterByType DEFLATE image/svg+xml');
      lines.push('    AddOutputFilterByType DEFLATE image/x-icon');
      lines.push('    AddOutputFilterByType DEFLATE text/css');
      lines.push('    AddOutputFilterByType DEFLATE text/html');
      lines.push('    AddOutputFilterByType DEFLATE text/javascript');
      lines.push('    AddOutputFilterByType DEFLATE text/plain');
      lines.push('    AddOutputFilterByType DEFLATE text/xml');
      lines.push('</IfModule>');
      lines.push('');
    }

    // Cache rules
    const enabledCacheRules = cacheRules.filter(rule => rule.enabled);
    if (enabledCacheRules.length > 0) {
      lines.push('# Browser caching');
      lines.push('<IfModule mod_expires.c>');
      lines.push('    ExpiresActive on');
      enabledCacheRules.forEach(rule => {
        lines.push(`    ExpiresByType image/${rule.extension.replace('|', '|image/')} "access plus ${rule.duration}"`);
        if (rule.extension.includes('css')) {
          lines.push(`    ExpiresByType text/css "access plus ${rule.duration}"`);
        }
        if (rule.extension.includes('js')) {
          lines.push(`    ExpiresByType application/javascript "access plus ${rule.duration}"`);
          lines.push(`    ExpiresByType text/javascript "access plus ${rule.duration}"`);
        }
        if (rule.extension.includes('html')) {
          lines.push(`    ExpiresByType text/html "access plus ${rule.duration}"`);
        }
        if (rule.extension.includes('pdf')) {
          lines.push(`    ExpiresByType application/pdf "access plus ${rule.duration}"`);
        }
        if (rule.extension.includes('woff')) {
          lines.push(`    ExpiresByType font/woff "access plus ${rule.duration}"`);
          lines.push(`    ExpiresByType font/woff2 "access plus ${rule.duration}"`);
          lines.push(`    ExpiresByType application/font-woff "access plus ${rule.duration}"`);
        }
      });
      lines.push('</IfModule>');
      lines.push('');
    }

    // Custom code
    if (customCode.trim()) {
      lines.push('# Custom rules');
      lines.push(customCode.trim());
      lines.push('');
    }

    return lines.join('\n').trim();
  };

  const downloadHtaccess = () => {
    const content = generateHtaccess();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.htaccess';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (presetName: string) => {
    switch (presetName) {
      case 'basic':
        setEnableHttps(true);
        setEnableGzip(true);
        setEnableWWW(false);
        setSecurityRules(securityRules.map(rule => ({ 
          ...rule, 
          enabled: ['xss-protection', 'content-type', 'frame-options'].includes(rule.id) 
        })));
        break;
      case 'security':
        setEnableHttps(true);
        setEnableHSTS(true);
        setSecurityRules(securityRules.map(rule => ({ ...rule, enabled: true })));
        break;
      case 'performance':
        setEnableGzip(true);
        setCacheRules(cacheRules.map(rule => ({ ...rule, enabled: true })));
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>.htaccess Generator | Apache Config Tool | devtools.software</title>
        <meta name="description" content="Generate .htaccess files with redirects, security headers, caching rules, and more. Visual Apache configuration builder." />
        <meta property="og:title" content=".htaccess Generator - Apache Config Tool" />
        <meta property="og:description" content="Generate Apache .htaccess configuration files with security and performance rules" />
        <meta property="og:url" content="https://devtools.software/htaccess-generator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title=".htaccess Generator"
        description="Generate Apache .htaccess configuration files"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Presets */}
          <Card title="Quick Presets">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => loadPreset('basic')}>
                🔧 Basic Setup
              </Button>
              <Button variant="secondary" onClick={() => loadPreset('security')}>
                🔒 Security Focus
              </Button>
              <Button variant="secondary" onClick={() => loadPreset('performance')}>
                ⚡ Performance
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <Card title="Basic Settings">
              <div className="space-y-4">
                <Input
                  label="Directory Index Files"
                  value={indexFiles}
                  onChange={(e) => setIndexFiles(e.target.value)}
                  placeholder="index.html index.php default.html"
                  helperText="Space-separated list of default files"
                />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableHttps"
                      checked={enableHttps}
                      onChange={(e) => setEnableHttps(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableHttps" className="text-sm text-gray-300">
                      🔒 Force HTTPS redirect
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableWWW"
                      checked={enableWWW}
                      onChange={(e) => setEnableWWW(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableWWW" className="text-sm text-gray-300">
                      🌐 WWW redirect
                    </label>
                  </div>

                  {enableWWW && (
                    <div className="ml-7">
                      <Select
                        value={wwwMode}
                        onChange={(e) => setWwwMode(e.target.value as 'add' | 'remove')}
                      >
                        <option value="add">Add www (example.com → www.example.com)</option>
                        <option value="remove">Remove www (www.example.com → example.com)</option>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableGzip"
                      checked={enableGzip}
                      onChange={(e) => setEnableGzip(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableGzip" className="text-sm text-gray-300">
                      📦 Enable Gzip compression
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Headers */}
            <Card title="Security Headers">
              <div className="space-y-4">
                {securityRules.map((rule) => (
                  <div key={rule.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => toggleSecurityRule(rule.id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-300">{rule.name}</label>
                    </div>
                    {rule.enabled && (
                      <Textarea
                        value={rule.code}
                        onChange={(e) => updateSecurityRule(rule.id, e.target.value)}
                        rows={2}
                        className="text-xs font-mono"
                      />
                    )}
                  </div>
                ))}

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableHSTS"
                      checked={enableHSTS}
                      onChange={(e) => setEnableHSTS(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableHSTS" className="text-sm text-gray-300">
                      HSTS (HTTP Strict Transport Security)
                    </label>
                  </div>
                  {enableHSTS && (
                    <div className="mt-2">
                      <Input
                        label="Max Age (seconds)"
                        value={hstsMaxAge}
                        onChange={(e) => setHstsMaxAge(e.target.value)}
                        placeholder="31536000"
                        helperText="31536000 = 1 year"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Redirects */}
          <Card 
            title="URL Redirects"
            actions={
              <Button onClick={addRedirect}>
                ➕ Add Redirect
              </Button>
            }
          >
            {redirects.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No redirects configured. Click &quot;Add Redirect&quot; to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {redirects.map((redirect) => (
                  <div key={redirect.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <Input
                        label="From"
                        value={redirect.from}
                        onChange={(e) => updateRedirect(redirect.id, 'from', e.target.value)}
                        placeholder="/old-page"
                      />
                      <Input
                        label="To"
                        value={redirect.to}
                        onChange={(e) => updateRedirect(redirect.id, 'to', e.target.value)}
                        placeholder="/new-page or https://example.com"
                      />
                      <Select
                        label="Type"
                        value={redirect.type}
                        onChange={(e) => updateRedirect(redirect.id, 'type', e.target.value)}
                      >
                        <option value="301">301 (Permanent)</option>
                        <option value="302">302 (Temporary)</option>
                        <option value="307">307 (Temporary, Preserve Method)</option>
                      </Select>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={redirect.enabled}
                          onChange={(e) => updateRedirect(redirect.id, 'enabled', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-300">Enabled</label>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeRedirect(redirect.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Cache Rules */}
          <Card title="Browser Caching">
            <div className="space-y-4">
              {cacheRules.map((rule, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleCacheRule(index)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300 font-mono">.{rule.extension}</span>
                  </div>
                  <Input
                    value={rule.extension}
                    onChange={(e) => updateCacheRule(index, 'extension', e.target.value)}
                    placeholder="css|js|png"
                  />
                  <Select
                    value={rule.duration}
                    onChange={(e) => updateCacheRule(index, 'duration', e.target.value)}
                  >
                    <option value="1 hour">1 Hour</option>
                    <option value="1 day">1 Day</option>
                    <option value="1 week">1 Week</option>
                    <option value="1 month">1 Month</option>
                    <option value="1 year">1 Year</option>
                  </Select>
                  <div className="text-sm text-gray-400">
                    Cache for {rule.duration}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Custom Code */}
          <Card title="Custom Rules">
            <Textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              rows={8}
              placeholder="Add your custom .htaccess rules here..."
              helperText="Advanced users can add custom Apache directives"
            />
          </Card>

          {/* Generated .htaccess */}
          <Card
            title="Generated .htaccess"
            actions={
              <Button onClick={downloadHtaccess}>
                💾 Download .htaccess
              </Button>
            }
          >
            <CodeBlock
              language="apache"
              code={generateHtaccess()}
            />
          </Card>

          {/* Usage Instructions */}
          <Card title="Usage Instructions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Installation</h4>
                <ul className="space-y-1">
                  <li>• Download the generated .htaccess file</li>
                  <li>• Upload it to your website&apos;s root directory</li>
                  <li>• Ensure your server supports Apache mod_rewrite</li>
                  <li>• Test redirects and functionality</li>
                  <li>• Monitor server error logs for issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Security Features</h4>
                <ul className="space-y-1">
                  <li>• HTTPS redirects for secure connections</li>
                  <li>• Security headers prevent common attacks</li>
                  <li>• HSTS enforces HTTPS for repeat visitors</li>
                  <li>• Content-Type sniffing protection</li>
                  <li>• Clickjacking protection with X-Frame-Options</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Performance</h4>
                <ul className="space-y-1">
                  <li>• Gzip compression reduces file sizes</li>
                  <li>• Browser caching improves load times</li>
                  <li>• Proper cache headers for different file types</li>
                  <li>• Leverage browser caching for static assets</li>
                  <li>• Reduce server load with client-side caching</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Common Issues</h4>
                <ul className="space-y-1">
                  <li>• Check server supports required modules</li>
                  <li>• Verify correct file permissions (644)</li>
                  <li>• Test redirects don&apos;t create loops</li>
                  <li>• Monitor server error logs</li>
                  <li>• Backup existing .htaccess before replacing</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
