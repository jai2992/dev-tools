'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCodeIcon, ArrowDownTrayIcon, WifiIcon, UserIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrTypes = [
    {
      value: 'text',
      label: 'Text',
      description: 'Any text content',
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'url',
      label: 'Website',
      description: 'Link to website',
      icon: LinkIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      value: 'wifi',
      label: 'WiFi',
      description: 'Network password',
      icon: WifiIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'vcard',
      label: 'Contact',
      description: 'Contact card',
      icon: UserIcon,
      color: 'from-orange-500 to-orange-600'
    },
    {
      value: 'sms',
      label: 'SMS',
      description: 'Text message',
      icon: PhoneIcon,
      color: 'from-pink-500 to-pink-600'
    },
    {
      value: 'email',
      label: 'Email',
      description: 'Email address',
      icon: EnvelopeIcon,
      color: 'from-indigo-500 to-indigo-600'
    }
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
      const qrText = encodeURIComponent(generateQRText());
      const size = config.size;
      const errorCorrection = config.errorCorrection.toLowerCase();
      const fg = config.foregroundColor.substring(1);
      const bg = config.backgroundColor.substring(1);

      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrText}&ecc=${errorCorrection}&color=${fg}&bgcolor=${bg}`;

      const response = await fetch(url);
      const blob = await response.blob();
      const qrUrl = URL.createObjectURL(blob);

      if (config.logoFile) {
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
        ctx.drawImage(qrImg, 0, 0, config.size, config.size);

        logoImg.onload = () => {
          const logoSize = (config.size * config.logoSize) / 100;
          const logoX = (config.size - logoSize) / 2;
          const logoY = (config.size - logoSize) / 2;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

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

  const getContentInput = () => {
    switch (config.type) {
      case 'text':
      case 'url':
      case 'sms':
      case 'email':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-200">
              {config.type === 'url' ? 'Enter website URL' :
                config.type === 'sms' ? 'Enter phone number' :
                  config.type === 'email' ? 'Enter email address' : 'Enter your text'}
            </label>
            <textarea
              value={config.text}
              onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
              placeholder={
                config.type === 'url' ? 'https://example.com' :
                  config.type === 'sms' ? '+1 (555) 123-4567' :
                    config.type === 'email' ? 'hello@example.com' :
                      'Type anything you want...'
              }
              className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
              autoFocus
            />
            <div className="text-xs text-gray-400">
              {config.text.length} characters
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={wifiConfig.ssid}
                onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="My WiFi Network"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password (optional)</label>
              <input
                type="password"
                value={wifiConfig.password}
                onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Leave empty for open network"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Security</label>
                <select
                  value={wifiConfig.security}
                  onChange={(e) => setWifiConfig(prev => ({ ...prev, security: e.target.value as 'WPA' | 'WEP' | 'nopass' }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open Network</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiConfig.hidden}
                    onChange={(e) => setWifiConfig(prev => ({ ...prev, hidden: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  Hidden Network
                </label>
              </div>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">First Name</label>
                <input
                  type="text"
                  value={vcardConfig.firstName}
                  onChange={(e) => setVCardConfig(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="John"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Last Name</label>
                <input
                  type="text"
                  value={vcardConfig.lastName}
                  onChange={(e) => setVCardConfig(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
              <input
                type="tel"
                value={vcardConfig.phone}
                onChange={(e) => setVCardConfig(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={vcardConfig.email}
                onChange={(e) => setVCardConfig(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Company</label>
                <input
                  type="text"
                  value={vcardConfig.organization}
                  onChange={(e) => setVCardConfig(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Company Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Job Title</label>
                <input
                  type="text"
                  value={vcardConfig.title}
                  onChange={(e) => setVCardConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Website</label>
              <input
                type="url"
                value={vcardConfig.website}
                onChange={(e) => setVCardConfig(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://johndoe.com"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-6">
              <QrCodeIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              QR Code Generator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create beautiful QR codes in seconds. Choose your type, add content, and download instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Step 1: Choose Type */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">What type of QR code do you need?</h2>
            <p className="text-gray-400">Choose the type that best fits your needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {qrTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = config.type === type.value;

              return (
                <button
                  key={type.value}
                  onClick={() => setConfig(prev => ({ ...prev, type: type.value as any }))}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${isSelected
                      ? 'border-blue-500 bg-blue-500/10 scale-105'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${type.color} p-2.5 ${isSelected ? 'shadow-lg' : 'group-hover:shadow-md'
                    } transition-all duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{type.label}</h3>
                  <p className="text-xs text-gray-400">{type.description}</p>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Content & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Content Input */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Add your content
            </h3>
            {getContentInput()}
          </div>

          {/* QR Code Preview */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Your QR Code
            </h3>

            <div className="text-center">
              {isGenerating ? (
                <div className="flex items-center justify-center h-80">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCodeIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              ) : qrCodeUrl ? (
                <div className="space-y-6">
                  <div className="inline-block p-6 bg-white rounded-2xl shadow-2xl">
                    <img
                      src={qrCodeUrl}
                      alt="Generated QR Code"
                      className="w-full h-auto max-w-xs"
                    />
                  </div>

                  <button
                    onClick={downloadQRCode}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download QR Code
                  </button>

                  <div className="text-sm text-gray-400">
                    {config.size}×{config.size}px • PNG Format
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-2xl flex items-center justify-center">
                      <QrCodeIcon className="w-12 h-12 text-gray-600" />
                    </div>
                    <p className="text-gray-500">
                      {config.type === 'text' ? 'Enter some text to generate your QR code' :
                        config.type === 'url' ? 'Enter a website URL to get started' :
                          config.type === 'wifi' ? 'Enter your WiFi network name' :
                            config.type === 'vcard' ? 'Fill in your contact details' :
                              config.type === 'sms' ? 'Enter a phone number' :
                                'Enter an email address'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left mb-6"
          >
            <h3 className="text-xl font-semibold text-white">
              Advanced Options
            </h3>
            <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Size: {config.size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={config.size}
                  onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">Colors</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Foreground</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.foregroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.foregroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors"
                />
                {config.logoFile && (
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{config.logoFile.name}</span>
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, logoFile: null }))}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Logo Size: {config.logoSize}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="40"
                        value={config.logoSize}
                        onChange={(e) => setConfig(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for logo overlay */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}