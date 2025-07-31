'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Button, Select, Card, CodeBlock, PageHeader } from '@/components/common';

interface FlexSettings {
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignContent: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap: number;
}

interface FlexItemSettings {
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export default function FlexboxGeneratorPage() {
  const [flexSettings, setFlexSettings] = useState<FlexSettings>({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    gap: 8
  });

  const [itemCount, setItemCount] = useState(3);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [itemSettings, setItemSettings] = useState<{ [key: number]: FlexItemSettings }>({});
  const [containerHeight, setContainerHeight] = useState(200);

  const updateFlexSetting = <K extends keyof FlexSettings>(
    key: K,
    value: FlexSettings[K]
  ) => {
    setFlexSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateItemSetting = <K extends keyof FlexItemSettings>(
    itemIndex: number,
    key: K,
    value: FlexItemSettings[K]
  ) => {
    setItemSettings(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [key]: value
      }
    }));
  };

  const getItemSettings = (itemIndex: number): FlexItemSettings => {
    return itemSettings[itemIndex] || {
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      alignSelf: 'auto'
    };
  };

  const presets = [
    {
      name: 'Horizontal Center',
      settings: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        alignContent: 'stretch' as const,
        flexWrap: 'nowrap' as const,
        gap: 8
      }
    },
    {
      name: 'Space Between',
      settings: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        alignContent: 'stretch' as const,
        flexWrap: 'nowrap' as const,
        gap: 0
      }
    },
    {
      name: 'Vertical Stack',
      settings: {
        flexDirection: 'column' as const,
        justifyContent: 'flex-start' as const,
        alignItems: 'stretch' as const,
        alignContent: 'stretch' as const,
        flexWrap: 'nowrap' as const,
        gap: 8
      }
    },
    {
      name: 'Grid Layout',
      settings: {
        flexDirection: 'row' as const,
        justifyContent: 'space-evenly' as const,
        alignItems: 'flex-start' as const,
        alignContent: 'flex-start' as const,
        flexWrap: 'wrap' as const,
        gap: 16
      }
    },
    {
      name: 'Card Layout',
      settings: {
        flexDirection: 'row' as const,
        justifyContent: 'flex-start' as const,
        alignItems: 'stretch' as const,
        alignContent: 'stretch' as const,
        flexWrap: 'wrap' as const,
        gap: 12
      }
    }
  ];

  const applyPreset = (preset: FlexSettings) => {
    setFlexSettings(preset);
    setSelectedItem(null);
    setItemSettings({});
  };

  const generateContainerCSS = () => {
    const css = [
      'display: flex;',
      `flex-direction: ${flexSettings.flexDirection};`,
      `justify-content: ${flexSettings.justifyContent};`,
      `align-items: ${flexSettings.alignItems};`,
      `flex-wrap: ${flexSettings.flexWrap};`
    ];

    if (flexSettings.flexWrap !== 'nowrap') {
      css.push(`align-content: ${flexSettings.alignContent};`);
    }

    if (flexSettings.gap > 0) {
      css.push(`gap: ${flexSettings.gap}px;`);
    }

    return css.join('\n');
  };

  const generateItemCSS = (itemIndex: number) => {
    const settings = getItemSettings(itemIndex);
    const css = [];

    if (settings.flexGrow !== 0) {
      css.push(`flex-grow: ${settings.flexGrow};`);
    }
    if (settings.flexShrink !== 1) {
      css.push(`flex-shrink: ${settings.flexShrink};`);
    }
    if (settings.flexBasis !== 'auto') {
      css.push(`flex-basis: ${settings.flexBasis};`);
    }
    if (settings.alignSelf !== 'auto') {
      css.push(`align-self: ${settings.alignSelf};`);
    }

    return css.length > 0 ? css.join('\n') : '/* No custom properties */';
  };

  const generateTailwindCSS = () => {
    const classes = ['flex'];
    
    // Direction
    if (flexSettings.flexDirection !== 'row') {
      const directionMap = {
        'row-reverse': 'flex-row-reverse',
        'column': 'flex-col',
        'column-reverse': 'flex-col-reverse'
      };
      classes.push(directionMap[flexSettings.flexDirection as keyof typeof directionMap]);
    }

    // Justify Content
    const justifyMap = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'center': 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly'
    };
    classes.push(justifyMap[flexSettings.justifyContent]);

    // Align Items
    const alignMap = {
      'stretch': 'items-stretch',
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'center': 'items-center',
      'baseline': 'items-baseline'
    };
    classes.push(alignMap[flexSettings.alignItems]);

    // Flex Wrap
    if (flexSettings.flexWrap === 'wrap') {
      classes.push('flex-wrap');
    } else if (flexSettings.flexWrap === 'wrap-reverse') {
      classes.push('flex-wrap-reverse');
    }

    // Gap
    if (flexSettings.gap > 0) {
      const gapMap: { [key: number]: string } = {
        4: 'gap-1',
        8: 'gap-2',
        12: 'gap-3',
        16: 'gap-4',
        20: 'gap-5',
        24: 'gap-6'
      };
      const gapClass = gapMap[flexSettings.gap] || `gap-[${flexSettings.gap}px]`;
      classes.push(gapClass);
    }

    return classes.join(' ');
  };

  const generateFullCSS = () => {
    let css = `.flex-container {\n  ${generateContainerCSS().replace(/\n/g, '\n  ')}\n}`;
    
    // Add item-specific CSS if any items have custom settings
    Object.keys(itemSettings).forEach(itemIndex => {
      const itemCSS = generateItemCSS(Number(itemIndex));
      if (!itemCSS.includes('No custom properties')) {
        css += `\n\n.flex-item-${Number(itemIndex) + 1} {\n  ${itemCSS.replace(/\n/g, '\n  ')}\n}`;
      }
    });

    return css;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: flexSettings.flexDirection,
    justifyContent: flexSettings.justifyContent,
    alignItems: flexSettings.alignItems,
    alignContent: flexSettings.alignContent,
    flexWrap: flexSettings.flexWrap,
    gap: `${flexSettings.gap}px`,
    height: `${containerHeight}px`,
    backgroundColor: '#374151',
    border: '2px solid #4b5563',
    borderRadius: '8px',
    padding: '16px',
    minHeight: '100px'
  };

  const getItemStyle = (itemIndex: number) => {
    const settings = getItemSettings(itemIndex);
    return {
      flexGrow: settings.flexGrow,
      flexShrink: settings.flexShrink,
      flexBasis: settings.flexBasis,
      alignSelf: settings.alignSelf,
      backgroundColor: selectedItem === itemIndex ? '#3b82f6' : '#6b7280',
      border: selectedItem === itemIndex ? '2px solid #60a5fa' : '2px solid #9ca3af',
      borderRadius: '4px',
      padding: '12px',
      minWidth: '60px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Flexbox Generator | CSS Flex Layout Tool | devtools.software</title>
        <meta name="description" content="Generate CSS Flexbox layouts with live preview. Visual flexbox editor with all properties and interactive controls." />
        <meta property="og:title" content="Flexbox Generator - CSS Flex Layout Tool" />
        <meta property="og:description" content="Create flexbox layouts visually with live preview and generate CSS code" />
        <meta property="og:url" content="https://devtools.software/flexbox-generator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title="Flexbox Generator"
        description="Generate CSS Flexbox layouts with live preview"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Presets */}
          <Card title="Quick Presets">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  onClick={() => applyPreset(preset.settings)}
                  className="text-left"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Container Controls */}
            <Card title="Container Properties">
              <div className="space-y-4">
                <Select
                  label="Flex Direction"
                  value={flexSettings.flexDirection}
                  onChange={(e) => updateFlexSetting('flexDirection', e.target.value as any)}
                >
                  <option value="row">Row →</option>
                  <option value="row-reverse">Row Reverse ←</option>
                  <option value="column">Column ↓</option>
                  <option value="column-reverse">Column Reverse ↑</option>
                </Select>

                <Select
                  label="Justify Content (Main Axis)"
                  value={flexSettings.justifyContent}
                  onChange={(e) => updateFlexSetting('justifyContent', e.target.value as any)}
                >
                  <option value="flex-start">Flex Start</option>
                  <option value="flex-end">Flex End</option>
                  <option value="center">Center</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                  <option value="space-evenly">Space Evenly</option>
                </Select>

                <Select
                  label="Align Items (Cross Axis)"
                  value={flexSettings.alignItems}
                  onChange={(e) => updateFlexSetting('alignItems', e.target.value as any)}
                >
                  <option value="stretch">Stretch</option>
                  <option value="flex-start">Flex Start</option>
                  <option value="flex-end">Flex End</option>
                  <option value="center">Center</option>
                  <option value="baseline">Baseline</option>
                </Select>

                <Select
                  label="Flex Wrap"
                  value={flexSettings.flexWrap}
                  onChange={(e) => updateFlexSetting('flexWrap', e.target.value as any)}
                >
                  <option value="nowrap">No Wrap</option>
                  <option value="wrap">Wrap</option>
                  <option value="wrap-reverse">Wrap Reverse</option>
                </Select>

                {flexSettings.flexWrap !== 'nowrap' && (
                  <Select
                    label="Align Content (Wrapped Lines)"
                    value={flexSettings.alignContent}
                    onChange={(e) => updateFlexSetting('alignContent', e.target.value as any)}
                  >
                    <option value="stretch">Stretch</option>
                    <option value="flex-start">Flex Start</option>
                    <option value="flex-end">Flex End</option>
                    <option value="center">Center</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                  </Select>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gap: {flexSettings.gap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={flexSettings.gap}
                    onChange={(e) => updateFlexSetting('gap', Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Items: {itemCount}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={itemCount}
                      onChange={(e) => setItemCount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Height: {containerHeight}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={containerHeight}
                      onChange={(e) => setContainerHeight(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Item Controls */}
            <Card title="Item Properties">
              {selectedItem !== null ? (
                <div className="space-y-4">
                  <div className="text-sm text-blue-400 font-medium">
                    Editing Item {selectedItem + 1}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Flex Grow: {getItemSettings(selectedItem).flexGrow}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={getItemSettings(selectedItem).flexGrow}
                      onChange={(e) => updateItemSetting(selectedItem, 'flexGrow', Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Flex Shrink: {getItemSettings(selectedItem).flexShrink}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={getItemSettings(selectedItem).flexShrink}
                      onChange={(e) => updateItemSetting(selectedItem, 'flexShrink', Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <Select
                    label="Flex Basis"
                    value={getItemSettings(selectedItem).flexBasis}
                    onChange={(e) => updateItemSetting(selectedItem, 'flexBasis', e.target.value)}
                  >
                    <option value="auto">Auto</option>
                    <option value="0">0</option>
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                    <option value="100px">100px</option>
                    <option value="200px">200px</option>
                  </Select>

                  <Select
                    label="Align Self"
                    value={getItemSettings(selectedItem).alignSelf}
                    onChange={(e) => updateItemSetting(selectedItem, 'alignSelf', e.target.value as any)}
                  >
                    <option value="auto">Auto</option>
                    <option value="flex-start">Flex Start</option>
                    <option value="flex-end">Flex End</option>
                    <option value="center">Center</option>
                    <option value="baseline">Baseline</option>
                    <option value="stretch">Stretch</option>
                  </Select>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setItemSettings(prev => {
                        const newSettings = { ...prev };
                        delete newSettings[selectedItem];
                        return newSettings;
                      });
                      setSelectedItem(null);
                    }}
                  >
                    Reset Item
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Click on an item in the preview to edit its properties
                </div>
              )}
            </Card>
          </div>

          {/* Preview */}
          <Card title="Live Preview">
            <div className="space-y-4">
              <div style={containerStyle}>
                {Array.from({ length: itemCount }, (_, index) => (
                  <div
                    key={index}
                    style={getItemStyle(index)}
                    onClick={() => setSelectedItem(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 text-center">
                Click on items to edit their individual properties
              </div>
            </div>
          </Card>

          {/* Generated Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="CSS">
              <CodeBlock
                language="css"
                code={generateFullCSS()}
              />
            </Card>

            <Card title="Tailwind CSS">
              <CodeBlock
                language="html"
                code={`<div class="${generateTailwindCSS()}">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}
              />
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card title="How to Use Flexbox">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Container Properties</h4>
                <ul className="space-y-1">
                  <li>• <strong>flex-direction:</strong> Direction of main axis</li>
                  <li>• <strong>justify-content:</strong> Alignment along main axis</li>
                  <li>• <strong>align-items:</strong> Alignment along cross axis</li>
                  <li>• <strong>flex-wrap:</strong> Whether items wrap to new lines</li>
                  <li>• <strong>gap:</strong> Space between items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Item Properties</h4>
                <ul className="space-y-1">
                  <li>• <strong>flex-grow:</strong> How much item grows</li>
                  <li>• <strong>flex-shrink:</strong> How much item shrinks</li>
                  <li>• <strong>flex-basis:</strong> Initial size before growing/shrinking</li>
                  <li>• <strong>align-self:</strong> Override container's align-items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Common Patterns</h4>
                <ul className="space-y-1">
                  <li>• Center content: justify-content: center + align-items: center</li>
                  <li>• Space between: justify-content: space-between</li>
                  <li>• Sidebar layout: One item with flex-grow: 1</li>
                  <li>• Card grid: flex-wrap: wrap + flex-basis</li>
                  <li>• Responsive: Combine with media queries</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Browser Support</h4>
                <ul className="space-y-1">
                  <li>• All modern browsers support flexbox</li>
                  <li>• IE 10+ with vendor prefixes</li>
                  <li>• Mobile browsers: Full support</li>
                  <li>• Use autoprefixer for legacy support</li>
                  <li>• Fallback: float or inline-block</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
