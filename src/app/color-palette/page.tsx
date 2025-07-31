'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

interface ColorPalette {
  name: string;
  colors: Color[];
}

type HarmonyType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary';

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
  const [palette, setPalette] = useState<Color[]>([]);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'adobe'>('css');

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Generate color palette based on harmony type
  const generatePalette = useCallback(() => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: Color[] = [];

    // Add base color
    colors.push({
      hex: baseColor,
      rgb,
      hsl,
      name: 'Base'
    });

    switch (harmonyType) {
      case 'monochromatic':
        // Generate different lightness values
        for (let i = 1; i <= 4; i++) {
          const newL = Math.max(10, Math.min(90, hsl.l + (i * 15) - 30));
          const newRgb = hslToRgb(hsl.h, hsl.s, newL);
          colors.push({
            hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
            rgb: newRgb,
            hsl: { h: hsl.h, s: hsl.s, l: newL },
            name: `Mono ${i}`
          });
        }
        break;

      case 'analogous':
        // Generate colors 30 degrees apart
        for (let i = 1; i <= 4; i++) {
          const newH = (hsl.h + (i * 30)) % 360;
          const newRgb = hslToRgb(newH, hsl.s, hsl.l);
          colors.push({
            hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
            rgb: newRgb,
            hsl: { h: newH, s: hsl.s, l: hsl.l },
            name: `Analogous ${i}`
          });
        }
        break;

      case 'complementary':
        // Generate complementary color (180 degrees)
        const compH = (hsl.h + 180) % 360;
        const compRgb = hslToRgb(compH, hsl.s, hsl.l);
        colors.push({
          hex: rgbToHex(compRgb.r, compRgb.g, compRgb.b),
          rgb: compRgb,
          hsl: { h: compH, s: hsl.s, l: hsl.l },
          name: 'Complementary'
        });

        // Add variations
        for (let i = 1; i <= 3; i++) {
          const lightVar = Math.max(10, Math.min(90, hsl.l + (i * 20) - 30));
          const baseVar = hslToRgb(hsl.h, hsl.s, lightVar);
          const compVar = hslToRgb(compH, hsl.s, lightVar);
          
          colors.push({
            hex: rgbToHex(baseVar.r, baseVar.g, baseVar.b),
            rgb: baseVar,
            hsl: { h: hsl.h, s: hsl.s, l: lightVar },
            name: `Base Light ${i}`
          });
          
          colors.push({
            hex: rgbToHex(compVar.r, compVar.g, compVar.b),
            rgb: compVar,
            hsl: { h: compH, s: hsl.s, l: lightVar },
            name: `Comp Light ${i}`
          });
        }
        break;

      case 'triadic':
        // Generate triadic colors (120 degrees apart)
        for (let i = 1; i <= 2; i++) {
          const newH = (hsl.h + (i * 120)) % 360;
          const newRgb = hslToRgb(newH, hsl.s, hsl.l);
          colors.push({
            hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
            rgb: newRgb,
            hsl: { h: newH, s: hsl.s, l: hsl.l },
            name: `Triadic ${i}`
          });
        }
        
        // Add lighter and darker variations
        [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360].forEach((h, index) => {
          const lightRgb = hslToRgb(h, hsl.s, Math.min(90, hsl.l + 25));
          const darkRgb = hslToRgb(h, hsl.s, Math.max(10, hsl.l - 25));
          
          colors.push({
            hex: rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
            rgb: lightRgb,
            hsl: { h, s: hsl.s, l: Math.min(90, hsl.l + 25) },
            name: `Light ${index + 1}`
          });
          
          colors.push({
            hex: rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
            rgb: darkRgb,
            hsl: { h, s: hsl.s, l: Math.max(10, hsl.l - 25) },
            name: `Dark ${index + 1}`
          });
        });
        break;

      case 'tetradic':
        // Generate tetradic colors (90 degrees apart)
        for (let i = 1; i <= 3; i++) {
          const newH = (hsl.h + (i * 90)) % 360;
          const newRgb = hslToRgb(newH, hsl.s, hsl.l);
          colors.push({
            hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
            rgb: newRgb,
            hsl: { h: newH, s: hsl.s, l: hsl.l },
            name: `Tetradic ${i}`
          });
        }
        break;

      case 'split-complementary':
        // Generate split complementary colors
        const split1H = (hsl.h + 150) % 360;
        const split2H = (hsl.h + 210) % 360;
        
        [split1H, split2H].forEach((h, index) => {
          const newRgb = hslToRgb(h, hsl.s, hsl.l);
          colors.push({
            hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
            rgb: newRgb,
            hsl: { h, s: hsl.s, l: hsl.l },
            name: `Split ${index + 1}`
          });
        });
        break;
    }

    setPalette(colors.slice(0, 8)); // Limit to 8 colors for display
  }, [baseColor, harmonyType]);

  // Generate random palette
  const generateRandomPalette = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const { r, g, b } = hslToRgb(randomHue, 70 + Math.random() * 30, 40 + Math.random() * 40);
    const randomColor = rgbToHex(r, g, b);
    setBaseColor(randomColor);
  };

  // Check color contrast
  const getContrastRatio = (color1: Color, color2: Color): number => {
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1.rgb.r, color1.rgb.g, color1.rgb.b);
    const lum2 = getLuminance(color2.rgb.r, color2.rgb.g, color2.rgb.b);
    
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  };

  // Copy single color
  const copyColor = async (color: Color, format: 'hex' | 'rgb' | 'hsl') => {
    let value = '';
    switch (format) {
      case 'hex':
        value = color.hex;
        break;
      case 'rgb':
        value = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        break;
      case 'hsl':
        value = `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`;
        break;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback(`${format.toUpperCase()} copied!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  // Export palette
  const exportPalette = async () => {
    let content = '';
    
    switch (exportFormat) {
      case 'css':
        content = `:root {\n${palette.map((color, index) => 
          `  --color-${index + 1}: ${color.hex};`
        ).join('\n')}\n}`;
        break;
        
      case 'json':
        content = JSON.stringify({
          name: `${harmonyType} palette`,
          colors: palette.map(color => ({
            name: color.name,
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl
          }))
        }, null, 2);
        break;
        
      case 'adobe':
        content = palette.map(color => 
          `${color.hex}\t${color.rgb.r}\t${color.rgb.g}\t${color.rgb.b}`
        ).join('\n');
        break;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedback(`${exportFormat.toUpperCase()} palette copied!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const downloadPalette = () => {
    let content = '';
    let filename = '';
    
    switch (exportFormat) {
      case 'css':
        content = `:root {\n${palette.map((color, index) => 
          `  --color-${index + 1}: ${color.hex};`
        ).join('\n')}\n}`;
        filename = 'palette.css';
        break;
        
      case 'json':
        content = JSON.stringify({
          name: `${harmonyType} palette`,
          colors: palette.map(color => ({
            name: color.name,
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl
          }))
        }, null, 2);
        filename = 'palette.json';
        break;
        
      case 'adobe':
        content = palette.map(color => 
          `${color.hex}\t${color.rgb.r}\t${color.rgb.g}\t${color.rgb.b}`
        ).join('\n');
        filename = 'palette.ase';
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Color Palette Generator | Free Color Harmony Tool | devtools.software</title>
        <meta name="description" content="Generate beautiful color palettes using color theory. Create complementary, triadic, analogous color schemes with accessibility checking and export options." />
        <meta property="og:title" content="Color Palette Generator - Create Beautiful Color Schemes" />
        <meta property="og:description" content="Generate color palettes with harmony rules and accessibility checking" />
        <meta property="og:url" content="https://devtools.software/color-palette" />
        <meta name="robots" content="index,follow" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">Color Palette Generator</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">Generate beautiful color palettes using color theory</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Harmony Type
                </label>
                <select
                  value={harmonyType}
                  onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="complementary">Complementary</option>
                  <option value="monochromatic">Monochromatic</option>
                  <option value="analogous">Analogous</option>
                  <option value="triadic">Triadic</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="split-complementary">Split Complementary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'css' | 'json' | 'adobe')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="css">CSS Variables</option>
                  <option value="json">JSON</option>
                  <option value="adobe">Adobe Swatch</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={generatePalette}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  🎨 Generate
                </button>
                <button
                  onClick={generateRandomPalette}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  🎲 Random
                </button>
              </div>
            </div>
          </div>

          {/* Palette Display */}
          {palette.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Generated Palette</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportPalette}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    📋 Copy Palette
                  </button>
                  <button
                    onClick={downloadPalette}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    💾 Download
                  </button>
                  {copyFeedback && (
                    <span className="text-green-400 py-2">{copyFeedback}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {palette.map((color, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div 
                      className="h-24 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-4">
                      <div className="text-white font-medium mb-2">{color.name}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">HEX</span>
                          <button
                            onClick={() => copyColor(color, 'hex')}
                            className="text-blue-400 hover:text-blue-300 font-mono"
                          >
                            {color.hex}
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">RGB</span>
                          <button
                            onClick={() => copyColor(color, 'rgb')}
                            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                          >
                            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">HSL</span>
                          <button
                            onClick={() => copyColor(color, 'hsl')}
                            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                          >
                            {Math.round(color.hsl.h)}°, {Math.round(color.hsl.s)}%, {Math.round(color.hsl.l)}%
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility Check */}
          {palette.length > 1 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Accessibility Check</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {palette.slice(0, 4).map((color1, i) => (
                  palette.slice(i + 1, 5).map((color2, j) => {
                    const contrast = getContrastRatio(color1, color2);
                    const level = contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : contrast >= 3 ? 'AA Large' : 'Fail';
                    const levelColor = contrast >= 7 ? 'text-green-400' : contrast >= 4.5 ? 'text-yellow-400' : contrast >= 3 ? 'text-orange-400' : 'text-red-400';
                    
                    return (
                      <div key={`${i}-${j}`} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: color1.hex }} />
                          <span className="text-gray-400">vs</span>
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: color2.hex }} />
                        </div>
                        <div className="text-sm">
                          <div className="text-gray-300">Contrast: {contrast.toFixed(2)}:1</div>
                          <div className={`font-medium ${levelColor}`}>WCAG: {level}</div>
                        </div>
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Color Harmony Types</h4>
                <ul className="space-y-1">
                  <li>• <strong>Complementary:</strong> Opposite colors on color wheel</li>
                  <li>• <strong>Monochromatic:</strong> Different shades of same color</li>
                  <li>• <strong>Analogous:</strong> Adjacent colors on color wheel</li>
                  <li>• <strong>Triadic:</strong> Three evenly spaced colors</li>
                  <li>• <strong>Tetradic:</strong> Four colors forming rectangle</li>
                  <li>• <strong>Split Complementary:</strong> Base + two adjacent to complement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>• Color theory-based palette generation</li>
                  <li>• Multiple export formats (CSS, JSON, Adobe)</li>
                  <li>• WCAG accessibility contrast checking</li>
                  <li>• Copy individual colors in different formats</li>
                  <li>• Random palette generation</li>
                  <li>• Real-time color value conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
