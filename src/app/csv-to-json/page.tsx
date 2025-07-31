'use client'

import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  CogIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Textarea from '../../components/common/Textarea'
import FileUpload from '../../components/common/FileUpload'

interface CsvConfig {
  delimiter: string
  header: boolean
  skipEmptyLines: boolean
  dynamicTyping: boolean
  trimHeaders: boolean
}

interface ConversionOptions {
  outputFormat: 'array' | 'object'
  nestedStructure: boolean
  customKeys: string[]
}

export default function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [config, setConfig] = useState<CsvConfig>({
    delimiter: 'auto',
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    trimHeaders: true
  })
  const [options, setOptions] = useState<ConversionOptions>({
    outputFormat: 'array',
    nestedStructure: false,
    customKeys: []
  })
  const [viewMode, setViewMode] = useState<'preview' | 'json'>('preview')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return
    
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvInput(text)
      setError('')
    }
    reader.readAsText(file)
  }

  // Auto-detect delimiter
  const detectDelimiter = (text: string): string => {
    const delimiters = [',', ';', '\t', '|']
    const sample = text.split('\n').slice(0, 5).join('\n')
    
    let bestDelimiter = ','
    let maxColumns = 0
    
    delimiters.forEach(delimiter => {
      const result = Papa.parse(sample, { delimiter, preview: 1 })
      const firstRow = result.data[0] as unknown[]
      if (firstRow && Array.isArray(firstRow) && firstRow.length > maxColumns) {
        maxColumns = firstRow.length
        bestDelimiter = delimiter
      }
    })
    
    return bestDelimiter
  }

  // Convert CSV to JSON
  const convertToJson = useCallback(() => {
    if (!csvInput.trim()) {
      setError('Please provide CSV data')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const delimiter = config.delimiter === 'auto' ? detectDelimiter(csvInput) : config.delimiter
      
      const parseConfig = {
        delimiter,
        header: config.header,
        skipEmptyLines: config.skipEmptyLines,
        dynamicTyping: config.dynamicTyping,
        trimHeaders: config.trimHeaders,
        transformHeader: (header: string) => config.trimHeaders ? header.trim() : header
      }

      Papa.parse(csvInput, {
        ...parseConfig,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`Parsing errors: ${results.errors.map(e => e.message).join(', ')}`)
            setIsProcessing(false)
            return
          }

          let processedData: unknown = results.data

          // Handle nested structure
          if (options.nestedStructure && config.header) {
            processedData = createNestedStructure(processedData as Record<string, unknown>[])
          }

          // Format output
          if (options.outputFormat === 'object' && Array.isArray(processedData) && processedData.length > 0) {
            // Convert array to object using first column as key
            const objectOutput: Record<string, unknown> = {}
            const dataArray = processedData as Record<string, unknown>[]
            dataArray.forEach((row: Record<string, unknown>, index: number) => {
              const key = config.header ? (row[Object.keys(row)[0]] as string) || `row_${index}` : `row_${index}`
              objectOutput[key] = row
            })
            processedData = objectOutput
          }

          const dataArray = Array.isArray(processedData) ? 
            (processedData as Record<string, unknown>[]) : 
            [processedData as Record<string, unknown>]
          
          setPreviewData(dataArray.slice(0, 10))
          setJsonOutput(JSON.stringify(processedData, null, 2))
          setIsProcessing(false)
        },
        error: (error: unknown) => {
          setError(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
          setIsProcessing(false)
        }
      })
    } catch (error: unknown) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }, [csvInput, config, options])

  // Create nested structure from dot notation
  const createNestedStructure = (data: Record<string, unknown>[]) => {
    return data.map(row => {
      const nestedRow: Record<string, unknown> = {}
      
      Object.entries(row).forEach(([key, value]) => {
        if (key.includes('.')) {
          const keys = key.split('.')
          let current: Record<string, unknown> = nestedRow
          
          keys.forEach((k, index) => {
            if (index === keys.length - 1) {
              current[k] = value
            } else {
              if (!current[k]) current[k] = {}
              current = current[k] as Record<string, unknown>
            }
          })
        } else {
          nestedRow[key] = value
        }
      })
      
      return nestedRow
    })
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput)
      // You might want to show a toast notification
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download as file
  const downloadFile = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (csvInput) {
      convertToJson()
    }
  }, [csvInput, convertToJson])

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="CSV to JSON Converter" 
        description="Convert CSV data to JSON format with customizable options"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Upload CSV File</h2>
                <FileUpload 
                  onFileSelect={handleFileUpload}
                  accept=".csv"
                  maxSize={10}
                  label="Drop CSV file here or click to browse"
                />
              </div>

              {/* Manual Input */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Or Paste CSV Data</h2>
                <Textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="min-h-[300px] font-mono text-sm"
                />
                
                {error && (
                  <div className="mt-3 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Configuration */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CogIcon className="w-5 h-5" />
                  Parsing Options
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Delimiter</label>
                      <select 
                        value={config.delimiter} 
                        onChange={(e) => setConfig({...config, delimiter: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="\t">Tab</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Output Format</label>
                      <select 
                        value={options.outputFormat} 
                        onChange={(e) => setOptions({...options, outputFormat: e.target.value as 'array' | 'object'})}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                      >
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={config.header}
                        onChange={(e) => setConfig({...config, header: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">First row contains headers</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={config.dynamicTyping}
                        onChange={(e) => setConfig({...config, dynamicTyping: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Auto-detect data types</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={config.skipEmptyLines}
                        onChange={(e) => setConfig({...config, skipEmptyLines: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Skip empty lines</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={options.nestedStructure}
                        onChange={(e) => setOptions({...options, nestedStructure: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Create nested objects (dot notation)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Output Section */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">Output</h2>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={viewMode === 'preview' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('preview')}
                      >
                        <EyeIcon className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'json' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('json')}
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                        JSON
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {jsonOutput && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={copyToClipboard}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={downloadFile}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {isProcessing && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Processing...</p>
                  </div>
                )}
                
                {/* Preview Table */}
                {viewMode === 'preview' && previewData.length > 0 && !isProcessing && (
                  <div className="overflow-auto max-h-[500px]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="px-3 py-2 text-left text-gray-300 font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-800/50' : ''}>
                            {Object.values(row).map((value: unknown, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-gray-300">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length === 10 && (
                      <div className="text-center text-gray-400 text-sm mt-2">
                        Showing first 10 rows...
                      </div>
                    )}
                  </div>
                )}
                
                {/* JSON Output */}
                {viewMode === 'json' && jsonOutput && !isProcessing && (
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-[500px] font-mono">
                    <code>{jsonOutput}</code>
                  </pre>
                )}
                
                {!csvInput && !isProcessing && (
                  <div className="text-center py-12 text-gray-500">
                    Upload a CSV file or paste CSV data to see the conversion
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Auto-Detection</h3>
              <p className="text-sm text-gray-400">Automatically detects delimiters and data types</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Flexible Output</h3>
              <p className="text-sm text-gray-400">Choose between array or object output formats</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Nested Objects</h3>
              <p className="text-sm text-gray-400">Create nested JSON from dot notation headers</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Live Preview</h3>
              <p className="text-sm text-gray-400">See table preview before converting to JSON</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
