'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  ClockIcon,
  CalendarIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

interface ConversionResult {
  timestamp: number
  iso: string
  utc: string
  local: string
  relative: string
}

interface BatchItem {
  id: string
  input: string
  result: ConversionResult | null
  error: string
}

export default function TimestampConverter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [dateInput, setDateInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [viewMode, setViewMode] = useState<'single' | 'batch' | 'current'>('single')

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Convert timestamp
  const convertTimestamp = useCallback((value: string): ConversionResult | null => {
    if (!value.trim()) return null

    try {
      let timestamp: number

      // Check if it's a date string
      if (isNaN(Number(value))) {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format')
        }
        timestamp = date.getTime()
      } else {
        // Handle different timestamp formats
        const num = Number(value)
        if (num.toString().length === 10) {
          // Unix timestamp (seconds)
          timestamp = num * 1000
        } else if (num.toString().length === 13) {
          // JavaScript timestamp (milliseconds)
          timestamp = num
        } else {
          throw new Error('Invalid timestamp format')
        }
      }

      const date = new Date(timestamp)
      
      return {
        timestamp: Math.floor(timestamp / 1000),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        relative: getRelativeTime(timestamp)
      }
    } catch {
      return null
    }
  }, [])

  // Get relative time
  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(Math.abs(diff) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const future = diff < 0
    const prefix = future ? 'in ' : ''
    const suffix = future ? '' : ' ago'

    if (years > 0) return `${prefix}${years} year${years > 1 ? 's' : ''}${suffix}`
    if (months > 0) return `${prefix}${months} month${months > 1 ? 's' : ''}${suffix}`
    if (days > 0) return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`
    if (hours > 0) return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`
    if (minutes > 0) return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`
    return `${prefix}${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`
  }

  // Handle single conversion
  const handleConvert = () => {
    const converted = convertTimestamp(input)
    if (converted) {
      setResult(converted)
      setError('')
    } else {
      setResult(null)
      setError('Invalid timestamp or date format')
    }
  }

  // Handle date/time input
  const handleDateTimeConvert = () => {
    if (!dateInput) {
      setError('Please enter a date')
      return
    }

    const dateStr = timeInput ? `${dateInput}T${timeInput}` : dateInput
    const converted = convertTimestamp(dateStr)
    if (converted) {
      setResult(converted)
      setError('')
    } else {
      setResult(null)
      setError('Invalid date/time format')
    }
  }

  // Add to batch
  const addToBatch = () => {
    if (!input.trim()) return

    const converted = convertTimestamp(input)
    const newItem: BatchItem = {
      id: Date.now().toString(),
      input: input.trim(),
      result: converted,
      error: converted ? '' : 'Invalid format'
    }

    setBatchItems(prev => [...prev, newItem])
    setInput('')
  }

  // Remove from batch
  const removeFromBatch = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id))
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download results
  const downloadResults = () => {
    let content = ''
    
    if (viewMode === 'single' && result) {
      content = `Timestamp: ${result.timestamp}
ISO: ${result.iso}
UTC: ${result.utc}
Local: ${result.local}
Relative: ${result.relative}`
    } else if (viewMode === 'batch') {
      content = batchItems.map(item => {
        if (item.result) {
          return `Input: ${item.input}
Timestamp: ${item.result.timestamp}
ISO: ${item.result.iso}
UTC: ${item.result.utc}
Local: ${item.result.local}
Relative: ${item.result.relative}
---`
        }
        return `Input: ${item.input}
Error: ${item.error}
---`
      }).join('\n')
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'timestamp-conversion.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get current time result
  const currentResult = convertTimestamp(currentTime.toString())

  useEffect(() => {
    if (input.trim()) {
      handleConvert()
    } else {
      setResult(null)
      setError('')
    }
  }, [input, convertTimestamp])

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="Unix Timestamp Converter" 
        description="Convert between Unix timestamps, dates, and human-readable formats"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Mode Selection */}
          <div className="flex gap-2 mb-6">
            <Button
              size="sm"
              variant={viewMode === 'single' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('single')}
            >
              Single Conversion
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'batch' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('batch')}
            >
              Batch Conversion
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'current' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('current')}
            >
              Current Time
            </Button>
          </div>

          {/* Current Time Mode */}
          {viewMode === 'current' && currentResult && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Current Time</h3>
                  <span className="text-sm text-gray-400">(Updates every second)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Unix Timestamp</label>
                      <div className="flex gap-2">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                          {currentResult.timestamp}
                        </div>
                        <Button size="sm" onClick={() => copyToClipboard(currentResult.timestamp.toString())}>
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">ISO 8601</label>
                      <div className="flex gap-2">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                          {currentResult.iso}
                        </div>
                        <Button size="sm" onClick={() => copyToClipboard(currentResult.iso)}>
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">UTC</label>
                      <div className="flex gap-2">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                          {currentResult.utc}
                        </div>
                        <Button size="sm" onClick={() => copyToClipboard(currentResult.utc)}>
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Local Time</label>
                      <div className="flex gap-2">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                          {currentResult.local}
                        </div>
                        <Button size="sm" onClick={() => copyToClipboard(currentResult.local)}>
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Single Conversion Mode */}
          {viewMode === 'single' && (
            <div className="space-y-6">
              {/* Input Section */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Convert Timestamp or Date</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Enter timestamp (Unix or JavaScript) or date string
                    </label>
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="1634567890 or 2023-12-31 or 2023-12-31T23:59:59"
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports: Unix timestamps (10 digits), JavaScript timestamps (13 digits), ISO dates, etc.
                    </p>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Or use date/time picker:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                        <input
                          type="date"
                          value={dateInput}
                          onChange={(e) => setDateInput(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Time (optional)</label>
                        <input
                          type="time"
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleDateTimeConvert} className="w-full">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Convert Date
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Conversion Results</h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                        <ClipboardIcon className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                      <Button size="sm" onClick={downloadResults}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Unix Timestamp (seconds)</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                            {result.timestamp}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(result.timestamp.toString())}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">JavaScript Timestamp (milliseconds)</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                            {result.timestamp * 1000}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard((result.timestamp * 1000).toString())}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">ISO 8601</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm break-all">
                            {result.iso}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(result.iso)}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">UTC</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                            {result.utc}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(result.utc)}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Local Time</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                            {result.local}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(result.local)}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Relative Time</label>
                        <div className="flex gap-2">
                          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-sm">
                            {result.relative}
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(result.relative)}>
                            <ClipboardIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Batch Conversion Mode */}
          {viewMode === 'batch' && (
            <div className="space-y-6">
              {/* Batch Input */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Batch Conversion</h3>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter timestamp or date to add to batch"
                    className="flex-1 font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && addToBatch()}
                  />
                  <Button onClick={addToBatch}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Batch Results */}
              {batchItems.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Batch Results ({batchItems.length} items)</h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setBatchItems([])}>
                        Clear All
                      </Button>
                      <Button size="sm" onClick={downloadResults}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {batchItems.map((item) => (
                      <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-gray-300">Input: {item.input}</span>
                          <Button size="sm" variant="secondary" onClick={() => removeFromBatch(item.id)}>
                            <MinusIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {item.error ? (
                          <div className="text-red-400 text-sm">{item.error}</div>
                        ) : item.result && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">Unix:</span>
                              <div className="font-mono">{item.result.timestamp}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Local:</span>
                              <div className="font-mono truncate">{item.result.local}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">ISO:</span>
                              <div className="font-mono truncate">{item.result.iso}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Relative:</span>
                              <div className="font-mono">{item.result.relative}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowsRightLeftIcon className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Multiple Formats</h4>
                </div>
                <p className="text-sm text-gray-400">Convert between Unix timestamps, JavaScript timestamps, ISO dates, and more</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Real-time</h4>
                </div>
                <p className="text-sm text-gray-400">Live current time display with automatic updates</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Date Picker</h4>
                </div>
                <p className="text-sm text-gray-400">Easy date and time selection with visual picker</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
