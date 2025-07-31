'use client';

import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';

interface BoxShadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  inset: boolean;
  opacity: number;
}

interface ShadowPreset {
  name: string;
  shadows: Omit<BoxShadow, 'id'>[];
}

const presets: ShadowPreset[] = [
  {
    name: 'Soft Drop',
    shadows: [
      { offsetX: 0, offsetY: 4, blurRadius: 6, spreadRadius: -1, color: '#000000', inset: false, opacity: 0.1 }
    ]
  },
  {
    name: 'Medium Drop',
    shadows: [
      { offsetX: 0, offsetY: 10, blurRadius: 15, spreadRadius: -3, color: '#000000', inset: false, opacity: 0.1 }
    ]
  },
  {
    name: 'Large Drop',
    shadows: [
      { offsetX: 0, offsetY: 20, blurRadius: 25, spreadRadius: -5, color: '#000000', inset: false, opacity: 0.1 }
    ]
  },
  {
    name: 'Extra Large',
    shadows: [
      { offsetX: 0, offsetY: 25, blurRadius: 50, spreadRadius: -12, color: '#000000', inset: false, opacity: 0.25 }
    ]
  },
  {
    name: 'Inner Shadow',
    shadows: [
      { offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: '#000000', inset: true, opacity: 0.06 }
    ]
  },
  {
    name: 'Outline',
    shadows: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 1, color: '#3b82f6', inset: false, opacity: 1 }
    ]
  },
  {
    name: 'Glow',
    shadows: [
      { offsetX: 0, offsetY: 0, blurRadius: 20, spreadRadius: 0, color: '#3b82f6', inset: false, opacity: 0.5 }
    ]
  },
  {
    name: 'Neumorphism',
    shadows: [
      { offsetX: 8, offsetY: 8, blurRadius: 16, spreadRadius: 0, color: '#000000', inset: false, opacity: 0.15 },
      { offsetX: -8, offsetY: -8, blurRadius: 16, spreadRadius: 0, color: '#ffffff', inset: false, opacity: 0.7 }
    ]
  },
  {
    name: 'Layered',
    shadows: [
      { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: '#000000', inset: false, opacity: 0.12 },
      { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: '#000000', inset: false, opacity: 0.24 }
    ]
  }
];

export default function BoxShadowPage() {
  const [shadows, setShadows] = useState<BoxShadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: -1,
      color: '#000000',
      inset: false,
      opacity: 0.1
    }
  ]);

  const [cssCode, setCssCode] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [previewStyle, setPreviewStyle] = useState({
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    width: '200px',
    height: '120px'
  });

  const generateCSS = useCallback(() => {
    const shadowStrings = shadows.map(shadow => {
      const { offsetX, offsetY, blurRadius, spreadRadius, color, inset, opacity } = shadow;
      
      // Convert hex color to rgba with opacity
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const colorWithOpacity = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      
      const insetText = inset ? 'inset ' : '';
      return `${insetText}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorWithOpacity}`;
    });

    const css = `box-shadow: ${shadowStrings.join(', ')};`;
    setCssCode(css);
  }, [shadows]);

  useEffect(() => {
    generateCSS();
  }, [generateCSS]);

  const addShadow = () => {
    const newShadow: BoxShadow = {
      id: Date.now().toString(),
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: '#000000',
      inset: false,
      opacity: 0.1
    };
    setShadows([...shadows, newShadow]);
  };

  const removeShadow = (id: string) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(shadow => shadow.id !== id));
    }
  };

  const updateShadow = (id: string, field: keyof BoxShadow, value: any) => {
    setShadows(shadows.map(shadow => 
      shadow.id === id ? { ...shadow, [field]: value } : shadow
    ));
  };

  const loadPreset = (preset: ShadowPreset) => {
    const newShadows = preset.shadows.map((shadow, index) => ({
      ...shadow,
      id: (Date.now() + index).toString()
    }));
    setShadows(newShadows);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopyFeedback('CSS copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const downloadCSS = () => {
    const fullCSS = `.element {\n  ${cssCode}\n}`;
    const blob = new Blob([fullCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'box-shadow.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllShadows = () => {
    setShadows([{
      id: '1',
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: 0,
      color: '#000000',
      inset: false,
      opacity: 0
    }]);
  };

  // Convert CSS to inline style for preview
  const getPreviewBoxShadow = () => {
    const shadowStrings = shadows.map(shadow => {
      const { offsetX, offsetY, blurRadius, spreadRadius, color, inset, opacity } = shadow;
      
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const colorWithOpacity = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      const insetText = inset ? 'inset ' : '';
      
      return `${insetText}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorWithOpacity}`;
    });

    return shadowStrings.join(', ');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Box Shadow Generator | CSS Shadow Creator | devtools.software</title>
        <meta name="description" content="Generate CSS box shadows with live preview. Create multiple shadows, adjust opacity, inset shadows, and copy CSS code instantly." />
        <meta property="og:title" content="Box Shadow Generator - CSS Shadow Creator" />
        <meta property="og:description" content="Create beautiful CSS box shadows with interactive controls and live preview" />
        <meta property="og:url" content="https://devtools.software/box-shadow" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">Box Shadow Generator</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Generate CSS box shadows with live preview</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Live Preview */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl p-8 flex items-center justify-center">
                <div
                  className="transition-all duration-200"
                  style={{
                    ...previewStyle,
                    boxShadow: getPreviewBoxShadow()
                  }}
                />
              </div>
              
              {/* Preview Controls */}
              <div className="lg:w-64 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={previewStyle.backgroundColor}
                      onChange={(e) => setPreviewStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                    />
                    <input
                      type="text"
                      value={previewStyle.backgroundColor}
                      onChange={(e) => setPreviewStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Border Radius: {previewStyle.borderRadius}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={parseInt(previewStyle.borderRadius)}
                    onChange={(e) => setPreviewStyle(prev => ({ ...prev, borderRadius: e.target.value + 'px' }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Width: {previewStyle.width}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={parseInt(previewStyle.width)}
                    onChange={(e) => setPreviewStyle(prev => ({ ...prev, width: e.target.value + 'px' }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height: {previewStyle.height}
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="200"
                    value={parseInt(previewStyle.height)}
                    onChange={(e) => setPreviewStyle(prev => ({ ...prev, height: e.target.value + 'px' }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shadow Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Shadow Controls</h3>
              <div className="flex gap-2">
                <button
                  onClick={addShadow}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  ➕ Add Shadow
                </button>
                <button
                  onClick={clearAllShadows}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {shadows.map((shadow, index) => (
                <div key={shadow.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Shadow {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                          className="rounded"
                        />
                        Inset
                      </label>
                      {shadows.length > 1 && (
                        <button
                          onClick={() => removeShadow(shadow.id)}
                          className="bg-red-600 hover:bg-red-700 p-1 rounded transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        X Offset: {shadow.offsetX}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetX}
                        onChange={(e) => updateShadow(shadow.id, 'offsetX', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Y Offset: {shadow.offsetY}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetY}
                        onChange={(e) => updateShadow(shadow.id, 'offsetY', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Blur: {shadow.blurRadius}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={shadow.blurRadius}
                        onChange={(e) => updateShadow(shadow.id, 'blurRadius', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Spread: {shadow.spreadRadius}px
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shadow.spreadRadius}
                        onChange={(e) => updateShadow(shadow.id, 'spreadRadius', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Opacity: {Math.round(shadow.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={shadow.opacity}
                        onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Color</label>
                      <div className="flex gap-1">
                        <input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-600 bg-transparent"
                        />
                        <input
                          type="text"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Shadow Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => loadPreset(preset)}
                  className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg p-4 transition-colors"
                >
                  <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="w-12 h-8 bg-blue-500 rounded"
                      style={{
                        boxShadow: preset.shadows.map(shadow => {
                          const hex = shadow.color.replace('#', '');
                          const r = parseInt(hex.substr(0, 2), 16);
                          const g = parseInt(hex.substr(2, 2), 16);
                          const b = parseInt(hex.substr(4, 2), 16);
                          const colorWithOpacity = `rgba(${r}, ${g}, ${b}, ${shadow.opacity})`;
                          const insetText = shadow.inset ? 'inset ' : '';
                          return `${insetText}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${colorWithOpacity}`;
                        }).join(', ')
                      }}
                    />
                  </div>
                  <div className="text-white text-sm font-medium">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* CSS Output */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">CSS Code</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  📋 Copy CSS
                </button>
                <button
                  onClick={downloadCSS}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  💾 Download
                </button>
                {copyFeedback && (
                  <span className="text-green-400 py-2">{copyFeedback}</span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <pre className="text-white font-mono text-sm overflow-x-auto">{cssCode}</pre>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Shadow Properties</h4>
                <ul className="space-y-1">
                  <li>• <strong>X/Y Offset:</strong> Horizontal and vertical shadow position</li>
                  <li>• <strong>Blur Radius:</strong> How blurred the shadow appears</li>
                  <li>• <strong>Spread Radius:</strong> Size of the shadow</li>
                  <li>• <strong>Color & Opacity:</strong> Shadow color and transparency</li>
                  <li>• <strong>Inset:</strong> Inner shadow instead of drop shadow</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>• Multiple shadow layers support</li>
                  <li>• Real-time preview with customizable element</li>
                  <li>• Pre-made shadow presets</li>
                  <li>• Inset shadow option for depth effects</li>
                  <li>• Copy CSS code or download as file</li>
                  <li>• Responsive controls for all shadow properties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
