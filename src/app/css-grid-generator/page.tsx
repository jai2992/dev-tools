'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Button, Input, Select, Card, CodeBlock, PageHeader } from '@/components/common';

interface GridSettings {
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gap: number;
  rowGap: number;
  columnGap: number;
  justifyItems: 'stretch' | 'start' | 'end' | 'center';
  alignItems: 'stretch' | 'start' | 'end' | 'center';
  justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  alignContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
}

interface GridItemSettings {
  gridColumn: string;
  gridRow: string;
  justifySelf: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  alignSelf: 'auto' | 'start' | 'end' | 'center' | 'stretch';
}

export default function CSSGridGeneratorPage() {
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 100px)',
    gap: 16,
    rowGap: 16,
    columnGap: 16,
    justifyItems: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'start',
    alignContent: 'start'
  });

  const [itemCount, setItemCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [itemSettings, setItemSettings] = useState<{ [key: number]: GridItemSettings }>({});
  const [useIndividualGaps, setUseIndividualGaps] = useState(false);
  const [gridMode, setGridMode] = useState<'template' | 'areas'>('template');

  const presets = [
    {
      name: '3-Column Layout',
      settings: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
        gap: 16,
        rowGap: 16,
        columnGap: 16,
        justifyItems: 'stretch' as const,
        alignItems: 'stretch' as const,
        justifyContent: 'start' as const,
        alignContent: 'start' as const
      }
    },
    {
      name: 'Sidebar Layout',
      settings: {
        gridTemplateColumns: '250px 1fr',
        gridTemplateRows: 'auto',
        gap: 20,
        rowGap: 20,
        columnGap: 20,
        justifyItems: 'stretch' as const,
        alignItems: 'stretch' as const,
        justifyContent: 'start' as const,
        alignContent: 'start' as const
      }
    },
    {
      name: 'Header-Content-Footer',
      settings: {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: 0,
        rowGap: 0,
        columnGap: 0,
        justifyItems: 'stretch' as const,
        alignItems: 'stretch' as const,
        justifyContent: 'start' as const,
        alignContent: 'start' as const
      }
    },
    {
      name: 'Card Grid',
      settings: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gridTemplateRows: 'auto',
        gap: 24,
        rowGap: 24,
        columnGap: 24,
        justifyItems: 'stretch' as const,
        alignItems: 'start' as const,
        justifyContent: 'start' as const,
        alignContent: 'start' as const
      }
    },
    {
      name: 'Dashboard',
      settings: {
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 150px)',
        gap: 12,
        rowGap: 12,
        columnGap: 12,
        justifyItems: 'stretch' as const,
        alignItems: 'stretch' as const,
        justifyContent: 'start' as const,
        alignContent: 'start' as const
      }
    }
  ];

  const updateGridSetting = <K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K]
  ) => {
    setGridSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateItemSetting = <K extends keyof GridItemSettings>(
    itemIndex: number,
    key: K,
    value: GridItemSettings[K]
  ) => {
    setItemSettings(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [key]: value
      }
    }));
  };

  const getItemSettings = (itemIndex: number): GridItemSettings => {
    return itemSettings[itemIndex] || {
      gridColumn: 'auto',
      gridRow: 'auto',
      justifySelf: 'auto',
      alignSelf: 'auto'
    };
  };

  const applyPreset = (preset: GridSettings) => {
    setGridSettings(preset);
    setSelectedItem(null);
    setItemSettings({});
  };

  const generateContainerCSS = () => {
    const css = [
      'display: grid;',
      `grid-template-columns: ${gridSettings.gridTemplateColumns};`,
      `grid-template-rows: ${gridSettings.gridTemplateRows};`
    ];

    if (useIndividualGaps) {
      if (gridSettings.rowGap > 0) css.push(`row-gap: ${gridSettings.rowGap}px;`);
      if (gridSettings.columnGap > 0) css.push(`column-gap: ${gridSettings.columnGap}px;`);
    } else {
      if (gridSettings.gap > 0) css.push(`gap: ${gridSettings.gap}px;`);
    }

    if (gridSettings.justifyItems !== 'stretch') {
      css.push(`justify-items: ${gridSettings.justifyItems};`);
    }
    if (gridSettings.alignItems !== 'stretch') {
      css.push(`align-items: ${gridSettings.alignItems};`);
    }
    if (gridSettings.justifyContent !== 'start') {
      css.push(`justify-content: ${gridSettings.justifyContent};`);
    }
    if (gridSettings.alignContent !== 'start') {
      css.push(`align-content: ${gridSettings.alignContent};`);
    }

    return css.join('\n');
  };

  const generateItemCSS = (itemIndex: number) => {
    const settings = getItemSettings(itemIndex);
    const css = [];

    if (settings.gridColumn !== 'auto') {
      css.push(`grid-column: ${settings.gridColumn};`);
    }
    if (settings.gridRow !== 'auto') {
      css.push(`grid-row: ${settings.gridRow};`);
    }
    if (settings.justifySelf !== 'auto') {
      css.push(`justify-self: ${settings.justifySelf};`);
    }
    if (settings.alignSelf !== 'auto') {
      css.push(`align-self: ${settings.alignSelf};`);
    }

    return css.length > 0 ? css.join('\n') : '/* No custom properties */';
  };

  const generateTailwindCSS = () => {
    const classes = ['grid'];
    
    // Grid template columns
    const colsMap: { [key: string]: string } = {
      'repeat(1, 1fr)': 'grid-cols-1',
      'repeat(2, 1fr)': 'grid-cols-2',
      'repeat(3, 1fr)': 'grid-cols-3',
      'repeat(4, 1fr)': 'grid-cols-4',
      'repeat(5, 1fr)': 'grid-cols-5',
      'repeat(6, 1fr)': 'grid-cols-6',
      'repeat(12, 1fr)': 'grid-cols-12'
    };
    
    const tailwindCols = colsMap[gridSettings.gridTemplateColumns];
    if (tailwindCols) {
      classes.push(tailwindCols);
    } else {
      classes.push(`[grid-template-columns:${gridSettings.gridTemplateColumns}]`);
    }

    // Grid template rows
    const rowsMap: { [key: string]: string } = {
      'repeat(1, 1fr)': 'grid-rows-1',
      'repeat(2, 1fr)': 'grid-rows-2',
      'repeat(3, 1fr)': 'grid-rows-3',
      'repeat(4, 1fr)': 'grid-rows-4',
      'repeat(5, 1fr)': 'grid-rows-5',
      'repeat(6, 1fr)': 'grid-rows-6'
    };
    
    const tailwindRows = rowsMap[gridSettings.gridTemplateRows];
    if (tailwindRows && gridSettings.gridTemplateRows !== 'auto') {
      classes.push(tailwindRows);
    } else if (gridSettings.gridTemplateRows !== 'auto') {
      classes.push(`[grid-template-rows:${gridSettings.gridTemplateRows}]`);
    }

    // Gap
    const gapValue = useIndividualGaps ? 
      (gridSettings.rowGap === gridSettings.columnGap ? gridSettings.rowGap : -1) : 
      gridSettings.gap;
    
    if (gapValue > 0) {
      const gapMap: { [key: number]: string } = {
        4: 'gap-1',
        8: 'gap-2',
        12: 'gap-3',
        16: 'gap-4',
        20: 'gap-5',
        24: 'gap-6'
      };
      const gapClass = gapMap[gapValue] || `gap-[${gapValue}px]`;
      classes.push(gapClass);
    }

    return classes.join(' ');
  };

  const generateFullCSS = () => {
    let css = `.grid-container {\n  ${generateContainerCSS().replace(/\n/g, '\n  ')}\n}`;
    
    // Add item-specific CSS if any items have custom settings
    Object.keys(itemSettings).forEach(itemIndex => {
      const itemCSS = generateItemCSS(Number(itemIndex));
      if (!itemCSS.includes('No custom properties')) {
        css += `\n\n.grid-item-${Number(itemIndex) + 1} {\n  ${itemCSS.replace(/\n/g, '\n  ')}\n}`;
      }
    });

    return css;
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: gridSettings.gridTemplateColumns,
    gridTemplateRows: gridSettings.gridTemplateRows,
    gap: useIndividualGaps ? undefined : `${gridSettings.gap}px`,
    rowGap: useIndividualGaps ? `${gridSettings.rowGap}px` : undefined,
    columnGap: useIndividualGaps ? `${gridSettings.columnGap}px` : undefined,
    justifyItems: gridSettings.justifyItems,
    alignItems: gridSettings.alignItems,
    justifyContent: gridSettings.justifyContent,
    alignContent: gridSettings.alignContent,
    backgroundColor: '#374151',
    border: '2px solid #4b5563',
    borderRadius: '8px',
    padding: '16px',
    minHeight: '300px'
  };

  const getItemStyle = (itemIndex: number) => {
    const settings = getItemSettings(itemIndex);
    return {
      gridColumn: settings.gridColumn !== 'auto' ? settings.gridColumn : undefined,
      gridRow: settings.gridRow !== 'auto' ? settings.gridRow : undefined,
      justifySelf: settings.justifySelf !== 'auto' ? settings.justifySelf : undefined,
      alignSelf: settings.alignSelf !== 'auto' ? settings.alignSelf : undefined,
      backgroundColor: selectedItem === itemIndex ? '#3b82f6' : '#6b7280',
      border: selectedItem === itemIndex ? '2px solid #60a5fa' : '2px solid #9ca3af',
      borderRadius: '4px',
      padding: '12px',
      minHeight: '60px',
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
        <title>CSS Grid Generator | Visual Grid Layout Tool | devtools.software</title>
        <meta name="description" content="Generate CSS Grid layouts with visual editor. Create responsive grid systems with live preview and copy CSS code." />
        <meta property="og:title" content="CSS Grid Generator - Visual Grid Layout Tool" />
        <meta property="og:description" content="Create CSS Grid layouts visually with live preview and generate code" />
        <meta property="og:url" content="https://devtools.software/css-grid-generator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <PageHeader 
        title="CSS Grid Generator"
        description="Generate CSS Grid layouts with visual editor"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Presets */}
          <Card title="Layout Presets">
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
            <Card title="Grid Container">
              <div className="space-y-4">
                <Input
                  label="Grid Template Columns"
                  value={gridSettings.gridTemplateColumns}
                  onChange={(e) => updateGridSetting('gridTemplateColumns', e.target.value)}
                  placeholder="repeat(3, 1fr) or 200px 1fr 200px"
                />

                <Input
                  label="Grid Template Rows"
                  value={gridSettings.gridTemplateRows}
                  onChange={(e) => updateGridSetting('gridTemplateRows', e.target.value)}
                  placeholder="repeat(3, 100px) or auto 1fr auto"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="useIndividualGaps"
                    checked={useIndividualGaps}
                    onChange={(e) => setUseIndividualGaps(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="useIndividualGaps" className="text-sm text-gray-300">
                    Use separate row and column gaps
                  </label>
                </div>

                {useIndividualGaps ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Row Gap: {gridSettings.rowGap}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={gridSettings.rowGap}
                        onChange={(e) => updateGridSetting('rowGap', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Column Gap: {gridSettings.columnGap}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={gridSettings.columnGap}
                        onChange={(e) => updateGridSetting('columnGap', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gap: {gridSettings.gap}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={gridSettings.gap}
                      onChange={(e) => updateGridSetting('gap', Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Justify Items"
                    value={gridSettings.justifyItems}
                    onChange={(e) => updateGridSetting('justifyItems', e.target.value as any)}
                  >
                    <option value="stretch">Stretch</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                  </Select>

                  <Select
                    label="Align Items"
                    value={gridSettings.alignItems}
                    onChange={(e) => updateGridSetting('alignItems', e.target.value as any)}
                  >
                    <option value="stretch">Stretch</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Justify Content"
                    value={gridSettings.justifyContent}
                    onChange={(e) => updateGridSetting('justifyContent', e.target.value as any)}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                    <option value="stretch">Stretch</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-evenly">Space Evenly</option>
                  </Select>

                  <Select
                    label="Align Content"
                    value={gridSettings.alignContent}
                    onChange={(e) => updateGridSetting('alignContent', e.target.value as any)}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                    <option value="stretch">Stretch</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-evenly">Space Evenly</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Items: {itemCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Item Controls */}
            <Card title="Grid Item">
              {selectedItem !== null ? (
                <div className="space-y-4">
                  <div className="text-sm text-blue-400 font-medium">
                    Editing Item {selectedItem + 1}
                  </div>

                  <Input
                    label="Grid Column"
                    value={getItemSettings(selectedItem).gridColumn}
                    onChange={(e) => updateItemSetting(selectedItem, 'gridColumn', e.target.value)}
                    placeholder="auto, 1/3, span 2, etc."
                  />

                  <Input
                    label="Grid Row"
                    value={getItemSettings(selectedItem).gridRow}
                    onChange={(e) => updateItemSetting(selectedItem, 'gridRow', e.target.value)}
                    placeholder="auto, 1/3, span 2, etc."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Justify Self"
                      value={getItemSettings(selectedItem).justifySelf}
                      onChange={(e) => updateItemSetting(selectedItem, 'justifySelf', e.target.value as any)}
                    >
                      <option value="auto">Auto</option>
                      <option value="start">Start</option>
                      <option value="end">End</option>
                      <option value="center">Center</option>
                      <option value="stretch">Stretch</option>
                    </Select>

                    <Select
                      label="Align Self"
                      value={getItemSettings(selectedItem).alignSelf}
                      onChange={(e) => updateItemSetting(selectedItem, 'alignSelf', e.target.value as any)}
                    >
                      <option value="auto">Auto</option>
                      <option value="start">Start</option>
                      <option value="end">End</option>
                      <option value="center">Center</option>
                      <option value="stretch">Stretch</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-300">Quick Actions</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateItemSetting(selectedItem, 'gridColumn', 'span 2')}
                      >
                        Span 2 Cols
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateItemSetting(selectedItem, 'gridRow', 'span 2')}
                      >
                        Span 2 Rows
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateItemSetting(selectedItem, 'gridColumn', '1 / -1')}
                      >
                        Full Width
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setItemSettings(prev => {
                            const newSettings = { ...prev };
                            delete newSettings[selectedItem];
                            return newSettings;
                          });
                        }}
                      >
                        Reset Item
                      </Button>
                    </div>
                  </div>
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
                Click on items to edit their grid positioning and alignment
              </div>
            </div>
          </Card>

          {/* Generated Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
              title="CSS"
              language="css"
              code={generateFullCSS()}
            />

            <CodeBlock
              title="Tailwind CSS"
              language="html"
              code={`<div class="${generateTailwindCSS()}">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}
            />
          </div>

          {/* Usage Instructions */}
          <Card title="CSS Grid Guide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Grid Templates</h4>
                <ul className="space-y-1">
                  <li>• <code>1fr</code> - Fraction of available space</li>
                  <li>• <code>auto</code> - Content-based sizing</li>
                  <li>• <code>100px</code> - Fixed size</li>
                  <li>• <code>repeat(3, 1fr)</code> - Repeat pattern</li>
                  <li>• <code>minmax(200px, 1fr)</code> - Min/max constraints</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Item Positioning</h4>
                <ul className="space-y-1">
                  <li>• <code>span 2</code> - Span across 2 tracks</li>
                  <li>• <code>1 / 3</code> - From line 1 to 3</li>
                  <li>• <code>1 / -1</code> - From start to end</li>
                  <li>• <code>auto</code> - Auto placement</li>
                  <li>• Named lines for semantic grids</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Responsive Features</h4>
                <ul className="space-y-1">
                  <li>• <code>auto-fit</code> - Fit available space</li>
                  <li>• <code>auto-fill</code> - Fill with empty tracks</li>
                  <li>• <code>minmax()</code> - Responsive sizing</li>
                  <li>• Media queries for breakpoints</li>
                  <li>• Container queries (modern browsers)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Common Patterns</h4>
                <ul className="space-y-1">
                  <li>• Cards: <code>repeat(auto-fit, minmax(250px, 1fr))</code></li>
                  <li>• Sidebar: <code>250px 1fr</code></li>
                  <li>• Holy Grail: <code>auto 1fr auto / 200px 1fr 200px</code></li>
                  <li>• Masonry: Use <code>grid-template-rows: masonry</code></li>
                  <li>• Dashboard: <code>repeat(4, 1fr)</code></li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
