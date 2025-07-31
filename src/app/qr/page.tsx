'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCodeIcon, SwatchIcon, CogIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface QRConfig {
  text: string;
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  logoFile: File | null;
  logoSize: number;
  type: 'text' | 'url' | 'wifi' | 'vcard' | 'sms' | 'email';
}

interface WiFiConfig {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface VCardConfig {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export default function QRCodeGenerator() {
  const [config, setConfig] = useState<QRConfig>({
    text: '',
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logoFile: null,
    logoSize: 20,
    type: 'text'
  });
  
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  });
  
  const [vcardConfig, setVCardConfig] = useState<VCardConfig>({
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    website: ''
  });
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrTypes = [
    { value: 'text', label: 'Text', description: 'Plain text or any custom content' },
    { value: 'url', label: 'URL', description: 'Website links' },
    { value: 'wifi', label: 'WiFi', description: 'WiFi network credentials' },
    { value: 'vcard', label: 'vCard', description: 'Contact information' },
    { value: 'sms', label: 'SMS', description: 'Pre-filled SMS message' },
    { value: 'email', label: 'Email', description: 'Email address with optional subject' }
  ];

  const errorLevels = [
    { value: 'L', label: 'Low (~7%)', description: 'Good for clean environments' },
    { value: 'M', label: 'Medium (~15%)', description: 'Balanced option (recommended)' },
    { value: 'Q', label: 'Quartile (~25%)', description: 'Good for outdoor use' },
    { value: 'H', label: 'High (~30%)', description: 'Best for damaged surfaces' }
  ];

  const generateQRText = (): string => {
    switch (config.type) {
      case 'text':
      case 'url':
        return config.text;
      
      case 'wifi':
        return `WIFI:T:${wifiConfig.security};S:${wifiConfig.ssid};P:${wifiConfig.password};H:${wifiConfig.hidden ? 'true' : 'false'};;`;
      
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardConfig.firstName} ${vcardConfig.lastName}\nORG:${vcardConfig.organization}\nTITLE:${vcardConfig.title}\nTEL:${vcardConfig.phone}\nEMAIL:${vcardConfig.email}\nURL:${vcardConfig.website}\nEND:VCARD`;
      
      case 'sms':
        return `sms:${config.text}`;
      
      case 'email':
        return `mailto:${config.text}`;
      
      default:
        return config.text;
    }
  };

  const generateQRCode = async () => {
    if (!config.text && config.type === 'text') return;
    if (config.type === 'wifi' && !wifiConfig.ssid) return;
    if (config.type === 'vcard' && !vcardConfig.firstName && !vcardConfig.lastName) return;
    
    setIsGenerating(true);
    
    try {
      // Using qr-server.com API for now - in production, you'd want to use a client-side library
      const qrText = encodeURIComponent(generateQRText());
      const size = config.size;
      const errorCorrection = config.errorCorrection.toLowerCase();
      const fg = config.foregroundColor.substring(1); // Remove #
      const bg = config.backgroundColor.substring(1); // Remove #
      
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrText}&ecc=${errorCorrection}&color=${fg}&bgcolor=${bg}`;
      
      const response = await fetch(url);
      const blob = await response.blob();
      const qrUrl = URL.createObjectURL(blob);
      
      if (config.logoFile) {
        // Add logo overlay
        const finalUrl = await addLogoToQR(qrUrl, config.logoFile);
        setQrCodeUrl(finalUrl);
      } else {
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addLogoToQR = async (qrUrl: string, logoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(qrUrl);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(qrUrl);
        return;
      }
      
      const qrImg = new Image();
      const logoImg = new Image();
      
      qrImg.onload = () => {
        canvas.width = config.size;
        canvas.height = config.size;
        
        // Draw QR code
        ctx.drawImage(qrImg, 0, 0, config.size, config.size);
        
        logoImg.onload = () => {
          // Calculate logo size and position
          const logoSize = (config.size * config.logoSize) / 100;
          const logoX = (config.size - logoSize) / 2;
          const logoY = (config.size - logoSize) / 2;
          
          // Draw white background for logo
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          
          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          // Convert to blob URL
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              resolve(qrUrl);
            }
          });
        };
        
        logoImg.src = URL.createObjectURL(logoFile);
      };
      
      qrImg.src = qrUrl;
    });
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qrcode_${Date.now()}.png`;
    a.click();
  };

  const handleLogoUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      setConfig(prev => ({ ...prev, logoFile: file }));
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (config.text || config.type !== 'text') {
        generateQRCode();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [config, wifiConfig, vcardConfig]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <QrCodeIcon className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Enhanced QR Code Generator
              </h1>
              <p className="text-lg md:text-xl text-violet-100 mt-2">
                Create customizable QR codes with logos and multiple formats
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-violet-500/20 text-violet-200 px-3 py-1 rounded-full text-sm">Custom Colors</span>
            <span className="bg-violet-500/20 text-violet-200 px-3 py-1 rounded-full text-sm">Logo Support</span>
            <span className="bg-violet-500/20 text-violet-200 px-3 py-1 rounded-full text-sm">Multiple Types</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Configuration Panel */}
            <div className="space-y-6">
              
              {/* QR Type Selection */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CogIcon className="w-5 h-5 text-violet-400" />
                  QR Code Type
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {qrTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setConfig(prev => ({ ...prev, type: type.value as 'text' | 'url' | 'wifi' | 'vcard' | 'sms' | 'email' }))}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        config.type === type.value
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-white text-sm">{type.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Input */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Content</h3>
                
                {config.type === 'text' || config.type === 'url' || config.type === 'sms' || config.type === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {config.type === 'url' ? 'Website URL' : 
                       config.type === 'sms' ? 'Phone Number' :
                       config.type === 'email' ? 'Email Address' : 'Text Content'}
                    </label>
                    <textarea
                      value={config.text}
                      onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                      placeholder={
                        config.type === 'url' ? 'https://example.com' :
                        config.type === 'sms' ? '+1234567890' :
                        config.type === 'email' ? 'example@email.com' :
                        'Enter text to encode...'
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[100px] resize-none"
                    />
                  </div>
                ) : config.type === 'wifi' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={wifiConfig.ssid}
                        onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="WiFi Network Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={wifiConfig.password}
                        onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="WiFi Password"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Security</label>
                        <select
                          value={wifiConfig.security}
                          onChange={(e) => setWifiConfig(prev => ({ ...prev, security: e.target.value as 'WPA' | 'WEP' | 'nopass' }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">No Password</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wifiConfig.hidden}
                            onChange={(e) => setWifiConfig(prev => ({ ...prev, hidden: e.target.checked }))}
                            className="w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"
                          />
                          Hidden Network
                        </label>
                      </div>
                    </div>
                  </div>
                ) : config.type === 'vcard' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          value={vcardConfig.firstName}
                          onChange={(e) => setVCardConfig(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={vcardConfig.lastName}
                          onChange={(e) => setVCardConfig(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                        <input
                          type="text"
                          value={vcardConfig.organization}
                          onChange={(e) => setVCardConfig(prev => ({ ...prev, organization: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={vcardConfig.title}
                          onChange={(e) => setVCardConfig(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={vcardConfig.phone}
                        onChange={(e) => setVCardConfig(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={vcardConfig.email}
                        onChange={(e) => setVCardConfig(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={vcardConfig.website}
                        onChange={(e) => setVCardConfig(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Customization Options */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SwatchIcon className="w-5 h-5 text-violet-400" />
                  Customization
                </h3>
                
                <div className="space-y-4">
                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Size: {config.size}px
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="32"
                      value={config.size}
                      onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Foreground Color</label>
                      <input
                        type="color"
                        value={config.foregroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
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
                  
                  {/* Error Correction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Error Correction Level</label>
                    <select
                      value={config.errorCorrection}
                      onChange={(e) => setConfig(prev => ({ ...prev, errorCorrection: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      {errorLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo (Optional)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-600 file:text-white hover:file:bg-violet-700"
                      />
                      {config.logoFile && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{config.logoFile.name}</span>
                          <button
                            onClick={() => setConfig(prev => ({ ...prev, logoFile: null }))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {config.logoFile && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Logo Size: {config.logoSize}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="40"
                            value={config.logoSize}
                            onChange={(e) => setConfig(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview and Download */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">QR Code Preview</h3>
              
              <div className="text-center">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="max-w-full h-auto"
                        style={{ maxWidth: '400px' }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={downloadQRCode}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download QR Code
                      </button>
                      
                      <div className="text-sm text-gray-400">
                        {config.size}x{config.size}px • {config.errorCorrection} Error Correction
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <QrCodeIcon className="w-16 h-16 mx-auto mb-4" />
                      <p>Enter content to generate QR code</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for logo overlay */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Info Section */}
          <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">QR Code Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-violet-400 mb-2">Custom Styling</h4>
                <p className="text-sm">
                  Customize colors, sizes, and add your logo to make QR codes match your brand.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-violet-400 mb-2">Multiple Types</h4>
                <p className="text-sm">
                  Create QR codes for URLs, WiFi credentials, contact cards, SMS, and more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-violet-400 mb-2">Error Correction</h4>
                <p className="text-sm">
                  Choose error correction levels to ensure your QR codes work even when damaged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}