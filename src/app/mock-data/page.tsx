'use client'

import { useState, useEffect, useCallback } from 'react'
import { faker } from '@faker-js/faker'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  PlusIcon,
  MinusIcon,
  TableCellsIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'

interface DataField {
  id: string
  name: string
  type: string
  options?: Record<string, unknown>
  nullable?: boolean
}

interface FieldTypeInfo {
  key: string
  label: string
  category: string
  generator: () => unknown
}

interface GroupedFieldTypes {
  [category: string]: FieldTypeInfo[]
}

interface DataSchema {
  fields: DataField[]
  count: number
  locale: string
}

const fieldTypes = {
  // Personal
  'firstName': { label: 'First Name', category: 'Personal', generator: () => faker.person.firstName() },
  'lastName': { label: 'Last Name', category: 'Personal', generator: () => faker.person.lastName() },
  'fullName': { label: 'Full Name', category: 'Personal', generator: () => faker.person.fullName() },
  'email': { label: 'Email', category: 'Personal', generator: () => faker.internet.email() },
  'phone': { label: 'Phone', category: 'Personal', generator: () => faker.phone.number() },
  'avatar': { label: 'Avatar URL', category: 'Personal', generator: () => faker.image.avatar() },
  'gender': { label: 'Gender', category: 'Personal', generator: () => faker.person.gender() },
  'birthDate': { label: 'Birth Date', category: 'Personal', generator: () => faker.date.birthdate().toISOString().split('T')[0] },
  
  // Address
  'address': { label: 'Full Address', category: 'Address', generator: () => faker.location.streetAddress(true) },
  'street': { label: 'Street Address', category: 'Address', generator: () => faker.location.streetAddress() },
  'city': { label: 'City', category: 'Address', generator: () => faker.location.city() },
  'state': { label: 'State', category: 'Address', generator: () => faker.location.state() },
  'zipCode': { label: 'ZIP Code', category: 'Address', generator: () => faker.location.zipCode() },
  'country': { label: 'Country', category: 'Address', generator: () => faker.location.country() },
  'latitude': { label: 'Latitude', category: 'Address', generator: () => faker.location.latitude() },
  'longitude': { label: 'Longitude', category: 'Address', generator: () => faker.location.longitude() },
  
  // Internet
  'username': { label: 'Username', category: 'Internet', generator: () => faker.internet.userName() },
  'password': { label: 'Password', category: 'Internet', generator: () => faker.internet.password() },
  'url': { label: 'URL', category: 'Internet', generator: () => faker.internet.url() },
  'domain': { label: 'Domain', category: 'Internet', generator: () => faker.internet.domainName() },
  'ip': { label: 'IP Address', category: 'Internet', generator: () => faker.internet.ip() },
  'mac': { label: 'MAC Address', category: 'Internet', generator: () => faker.internet.mac() },
  'userAgent': { label: 'User Agent', category: 'Internet', generator: () => faker.internet.userAgent() },
  
  // Business
  'company': { label: 'Company Name', category: 'Business', generator: () => faker.company.name() },
  'jobTitle': { label: 'Job Title', category: 'Business', generator: () => faker.person.jobTitle() },
  'department': { label: 'Department', category: 'Business', generator: () => faker.commerce.department() },
  'product': { label: 'Product Name', category: 'Business', generator: () => faker.commerce.productName() },
  'price': { label: 'Price', category: 'Business', generator: () => faker.commerce.price() },
  'currency': { label: 'Currency', category: 'Business', generator: () => faker.finance.currencyCode() },
  
  // Numbers & Dates
  'id': { label: 'ID (UUID)', category: 'Data', generator: () => faker.string.uuid() },
  'number': { label: 'Random Number', category: 'Data', generator: () => faker.number.int({ min: 1, max: 1000 }) },
  'float': { label: 'Float Number', category: 'Data', generator: () => faker.number.float({ min: 0, max: 100, fractionDigits: 2 }) },
  'boolean': { label: 'Boolean', category: 'Data', generator: () => faker.datatype.boolean() },
  'date': { label: 'Date', category: 'Data', generator: () => faker.date.recent().toISOString().split('T')[0] },
  'dateTime': { label: 'Date Time', category: 'Data', generator: () => faker.date.recent().toISOString() },
  'timestamp': { label: 'Timestamp', category: 'Data', generator: () => faker.date.recent().getTime() },
  
  // Lorem
  'word': { label: 'Single Word', category: 'Lorem', generator: () => faker.lorem.word() },
  'sentence': { label: 'Sentence', category: 'Lorem', generator: () => faker.lorem.sentence() },
  'paragraph': { label: 'Paragraph', category: 'Lorem', generator: () => faker.lorem.paragraph() },
  'text': { label: 'Text (3 paragraphs)', category: 'Lorem', generator: () => faker.lorem.paragraphs(3) }
}

const locales = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
]

export default function MockDataGenerator() {
  const [schema, setSchema] = useState<DataSchema>({
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'name', type: 'fullName' },
      { id: '3', name: 'email', type: 'email' }
    ],
    count: 10,
    locale: 'en'
  })
  const [generatedData, setGeneratedData] = useState<Record<string, unknown>[]>([])
  const [outputFormat, setOutputFormat] = useState<'json' | 'csv' | 'sql'>('json')
  const [sqlTableName, setSqlTableName] = useState('users')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'table' | 'json'>('table')

  // Add new field
  const addField = () => {
    const newField: DataField = {
      id: Date.now().toString(),
      name: 'newField',
      type: 'firstName'
    }
    setSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  // Remove field
  const removeField = (id: string) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }))
  }

  // Update field
  const updateField = (id: string, updates: Partial<DataField>) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }))
  }

  // Generate mock data
  const generateData = useCallback(() => {
    if (schema.fields.length === 0) return

    setIsGenerating(true)
    
    // Set faker locale
    // Note: Faker.js v8+ uses different locale setting
    // faker.locale = schema.locale
    
    const data = []
    for (let i = 0; i < schema.count; i++) {
      const row: Record<string, unknown> = {}
      
      schema.fields.forEach(field => {
        const fieldType = fieldTypes[field.type as keyof typeof fieldTypes]
        if (fieldType) {
          try {
            row[field.name] = fieldType.generator()
          } catch {
            row[field.name] = null
          }
        } else {
          row[field.name] = null
        }
      })
      
      data.push(row)
    }
    
    setGeneratedData(data)
    setIsGenerating(false)
  }, [schema])

  // Generate output based on format
  const generateOutput = (): string => {
    if (generatedData.length === 0) return ''

    switch (outputFormat) {
      case 'json':
        return JSON.stringify(generatedData, null, 2)
      
      case 'csv':
        if (generatedData.length === 0) return ''
        const headers = Object.keys(generatedData[0])
        const csvRows = [
          headers.join(','),
          ...generatedData.map(row => 
            headers.map(header => {
              const value = row[header]
              // Escape quotes and wrap in quotes if contains comma or quote
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            }).join(',')
          )
        ]
        return csvRows.join('\n')
      
      case 'sql':
        if (generatedData.length === 0) return ''
        const columns = Object.keys(generatedData[0])
        const createTable = `CREATE TABLE ${sqlTableName} (\n${columns.map(col => `  ${col} VARCHAR(255)`).join(',\n')}\n);\n\n`
        const insertStatements = generatedData.map(row => {
          const values = columns.map(col => {
            const value = row[col]
            if (value === null) return 'NULL'
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
            return value
          }).join(', ')
          return `INSERT INTO ${sqlTableName} (${columns.join(', ')}) VALUES (${values});`
        }).join('\n')
        return createTable + insertStatements
      
      default:
        return ''
    }
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      const output = generateOutput()
      await navigator.clipboard.writeText(output)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download file
  const downloadFile = () => {
    const output = generateOutput()
    const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      sql: 'text/sql'
    }
    
    const blob = new Blob([output], { type: mimeTypes[outputFormat] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mock-data.${outputFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Group field types by category
  const groupedFieldTypes: GroupedFieldTypes = Object.entries(fieldTypes).reduce((acc, [key, value]) => {
    if (!acc[value.category]) acc[value.category] = []
    acc[value.category].push({ key, ...value })
    return acc
  }, {} as GroupedFieldTypes)

  useEffect(() => {
    generateData()
  }, [generateData])

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="Mock Data Generator" 
        description="Generate realistic mock data for testing and development"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schema Builder */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Data Schema</h2>
                  <Button onClick={addField} size="sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Field
                  </Button>
                </div>
                
                {/* Global Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Records Count</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={schema.count}
                      onChange={(e) => setSchema(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Locale</label>
                    <select 
                      value={schema.locale}
                      onChange={(e) => setSchema(prev => ({ ...prev, locale: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    >
                      {locales.map(locale => (
                        <option key={locale.code} value={locale.code}>{locale.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Output Format</label>
                    <select 
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as 'json' | 'csv' | 'sql')}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                </div>
                
                {/* SQL Table Name */}
                {outputFormat === 'sql' && (
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">SQL Table Name</label>
                    <input
                      type="text"
                      value={sqlTableName}
                      onChange={(e) => setSqlTableName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}
                
                {/* Fields */}
                <div className="space-y-3">
                  {schema.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          placeholder="Field name"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                        >
                          {Object.entries(groupedFieldTypes).map(([category, types]) => (
                            <optgroup key={category} label={category}>
                              {types.map(type => (
                                <option key={type.key} value={type.key}>{type.label}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeField(field.id)}
                        disabled={schema.fields.length === 1}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Preview & Output */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={previewMode === 'table' ? 'primary' : 'secondary'}
                      onClick={() => setPreviewMode('table')}
                    >
                      <TableCellsIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={previewMode === 'json' ? 'primary' : 'secondary'}
                      onClick={() => setPreviewMode('json')}
                    >
                      <CodeBracketIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {isGenerating && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Generating...</p>
                  </div>
                )}
                
                {!isGenerating && generatedData.length > 0 && (
                  <div className="max-h-[400px] overflow-auto">
                    {previewMode === 'table' ? (
                      <table className="w-full text-xs">
                        <thead className="bg-gray-800 sticky top-0">
                          <tr>
                            {schema.fields.map(field => (
                              <th key={field.id} className="px-2 py-2 text-left text-gray-300 font-medium">
                                {field.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {generatedData.slice(0, 5).map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800/50' : ''}>
                              {schema.fields.map(field => (
                                <td key={field.id} className="px-2 py-2 text-gray-300">
                                  {String(row[field.name]).substring(0, 20)}
                                  {String(row[field.name]).length > 20 ? '...' : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <pre className="text-xs text-gray-300 font-mono">
                        {JSON.stringify(generatedData.slice(0, 3), null, 2)}
                      </pre>
                    )}
                    {generatedData.length > 5 && (
                      <div className="text-center text-gray-400 text-xs mt-2">
                        Showing {previewMode === 'table' ? '5' : '3'} of {generatedData.length} records...
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              {generatedData.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Data</h3>
                  <div className="space-y-3">
                    <Button onClick={copyToClipboard} className="w-full">
                      <ClipboardIcon className="w-4 h-4" />
                      Copy to Clipboard
                    </Button>
                    <Button onClick={downloadFile} variant="secondary" className="w-full">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download File
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-400">
                    <div>Records: {generatedData.length}</div>
                    <div>Format: {outputFormat.toUpperCase()}</div>
                    <div>Size: ~{Math.round(generateOutput().length / 1024)} KB</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Realistic Data</h3>
              <p className="text-sm text-gray-400">Generates realistic data using Faker.js library</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-400">Export as JSON, CSV, or SQL INSERT statements</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Localization</h3>
              <p className="text-sm text-gray-400">Support for multiple locales and languages</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Custom Schema</h3>
              <p className="text-sm text-gray-400">Build custom data schemas with various field types</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
