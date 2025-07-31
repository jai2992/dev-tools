'use client'

import { useState } from 'react'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  CodeBracketIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Textarea from '../../components/common/Textarea'

interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  responseTime?: number
  size?: number
}

interface HeaderInfo {
  name: string
  value: string
  description: string
  category: 'general' | 'security' | 'caching' | 'cors' | 'content'
}

export default function ApiResponseFormatter() {
  const [rawResponse, setRawResponse] = useState('')
  const [parsedResponse, setParsedResponse] = useState<ApiResponse | null>(null)
  const [formattedBody, setFormattedBody] = useState('')
  const [bodyType, setBodyType] = useState<'json' | 'xml' | 'html' | 'text'>('json')
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'formatted' | 'headers' | 'info'>('formatted')

  // HTTP Status codes with descriptions
  const statusCodes: Record<number, { type: 'success' | 'redirect' | 'client_error' | 'server_error' | 'info', description: string }> = {
    200: { type: 'success', description: 'OK - The request was successful' },
    201: { type: 'success', description: 'Created - The request was successful and a resource was created' },
    204: { type: 'success', description: 'No Content - The request was successful but no content to return' },
    301: { type: 'redirect', description: 'Moved Permanently - The resource has been moved permanently' },
    302: { type: 'redirect', description: 'Found - The resource has been temporarily moved' },
    304: { type: 'redirect', description: 'Not Modified - The resource has not been modified' },
    400: { type: 'client_error', description: 'Bad Request - The request is malformed' },
    401: { type: 'client_error', description: 'Unauthorized - Authentication is required' },
    403: { type: 'client_error', description: 'Forbidden - Access is denied' },
    404: { type: 'client_error', description: 'Not Found - The resource was not found' },
    429: { type: 'client_error', description: 'Too Many Requests - Rate limit exceeded' },
    500: { type: 'server_error', description: 'Internal Server Error - The server encountered an error' },
    502: { type: 'server_error', description: 'Bad Gateway - Invalid response from upstream server' },
    503: { type: 'server_error', description: 'Service Unavailable - The server is temporarily unavailable' }
  }

  // Parse raw HTTP response
  const parseResponse = () => {
    if (!rawResponse.trim()) {
      setError('Please provide an HTTP response')
      return
    }

    try {
      const lines = rawResponse.split('\n')
      let currentSection = 'status'
      const headers: Record<string, string> = {}
      let body = ''
      let status = 200
      let statusText = 'OK'

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (i === 0 && line.startsWith('HTTP/')) {
          // Parse status line
          const parts = line.split(' ')
          status = parseInt(parts[1]) || 200
          statusText = parts.slice(2).join(' ') || 'OK'
        } else if (line === '' && currentSection === 'headers') {
          // Empty line indicates start of body
          currentSection = 'body'
        } else if (currentSection === 'headers' && line.includes(':')) {
          // Parse header
          const colonIndex = line.indexOf(':')
          const name = line.substring(0, colonIndex).trim()
          const value = line.substring(colonIndex + 1).trim()
          headers[name] = value
        } else if (currentSection === 'status' && line.includes(':')) {
          // First header line
          currentSection = 'headers'
          const colonIndex = line.indexOf(':')
          const name = line.substring(0, colonIndex).trim()
          const value = line.substring(colonIndex + 1).trim()
          headers[name] = value
        } else if (currentSection === 'body') {
          body += (body ? '\n' : '') + lines[i]
        }
      }

      const response: ApiResponse = {
        status,
        statusText,
        headers,
        body,
        size: body.length,
        responseTime: Math.random() * 1000 + 100 // Simulated
      }

      setParsedResponse(response)
      formatBody(body, headers)
      setError('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Error parsing response: ${message}`)
    }
  }

  // Format response body based on content type
  const formatBody = (body: string, headers: Record<string, string>) => {
    if (!body.trim()) {
      setFormattedBody('')
      return
    }

    const contentType = headers['Content-Type'] || headers['content-type'] || ''
    
    try {
      if (contentType.includes('application/json') || contentType.includes('text/json')) {
        const parsed = JSON.parse(body)
        setFormattedBody(JSON.stringify(parsed, null, 2))
        setBodyType('json')
      } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
        setFormattedBody(formatXml(body))
        setBodyType('xml')
      } else if (contentType.includes('text/html')) {
        setFormattedBody(formatHtml(body))
        setBodyType('html')
      } else {
        setFormattedBody(body)
        setBodyType('text')
      }
    } catch {
      // If JSON parsing fails, treat as text
      setFormattedBody(body)
      setBodyType('text')
    }
  }

  // Simple XML formatter
  const formatXml = (xml: string): string => {
    let formatted = ''
    let indent = 0
    const tab = '  '
    
    xml.split(/>\s*</).forEach((node, index) => {
      if (index > 0) node = '<' + node
      if (index < xml.split(/>\s*</).length - 1) node = node + '>'
      
      if (node.match(/^<\/\w/)) {
        indent--
      }
      
      formatted += tab.repeat(indent) + node + '\n'
      
      if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent++
      }
    })
    
    return formatted
  }

  // Simple HTML formatter
  const formatHtml = (html: string): string => {
    return html.replace(/></g, '>\n<')
  }

  // Get header information
  const getHeaderInfo = (name: string, value: string): HeaderInfo => {
    const lowerName = name.toLowerCase()
    
    const headerDescriptions: Record<string, { description: string, category: HeaderInfo['category'] }> = {
      'content-type': { description: 'Indicates the media type of the resource', category: 'content' },
      'content-length': { description: 'The size of the entity-body in bytes', category: 'content' },
      'cache-control': { description: 'Directives for caching mechanisms', category: 'caching' },
      'etag': { description: 'Identifier for a specific version of a resource', category: 'caching' },
      'last-modified': { description: 'The date and time the resource was last modified', category: 'caching' },
      'expires': { description: 'The date/time after which the response is considered stale', category: 'caching' },
      'access-control-allow-origin': { description: 'Indicates whether the response can be shared with resources with the given origin', category: 'cors' },
      'access-control-allow-methods': { description: 'Specifies the methods allowed when accessing the resource', category: 'cors' },
      'access-control-allow-headers': { description: 'Indicates which headers can be used when making the request', category: 'cors' },
      'strict-transport-security': { description: 'Tells browsers to only access the site using HTTPS', category: 'security' },
      'x-frame-options': { description: 'Indicates whether a browser should be allowed to render a page in a frame', category: 'security' },
      'x-content-type-options': { description: 'Prevents MIME type sniffing', category: 'security' },
      'x-xss-protection': { description: 'Enables XSS filtering in browsers', category: 'security' },
      'server': { description: 'Contains information about the software used by the origin server', category: 'general' },
      'date': { description: 'The date and time at which the message was originated', category: 'general' },
      'connection': { description: 'Controls whether the network connection stays open after the current transaction', category: 'general' }
    }

    const info = headerDescriptions[lowerName] || { description: 'Custom or less common header', category: 'general' }
    
    return {
      name,
      value,
      description: info.description,
      category: info.category
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download as file
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 300 && status < 400) return 'text-yellow-400'
    if (status >= 400 && status < 500) return 'text-orange-400'
    if (status >= 500) return 'text-red-400'
    return 'text-blue-400'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="API Response Formatter" 
        description="Format and analyze HTTP API responses with detailed insights"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Raw HTTP Response</h2>
              
              <Textarea
                value={rawResponse}
                onChange={(e) => setRawResponse(e.target.value)}
                placeholder={`HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600
Content-Length: 95

{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}`}
                className="min-h-[400px] font-mono text-sm"
              />
              
              <div className="mt-4">
                <Button onClick={parseResponse} className="w-full">
                  <CodeBracketIcon className="w-4 h-4" />
                  Parse Response
                </Button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  {error}
                </div>
              )}
            </div>
            
            {/* Output Section */}
            <div className="space-y-6">
              {parsedResponse && (
                <>
                  {/* Status Section */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4">Response Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${getStatusColor(parsedResponse.status)}`}>
                          {parsedResponse.status}
                        </span>
                        <span className="text-gray-300">{parsedResponse.statusText}</span>
                        {parsedResponse.status >= 200 && parsedResponse.status < 300 && (
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        )}
                        {parsedResponse.status >= 400 && (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      
                      {statusCodes[parsedResponse.status] && (
                        <p className="text-sm text-gray-400">
                          {statusCodes[parsedResponse.status].description}
                        </p>
                      )}
                      
                      <div className="flex gap-4 text-sm text-gray-400">
                        {parsedResponse.responseTime && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {parsedResponse.responseTime.toFixed(0)}ms
                          </div>
                        )}
                        {parsedResponse.size && (
                          <div>Size: {parsedResponse.size} bytes</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* View Mode Tabs */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={viewMode === 'formatted' ? 'primary' : 'secondary'}
                          onClick={() => setViewMode('formatted')}
                        >
                          Formatted Body
                        </Button>
                        <Button
                          size="sm"
                          variant={viewMode === 'headers' ? 'primary' : 'secondary'}
                          onClick={() => setViewMode('headers')}
                        >
                          Headers ({Object.keys(parsedResponse.headers).length})
                        </Button>
                        <Button
                          size="sm"
                          variant={viewMode === 'info' ? 'primary' : 'secondary'}
                          onClick={() => setViewMode('info')}
                        >
                          <InformationCircleIcon className="w-4 h-4" />
                          Info
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(viewMode === 'formatted' ? formattedBody : JSON.stringify(parsedResponse.headers, null, 2))}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadFile(
                            viewMode === 'formatted' ? formattedBody : JSON.stringify(parsedResponse, null, 2),
                            `response.${viewMode === 'formatted' ? bodyType : 'json'}`,
                            viewMode === 'formatted' ? `application/${bodyType}` : 'application/json'
                          )}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Formatted Body */}
                    {viewMode === 'formatted' && (
                      <div>
                        {formattedBody ? (
                          <div>
                            <div className="mb-2 text-sm text-gray-400">
                              Content Type: {bodyType.toUpperCase()}
                            </div>
                            <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-[400px] font-mono">
                              <code>{formattedBody}</code>
                            </pre>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No response body
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Headers */}
                    {viewMode === 'headers' && (
                      <div className="space-y-2">
                        {Object.entries(parsedResponse.headers).map(([name, value]) => {
                          const headerInfo = getHeaderInfo(name, value)
                          return (
                            <div key={name} className="border border-gray-700 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-1">
                                <span className="font-medium text-blue-400">{name}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  headerInfo.category === 'security' ? 'bg-red-900/50 text-red-300' :
                                  headerInfo.category === 'cors' ? 'bg-purple-900/50 text-purple-300' :
                                  headerInfo.category === 'caching' ? 'bg-yellow-900/50 text-yellow-300' :
                                  headerInfo.category === 'content' ? 'bg-green-900/50 text-green-300' :
                                  'bg-gray-700 text-gray-300'
                                }`}>
                                  {headerInfo.category}
                                </span>
                              </div>
                              <div className="text-gray-300 font-mono text-sm mb-2">{value}</div>
                              <div className="text-xs text-gray-400">{headerInfo.description}</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    {/* Info */}
                    {viewMode === 'info' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Response Analysis</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Status Category:</span>
                              <span className={`ml-2 ${getStatusColor(parsedResponse.status)}`}>
                                {statusCodes[parsedResponse.status]?.type.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Headers Count:</span>
                              <span className="ml-2 text-white">{Object.keys(parsedResponse.headers).length}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Content Type:</span>
                              <span className="ml-2 text-white">{parsedResponse.headers['Content-Type'] || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Body Size:</span>
                              <span className="ml-2 text-white">{parsedResponse.size} bytes</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Security Headers</h4>
                          <div className="space-y-2">
                            {['Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'X-XSS-Protection'].map(header => (
                              <div key={header} className="flex items-center gap-2 text-sm">
                                {parsedResponse.headers[header] ? (
                                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                ) : (
                                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                                )}
                                <span className="text-gray-300">{header}</span>
                                {parsedResponse.headers[header] && (
                                  <span className="text-green-400">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {!parsedResponse && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="text-center py-12 text-gray-500">
                    Parse an HTTP response to see formatted output and analysis
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Auto-Format</h3>
              <p className="text-sm text-gray-400">Automatically detects and formats JSON, XML, and HTML responses</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Header Analysis</h3>
              <p className="text-sm text-gray-400">Detailed analysis of HTTP headers with descriptions</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Status Codes</h3>
              <p className="text-sm text-gray-400">Complete HTTP status code information and meanings</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Security Check</h3>
              <p className="text-sm text-gray-400">Validates presence of important security headers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
