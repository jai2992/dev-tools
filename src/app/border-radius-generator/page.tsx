'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Button, Input, Card, CodeBlock, PageHeader } from '@/components/common';

interface BorderRadiusValue {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export default function BorderRadiusGeneratorPage() {
  const [borderRadius, setBorderRadius] = useState<BorderRadiusValue>({
    topLeft: 20,
    topRight: 20,
    bottomRight: 20,
    bottomLeft: 20
  });
  const [linkedValues, setLinkedValues] = useState(true);
  const [unit, setUnit] = useState<'px' | 'rem' | '%' | 'em'>('px');
  const [previewBg, setPreviewBg] = useState('#3b82f6');
  const [previewSize, setPreviewSize] = useState(200);

  const presets = [
    { name: 'None', values: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
    { name: 'Small', values: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
    { name: 'Medium', values: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 } },
    { name: 'Large', values: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 } },
    { name: 'Extra Large', values: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 } },
    { name: 'Rounded', values: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
    { name: 'Pill', values: { topLeft: 999, topRight: 999, bottomRight: 999, bottomLeft: 999 } },
    { name: 'Top Only', values: { topLeft: 16, topRight: 16, bottomRight: 0, bottomLeft: 0 } },
    { name: 'Bottom Only', values: { topLeft: 0, topRight: 0, bottomRight: 16, bottomLeft: 16 } },
    { name: 'Left Only', values: { topLeft: 16, topRight: 0, bottomRight: 0, bottomLeft: 16 } },
    { name: 'Right Only', values: { topLeft: 0, topRight: 16, bottomRight: 16, bottomLeft: 0 } },
    { name: 'Organic 1', values: { topLeft: 60, topRight: 15, bottomRight: 30, bottomLeft: 45 } },
    { name: 'Organic 2', values: { topLeft: 25, topRight: 75, bottomRight: 25, bottomLeft: 75 } },
    { name: 'Blob', values: { topLeft: 30, topRight: 70, bottomRight: 40, bottomLeft: 80 } }
  ];

  const updateBorderRadius = (corner: keyof BorderRadiusValue, value: number) => {
    if (linkedValues) {
      setBorderRadius({
        topLeft: value,
        topRight: value,
        bottomRight: value,
        bottomLeft: value
      });
    } else {
      setBorderRadius(prev => ({
        ...prev,
        [corner]: value
      }));
    }
  };

  const applyPreset = (preset: BorderRadiusValue) => {
    setBorderRadius(preset);
  };

  const generateCSS = () => {
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius;
    
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `border-radius: ${topLeft}${unit};`;
    }
    
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  };

  const generateTailwindCSS = () => {
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius;
    
    // Common Tailwind values mapping
    const tailwindMap: { [key: number]: string } = {
      0: '0',
      2: 'sm',
      4: '',
      6: 'md',
      8: 'lg',
      12: 'xl',
      16: '2xl',
      24: '3xl',
      9999: 'full'
    };

    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      const tailwindValue = tailwindMap[topLeft];
      if (tailwindValue !== undefined) {
        return `rounded${tailwindValue ? '-' + tailwindValue : ''}`;
      }
      return `rounded-[${topLeft}${unit}]`;
    }

    // Individual corner classes
    const corners: string[] = [];
    if (topLeft === topRight && bottomLeft === bottomRight && topLeft === bottomLeft) {
      const tailwindValue = tailwindMap[topLeft];
      return `rounded${tailwindValue ? '-' + tailwindValue : ''}`;
    }

    const cornerMap = {
      topLeft: 'tl',
      topRight: 'tr',
      bottomRight: 'br',
      bottomLeft: 'bl'
    };

    Object.entries(borderRadius).forEach(([corner, value]) => {
      const tailwindValue = tailwindMap[value];
      const cornerCode = cornerMap[corner as keyof BorderRadiusValue];
      
      if (tailwindValue !== undefined) {
        corners.push(`rounded-${cornerCode}${tailwindValue ? '-' + tailwindValue : ''}`);
      } else {
        corners.push(`rounded-${cornerCode}-[${value}${unit}]`);
      }
    });

    return corners.join(' ');
  };

  const generateSCSS = () => {
    const css = generateCSS();
    return `$border-radius: ${borderRadius.topLeft}${unit} ${borderRadius.topRight}${unit} ${borderRadius.bottomRight}${unit} ${borderRadius.bottomLeft}${unit};

.element {
  ${css}
}`;
  };

  const resetValues = () => {
    setBorderRadius({
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0
    });
  };

  const previewStyle = {
    width: `${previewSize}px`,
    height: `${previewSize}px`,
    backgroundColor: previewBg,
    borderRadius: `${borderRadius.topLeft}${unit} ${borderRadius.topRight}${unit} ${borderRadius.bottomRight}${unit} ${borderRadius.bottomLeft}${unit}`,
    transition: 'all 0.3s ease'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Border Radius Generator | CSS Border Radius Tool | devtools.software</title>
        <meta name="description" content="Generate CSS border-radius values with live preview. Create rounded corners, organic shapes, and custom border radius for web design." />
        <meta property="og:title" content="Border Radius Generator - CSS Border Radius Tool" />
        <meta property="og:description" content="Generate custom border radius values with live preview and copy CSS code" />
        <meta property="og:url" content="https://devtools.software/border-radius-generator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title="Border Radius Generator"
        description="Generate CSS border-radius values with live preview"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <Card title="Controls">
              <div className="space-y-6">
                {/* Unit Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
                  <div className="flex gap-2">
                    {(['px', 'rem', '%', 'em'] as const).map(unitOption => (
                      <Button
                        key={unitOption}
                        variant={unit === unitOption ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setUnit(unitOption)}
                      >
                        {unitOption}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Link Values Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="linkedValues"
                    checked={linkedValues}
                    onChange={(e) => setLinkedValues(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="linkedValues" className="text-sm text-gray-300">
                    🔗 Link all corners
                  </label>
                </div>

                {/* Individual Corner Controls */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Corner Values</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Top Left */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">↖ Top Left</label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius.topLeft}
                          onChange={(e) => updateBorderRadius('topLeft', Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <Input
                          type="number"
                          value={borderRadius.topLeft}
                          onChange={(e) => updateBorderRadius('topLeft', Number(e.target.value))}
                          className="w-16 text-center"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Top Right */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">↗ Top Right</label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius.topRight}
                          onChange={(e) => updateBorderRadius('topRight', Number(e.target.value))}
                          disabled={linkedValues}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <Input
                          type="number"
                          value={borderRadius.topRight}
                          onChange={(e) => updateBorderRadius('topRight', Number(e.target.value))}
                          disabled={linkedValues}
                          className="w-16 text-center"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Bottom Left */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">↙ Bottom Left</label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius.bottomLeft}
                          onChange={(e) => updateBorderRadius('bottomLeft', Number(e.target.value))}
                          disabled={linkedValues}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <Input
                          type="number"
                          value={borderRadius.bottomLeft}
                          onChange={(e) => updateBorderRadius('bottomLeft', Number(e.target.value))}
                          disabled={linkedValues}
                          className="w-16 text-center"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Bottom Right */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">↘ Bottom Right</label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius.bottomRight}
                          onChange={(e) => updateBorderRadius('bottomRight', Number(e.target.value))}
                          disabled={linkedValues}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <Input
                          type="number"
                          value={borderRadius.bottomRight}
                          onChange={(e) => updateBorderRadius('bottomRight', Number(e.target.value))}
                          disabled={linkedValues}
                          className="w-16 text-center"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={resetValues}>
                    🔄 Reset
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card title="Preview">
              <div className="space-y-4">
                {/* Preview Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={previewBg}
                        onChange={(e) => setPreviewBg(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 bg-transparent"
                      />
                      <Input
                        value={previewBg}
                        onChange={(e) => setPreviewBg(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Size: {previewSize}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={previewSize}
                      onChange={(e) => setPreviewSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview Element */}
                <div className="flex justify-center p-8 bg-gray-800 rounded-lg">
                  <div style={previewStyle} className="shadow-xl" />
                </div>

                {/* Values Display */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>↖ TL: {borderRadius.topLeft}{unit}</div>
                    <div>↗ TR: {borderRadius.topRight}{unit}</div>
                    <div>↙ BL: {borderRadius.bottomLeft}{unit}</div>
                    <div>↘ BR: {borderRadius.bottomRight}{unit}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Presets */}
          <Card title="Presets">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset.values)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-center transition-colors"
                >
                  <div
                    className="w-12 h-12 mx-auto mb-2 bg-blue-500"
                    style={{
                      borderRadius: `${preset.values.topLeft}px ${preset.values.topRight}px ${preset.values.bottomRight}px ${preset.values.bottomLeft}px`
                    }}
                  />
                  <div className="text-xs text-gray-300">{preset.name}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Generated Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="CSS">
              <CodeBlock
                language="css"
                code={generateCSS()}
              />
            </Card>

            <Card title="Tailwind CSS">
              <CodeBlock
                language="html"
                code={generateTailwindCSS()}
              />
            </Card>
          </div>

          <Card title="SCSS/Sass">
            <CodeBlock
              language="scss"
              code={generateSCSS()}
            />
          </Card>

          {/* Usage Instructions */}
          <Card title="How to Use">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Creating Border Radius</h4>
                <ul className="space-y-1">
                  <li>• Use sliders or input fields to adjust corners</li>
                  <li>• Link corners for uniform radius</li>
                  <li>• Try different units (px, rem, %, em)</li>
                  <li>• Preview changes in real-time</li>
                  <li>• Choose from preset shapes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Copy & Use</h4>
                <ul className="space-y-1">
                  <li>• Copy CSS code to your stylesheets</li>
                  <li>• Use Tailwind classes for utility-first CSS</li>
                  <li>• Apply to any HTML element</li>
                  <li>• Works with borders, backgrounds, images</li>
                  <li>• Compatible with all modern browsers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Design Tips</h4>
                <ul className="space-y-1">
                  <li>• Use subtle radius for professional look</li>
                  <li>• Larger radius for playful designs</li>
                  <li>• Organic shapes for unique elements</li>
                  <li>• Consider container size and content</li>
                  <li>• Test on different screen sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Common Uses</h4>
                <ul className="space-y-1">
                  <li>• Buttons and interactive elements</li>
                  <li>• Cards and content containers</li>
                  <li>• Images and media elements</li>
                  <li>• Modals and overlay components</li>
                  <li>• Custom shape designs</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
