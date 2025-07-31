'use client';

import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

interface GradientPreset {
  name: string;
  type: 'linear' | 'radial';
  angle?: number;
  colors: Array<{ color: string; position: number }>;
}

const presets: GradientPreset[] = [
  {
    name: 'Sunset',
    type: 'linear',
    angle: 45,
    colors: [
      { color: '#ff9a9e', position: 0 },
      { color: '#fecfef', position: 50 },
      { color: '#fecfef', position: 100 }
    ]
  },
  {
    name: 'Ocean',
    type: 'linear',
    angle: 180,
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  },
  {
    name: 'Fire',
    type: 'radial',
    colors: [
      { color: '#ff416c', position: 0 },
      { color: '#ff4b2b', position: 100 }
    ]
  },
  {
    name: 'Cool Blues',
    type: 'linear',
    angle: 90,
    colors: [
      { color: '#2196f3', position: 0 },
      { color: '#21cbf3', position: 100 }
    ]
  },
  {
    name: 'Purple Rain',
    type: 'linear',
    angle: 135,
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  },
  {
    name: 'Green Mint',
    type: 'linear',
    angle: 0,
    colors: [
      { color: '#00b09b', position: 0 },
      { color: '#96c93d', position: 100 }
    ]
  }
];

export default function CSSGradientPage() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#ff6b6b', position: 0 },
    { id: '2', color: '#4ecdc4', position: 100 }
  ]);
  const [cssCode, setCssCode] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  const generateCSS = useCallback(() => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorString = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    let css = '';
    if (gradientType === 'linear') {
      css = `background: linear-gradient(${angle}deg, ${colorString});`;
    } else {
      css = `background: radial-gradient(circle, ${colorString});`;
    }

    setCssCode(css);
  }, [gradientType, angle, colorStops]);

  useEffect(() => {
    generateCSS();
  }, [generateCSS]);

  const addColorStop = () => {
    const newId = Date.now().toString();
    const newPosition = colorStops.length > 0 
      ? Math.min(100, Math.max(...colorStops.map(s => s.position)) + 20)
      : 50;
    
    setColorStops([...colorStops, {
      id: newId,
      color: '#ff0000',
      position: newPosition
    }]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(stop => stop.id !== id));
    }
  };

  const updateColorStop = (id: string, field: 'color' | 'position', value: string | number) => {
    setColorStops(colorStops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const loadPreset = (preset: GradientPreset) => {
    setGradientType(preset.type);
    if (preset.angle !== undefined) {
      setAngle(preset.angle);
    }
    
    const newColorStops = preset.colors.map((color, index) => ({
      id: Date.now() + index,
      color: color.color,
      position: color.position
    }));
    
    setColorStops(newColorStops.map(stop => ({ ...stop, id: stop.id.toString() })));
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
    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const randomizeGradient = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    const randomColors = [];
    const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    
    for (let i = 0; i < numColors; i++) {
      randomColors.push({
        id: (Date.now() + i).toString(),
        color: colors[Math.floor(Math.random() * colors.length)],
        position: (i / (numColors - 1)) * 100
      });
    }
    
    setColorStops(randomColors);
    setAngle(Math.floor(Math.random() * 360));
    setGradientType(Math.random() > 0.5 ? 'linear' : 'radial');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>CSS Gradient Generator | Free Online Gradient Creator | devtools.software</title>
        <meta name="description" content="Create beautiful CSS gradients with live preview. Generate linear and radial gradients with multiple colors, custom angles, and copy CSS code instantly." />
        <meta property="og:title" content="CSS Gradient Generator - Create Beautiful Gradients" />
        <meta property="og:description" content="Generate CSS gradients with visual preview and customizable options" />
        <meta property="og:url" content="https://devtools.software/css-gradient" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">CSS Gradient Generator</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Create beautiful CSS gradients with live preview</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Live Preview */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            <div 
              className="w-full h-64 rounded-xl border border-gray-700"
              style={{ background: cssCode.replace('background: ', '').replace(';', '') }}
            />
          </div>

          {/* Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="space-y-6">
              {/* Gradient Type & Angle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gradient Type
                  </label>
                  <select
                    value={gradientType}
                    onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {gradientType === 'linear' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Angle: {angle}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={addColorStop}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    ➕ Add Color
                  </button>
                  <button
                    onClick={randomizeGradient}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    🎲 Random
                  </button>
                </div>
              </div>

              {/* Color Stops */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Color Stops</h4>
                <div className="space-y-3">
                  {colorStops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                        />
                        <input
                          type="text"
                          value={stop.color}
                          onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                          className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 w-12">Position:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) => updateColorStop(stop.id, 'position', Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm text-gray-400 w-12">{stop.position}%</span>
                        </div>
                      </div>

                      {colorStops.length > 2 && (
                        <button
                          onClick={() => removeColorStop(stop.id)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Gradient Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {presets.map((preset, index) => {
                const previewStyle = preset.type === 'linear'
                  ? `linear-gradient(${preset.angle || 90}deg, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                  : `radial-gradient(circle, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                
                return (
                  <button
                    key={index}
                    onClick={() => loadPreset(preset)}
                    className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    <div 
                      className="w-full h-20"
                      style={{ background: previewStyle }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{preset.name}</span>
                    </div>
                  </button>
                );
              })}
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
                <h4 className="font-medium text-blue-400 mb-2">Creating Gradients</h4>
                <ul className="space-y-1">
                  <li>• Choose between linear or radial gradients</li>
                  <li>• Adjust angle for linear gradients (0-360°)</li>
                  <li>• Add multiple color stops with custom positions</li>
                  <li>• Use color picker or enter hex values manually</li>
                  <li>• Preview changes in real-time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>• Live preview with instant updates</li>
                  <li>• Pre-made gradient presets to start with</li>
                  <li>• Random gradient generator</li>
                  <li>• Copy CSS code to clipboard</li>
                  <li>• Download CSS file</li>
                  <li>• Support for unlimited color stops</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
