'use client';

import { useState, useRef, useEffect } from 'react';
import { FaceSmileIcon, ArrowDownTrayIcon, PrinterIcon, QrCodeIcon } from '@heroicons/react/24/outline';

interface BarcodeConfig {
  text: string;
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  textPosition: 'bottom' | 'top';
  fontOptions: string;
  font: string;
  textMargin: number;
  backgroundColor: string;
  lineColor: string;
  margin: number;
}

export default function BarcodeGenerator() {
  const [config, setConfig] = useState<BarcodeConfig>({
    text: '',
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    textAlign: 'center',
    textPosition: 'bottom',
    fontOptions: '',
    font: 'monospace',
    textMargin: 2,
    backgroundColor: '#ffffff',
    lineColor: '#000000',
    margin: 10
  });

  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128', description: 'Most versatile, supports all ASCII characters' },
    { value: 'CODE39', label: 'CODE39', description: 'Alphanumeric, widely used in automotive and defense' },
    { value: 'EAN13', label: 'EAN-13', description: '13-digit European product code' },
    { value: 'EAN8', label: 'EAN-8', description: '8-digit short version of EAN-13' },
    { value: 'UPC', label: 'UPC-A', description: '12-digit North American product code' },
    { value: 'ITF14', label: 'ITF-14', description: '14-digit shipping container code' },
    { value: 'pharmacode', label: 'Pharmacode', description: 'Pharmaceutical packaging' },
    { value: 'codabar', label: 'Codabar', description: 'Libraries, photo labs, blood banks' }
  ];

  const generateBarcode = async (value?: string, format?: string): Promise<void> => {
    const textValue = value || config.text;
    const formatValue = format || config.format;
    
    if (!textValue.trim()) {
      setError('Please enter text to encode');
      setBarcodeUrl('');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Dynamically import JsBarcode
      const JsBarcode = (await import('jsbarcode')).default;
      
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available');

      // Validate input based on barcode format
      const validationError = validateInput(textValue, formatValue);
      if (validationError) {
        setError(validationError);
        setIsGenerating(false);
        return;
      }

      // Generate barcode
      JsBarcode(canvas, textValue, {
        format: formatValue,
        width: config.width,
        height: config.height,
        displayValue: config.displayValue,
        fontSize: config.fontSize,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        font: config.font,
        textMargin: config.textMargin,
        background: config.backgroundColor,
        lineColor: config.lineColor,
        margin: config.margin
      });

      // Convert canvas to blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setBarcodeUrl(url);
        }
      });

    } catch (error: unknown) {
      console.error('Barcode generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to generate barcode: ${errorMessage}`);
      setBarcodeUrl('');
    } finally {
      setIsGenerating(false);
    }
  };

  const validateInput = (text: string, format: string): string | null => {
    switch (format) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(text)) {
          return 'EAN-13 requires 12-13 digits only';
        }
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(text)) {
          return 'EAN-8 requires 7-8 digits only';
        }
        break;
      case 'UPC':
        if (!/^\d{11,12}$/.test(text)) {
          return 'UPC-A requires 11-12 digits only';
        }
        break;
      case 'ITF14':
        if (!/^\d{13,14}$/.test(text)) {
          return 'ITF-14 requires 13-14 digits only';
        }
        break;
      case 'CODE39':
        if (!/^[A-Z0-9\-. $/+%]*$/.test(text)) {
          return 'CODE39 supports only: A-Z, 0-9, and symbols: - . $ / + % [space]';
        }
        break;
      case 'pharmacode':
        const num = parseInt(text);
        if (isNaN(num) || num < 3 || num > 131070) {
          return 'Pharmacode requires a number between 3 and 131070';
        }
        break;
      case 'codabar':
        if (!/^[A-D][0-9\-$:/.+]*[A-D]$/i.test(text)) {
          return 'Codabar must start and end with A, B, C, or D';
        }
        break;
    }
    return null;
  };

  const downloadBarcode = () => {
    if (!barcodeUrl) return;

    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = `barcode_${config.format}_${Date.now()}.png`;
    a.click();
  };

  const printBarcode = () => {
    if (!barcodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
              @media print { body { margin: 0; padding: 0; } }
            </style>
          </head>
          <body>
            <img src="${barcodeUrl}" alt="Barcode" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getFormatExample = (format: string): string => {
    switch (format) {
      case 'CODE128': return 'Hello World 123';
      case 'CODE39': return 'HELLO123';
      case 'EAN13': return '1234567890123';
      case 'EAN8': return '12345678';
      case 'UPC': return '123456789012';
      case 'ITF14': return '12345678901234';
      case 'pharmacode': return '1234';
      case 'codabar': return 'A123456B';
      default: return 'Example text';
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (config.text.trim()) {
        generateBarcode();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [config]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <QrCodeIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Barcode Generator
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mt-2">
                Generate professional barcodes for products and inventory
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-orange-500/20 text-orange-200 px-3 py-1 rounded-full text-sm">Multiple Formats</span>
            <span className="bg-orange-500/20 text-orange-200 px-3 py-1 rounded-full text-sm">Print Ready</span>
            <span className="bg-orange-500/20 text-orange-200 px-3 py-1 rounded-full text-sm">High Quality</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Configuration Panel */}
            <div className="space-y-6">
              
              {/* Barcode Format Selection */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Barcode Format</h3>
                
                <div className="space-y-3">
                  {barcodeFormats.map((format) => (
                    <label key={format.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={config.format === format.value}
                        onChange={(e) => {
                          setConfig(prev => ({ 
                            ...prev, 
                            format: e.target.value,
                            text: getFormatExample(e.target.value)
                          }));
                        }}
                        className="mt-1 w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-medium text-white">{format.label}</div>
                        <div className="text-xs text-gray-400">{format.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Barcode Content</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text to encode
                  </label>
                  <input
                    type="text"
                    value={config.text}
                    onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                    placeholder={getFormatExample(config.format)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    Example for {config.format}: {getFormatExample(config.format)}
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Appearance Settings */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
                
                <div className="space-y-4">
                  {/* Size Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Width: {config.width}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={config.width}
                        onChange={(e) => setConfig(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Height: {config.height}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={config.height}
                        onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Line Color</label>
                      <input
                        type="color"
                        value={config.lineColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, lineColor: e.target.value }))}
                        className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Settings */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.displayValue}
                        onChange={(e) => setConfig(prev => ({ ...prev, displayValue: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                      />
                      Display text below barcode
                    </label>

                    {config.displayValue && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Font Size: {config.fontSize}px
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="30"
                            value={config.fontSize}
                            onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Text Align</label>
                          <select
                            value={config.textAlign}
                            onChange={(e) => setConfig(prev => ({ ...prev, textAlign: e.target.value as 'left' | 'center' | 'right' }))}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Margin: {config.margin}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={config.margin}
                      onChange={(e) => setConfig(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview and Download */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Barcode Preview</h3>
              
              <div className="text-center">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : error ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-red-400 mb-2">⚠️</div>
                      <p className="text-red-400">{error}</p>
                    </div>
                  </div>
                ) : barcodeUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={barcodeUrl}
                        alt="Generated Barcode"
                        className="max-w-full h-auto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={downloadBarcode}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                          Download
                        </button>
                        
                        <button
                          onClick={printBarcode}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <PrinterIcon className="w-5 h-5" />
                          Print
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        Format: {config.format} • Size: {config.width}x{config.height}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <QrCodeIcon className="w-16 h-16 mx-auto mb-4" />
                      <p>Enter text to generate barcode</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for barcode generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Barcode Format Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">CODE128</h4>
                <p className="text-sm">
                  Most versatile format supporting all ASCII characters. Great for general-purpose applications.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">EAN/UPC</h4>
                <p className="text-sm">
                  Standard for retail products. EAN for Europe, UPC for North America. Must be numeric only.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">CODE39</h4>
                <p className="text-sm">
                  Alphanumeric format widely used in automotive and defense industries. Simple and reliable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
