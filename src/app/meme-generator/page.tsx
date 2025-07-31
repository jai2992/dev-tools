'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FaceSmileIcon, ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

interface TextSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  x: number;
  y: number;
  maxWidth: number;
}

export default function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  
  const [topText, setTopText] = useState<TextSettings>({
    text: '',
    fontSize: 48,
    fontFamily: 'Impact, Arial Black, sans-serif',
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
    x: 0,
    y: 60,
    maxWidth: 0
  });
  
  const [bottomText, setBottomText] = useState<TextSettings>({
    text: '',
    fontSize: 48,
    fontFamily: 'Impact, Arial Black, sans-serif',
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
    x: 0,
    y: 0,
    maxWidth: 0
  });
  
  const [memeUrl, setMemeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Popular meme templates (in production, these would come from an API)
  const memeTemplates: MemeTemplate[] = [
    {
      id: 'drake',
      name: 'Drake Pointing',
      url: 'https://i.imgflip.com/30b1gx.jpg',
      width: 1200,
      height: 1200
    },
    {
      id: 'distracted-boyfriend',
      name: 'Distracted Boyfriend',
      url: 'https://i.imgflip.com/1ur9b0.jpg',
      width: 1200,
      height: 800
    },
    {
      id: 'woman-yelling-cat',
      name: 'Woman Yelling at Cat',
      url: 'https://i.imgflip.com/345v97.jpg',
      width: 1200,
      height: 675
    },
    {
      id: 'change-my-mind',
      name: 'Change My Mind',
      url: 'https://i.imgflip.com/24y43o.jpg',
      width: 1200,
      height: 900
    },
    {
      id: 'this-is-fine',
      name: 'This is Fine',
      url: 'https://i.imgflip.com/26am.jpg',
      width: 1200,
      height: 900
    }
  ];

  const fontOptions = [
    'Impact, Arial Black, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Comic Sans MS, cursive',
    'Times New Roman, serif'
  ];

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setCustomImage(null);
    setCustomImageUrl('');
    
    // Reset text positions for template
    setTopText(prev => ({ ...prev, maxWidth: template.width - 40, x: 20 }));
    setBottomText(prev => ({ 
      ...prev, 
      maxWidth: template.width - 40, 
      x: 20, 
      y: template.height - 20
    }));
  };

  const handleCustomImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setCustomImage(file);
    setSelectedTemplate(null);
    
    const url = URL.createObjectURL(file);
    setCustomImageUrl(url);
    
    // Get image dimensions and set text positions
    const img = new Image();
    img.onload = () => {
      setTopText(prev => ({ ...prev, maxWidth: img.width - 40, x: 20 }));
      setBottomText(prev => ({ 
        ...prev, 
        maxWidth: img.width - 40, 
        x: 20, 
        y: img.height - 20
      }));
    };
    img.src = url;
  }, []);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawTextWithStroke = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    settings: TextSettings
  ) => {
    const lines = wrapText(ctx, text, x, y, settings.maxWidth, settings.fontSize * 1.2);
    
    lines.forEach((line, index) => {
      const lineY = y + (index * settings.fontSize * 1.2);
      const textWidth = ctx.measureText(line).width;
      const centerX = x + (settings.maxWidth - textWidth) / 2;
      
      // Draw stroke
      ctx.strokeStyle = settings.strokeColor;
      ctx.lineWidth = settings.strokeWidth;
      ctx.strokeText(line, centerX, lineY);
      
      // Draw fill
      ctx.fillStyle = settings.color;
      ctx.fillText(line, centerX, lineY);
    });
  };

  const generateMeme = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsGenerating(true);
    
    try {
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Set font properties
        ctx.font = `${topText.fontSize}px ${topText.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Draw top text
        if (topText.text.trim()) {
          drawTextWithStroke(ctx, topText.text.toUpperCase(), topText.x, topText.y, topText);
        }
        
        // Draw bottom text
        if (bottomText.text.trim()) {
          ctx.font = `${bottomText.fontSize}px ${bottomText.fontFamily}`;
          ctx.textBaseline = 'bottom';
          drawTextWithStroke(ctx, bottomText.text.toUpperCase(), bottomText.x, bottomText.y, bottomText);
        }
        
        // Convert to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setMemeUrl(url);
          }
          setIsGenerating(false);
        });
      };
      
      img.crossOrigin = 'anonymous';
      img.src = selectedTemplate ? selectedTemplate.url : customImageUrl;
      
    } catch (error) {
      console.error('Meme generation failed:', error);
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (!memeUrl) return;
    
    const a = document.createElement('a');
    a.href = memeUrl;
    a.download = `meme_${Date.now()}.png`;
    a.click();
  };

  // Generate meme when text or image changes
  useEffect(() => {
    if ((selectedTemplate || customImage) && (topText.text || bottomText.text)) {
      const timeoutId = setTimeout(() => {
        generateMeme();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedTemplate, customImage, topText, bottomText]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <FaceSmileIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Meme Generator
              </h1>
              <p className="text-lg md:text-xl text-yellow-100 mt-2">
                Create hilarious memes with popular templates or custom images
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">Popular Templates</span>
            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">Custom Images</span>
            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">Text Styling</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Template Selection */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {memeTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        selectedTemplate?.id === template.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-white text-sm">{template.name}</div>
                      <div className="text-xs text-gray-400">
                        {template.width}×{template.height}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Custom Image Upload */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-md font-semibold text-gray-300 mb-3">Or Upload Custom Image</h4>
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-yellow-500 transition-colors cursor-pointer text-center"
                    onClick={() => document.getElementById('custom-image-input')?.click()}
                  >
                    <PhotoIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                  </div>
                  <input
                    id="custom-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCustomImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                  {customImage && (
                    <div className="mt-2 text-sm text-gray-400">
                      Selected: {customImage.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Text Settings */}
              {(selectedTemplate || customImage) && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4">Text Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Top Text */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-300 mb-3">Top Text</h4>
                      <div className="space-y-3">
                        <textarea
                          value={topText.text}
                          onChange={(e) => setTopText(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter top text..."
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                            <input
                              type="range"
                              min="20"
                              max="80"
                              value={topText.fontSize}
                              onChange={(e) => setTopText(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-400 text-center">{topText.fontSize}px</div>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Stroke Width</label>
                            <input
                              type="range"
                              min="0"
                              max="8"
                              value={topText.strokeWidth}
                              onChange={(e) => setTopText(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-400 text-center">{topText.strokeWidth}px</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                            <input
                              type="color"
                              value={topText.color}
                              onChange={(e) => setTopText(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full h-8 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Stroke Color</label>
                            <input
                              type="color"
                              value={topText.strokeColor}
                              onChange={(e) => setTopText(prev => ({ ...prev, strokeColor: e.target.value }))}
                              className="w-full h-8 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Text */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-300 mb-3">Bottom Text</h4>
                      <div className="space-y-3">
                        <textarea
                          value={bottomText.text}
                          onChange={(e) => setBottomText(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter bottom text..."
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                            <input
                              type="range"
                              min="20"
                              max="80"
                              value={bottomText.fontSize}
                              onChange={(e) => setBottomText(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-400 text-center">{bottomText.fontSize}px</div>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Stroke Width</label>
                            <input
                              type="range"
                              min="0"
                              max="8"
                              value={bottomText.strokeWidth}
                              onChange={(e) => setBottomText(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-400 text-center">{bottomText.strokeWidth}px</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                            <input
                              type="color"
                              value={bottomText.color}
                              onChange={(e) => setBottomText(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full h-8 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Stroke Color</label>
                            <input
                              type="color"
                              value={bottomText.strokeColor}
                              onChange={(e) => setBottomText(prev => ({ ...prev, strokeColor: e.target.value }))}
                              className="w-full h-8 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview and Download */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Meme Preview</h3>
                
                <div className="text-center">
                  {!selectedTemplate && !customImage ? (
                    <div className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                      <div className="text-center">
                        <FaceSmileIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>Select a template or upload an image to start creating your meme</p>
                      </div>
                    </div>
                  ) : isGenerating ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : memeUrl ? (
                    <div className="space-y-4">
                      <img
                        src={memeUrl}
                        alt="Generated Meme"
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-lg"
                      />
                      
                      <div className="space-y-2">
                        <button
                          onClick={downloadMeme}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                          Download Meme
                        </button>
                        
                        <div className="text-sm text-gray-400">
                          Ready to share on social media!
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-gray-400">
                      <p>Add some text to generate your meme</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hidden canvas for meme generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Meme Creation Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Text Guidelines</h4>
                <p className="text-sm">
                  Keep text short and punchy. Use contrasting colors for readability. All caps work best for impact.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Popular Formats</h4>
                <p className="text-sm">
                  Top text sets up the situation, bottom text delivers the punchline. Classic meme format!
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Image Quality</h4>
                <p className="text-sm">
                  Use high-resolution images for better results. Templates are optimized for social media sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
