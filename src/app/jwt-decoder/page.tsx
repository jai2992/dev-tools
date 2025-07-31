'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ClipboardIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Textarea from '../../components/common/Textarea'

interface JwtHeader {
  alg: string
  typ: string
  kid?: string
  [key: string]: unknown
}

interface JwtPayload {
  iss?: string // issuer
  sub?: string // subject
  aud?: string | string[] // audience
  exp?: number // expiration time
  nbf?: number // not before
  iat?: number // issued at
  jti?: string // JWT ID
  [key: string]: unknown
}

interface DecodedJwt {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  raw: {
    header: string
    payload: string
    signature: string
  }
}

interface TokenValidation {
  isValidFormat: boolean
  isExpired: boolean
  isNotYetValid: boolean
  timeUntilExpiry?: number
  timeSinceIssued?: number
  errors: string[]
  warnings: string[]
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [decodedJwt, setDecodedJwt] = useState<DecodedJwt | null>(null)
  const [validation, setValidation] = useState<TokenValidation | null>(null)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'decoded' | 'validation' | 'generator'>('decoded')
  
  // JWT Generation fields
  const [genHeader, setGenHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
  const [genPayload, setGenPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}')
  const [genSecret, setGenSecret] = useState('your-256-bit-secret')
  const [generatedToken, setGeneratedToken] = useState('')

  // Decode JWT token
  const decodeToken = useCallback((tokenValue: string) => {
    if (!tokenValue.trim()) {
      setDecodedJwt(null)
      setValidation(null)
      setError('')
      return
    }

    try {
      const parts = tokenValue.split('.')
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.')
      }

      const [headerPart, payloadPart, signaturePart] = parts

      // Decode header
      const headerDecoded = base64UrlDecode(headerPart)
      const header: JwtHeader = JSON.parse(headerDecoded)

      // Decode payload
      const payloadDecoded = base64UrlDecode(payloadPart)
      const payload: JwtPayload = JSON.parse(payloadDecoded)

      const decoded: DecodedJwt = {
        header,
        payload,
        signature: signaturePart,
        raw: {
          header: headerDecoded,
          payload: payloadDecoded,
          signature: signaturePart
        }
      }

      setDecodedJwt(decoded)
      validateToken(decoded)
      setError('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to decode JWT: ${message}`)
      setDecodedJwt(null)
      setValidation(null)
    }
  }, [])

  // Base64 URL decode
  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    str += '='.repeat((4 - str.length % 4) % 4)
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    
    try {
      // Decode base64
      const decoded = atob(str)
      // Convert to UTF-8
      return decodeURIComponent(escape(decoded))
    } catch (error) {
      throw new Error('Invalid base64 encoding')
    }
  }

  // Base64 URL encode
  const base64UrlEncode = (str: string): string => {
    // Convert to UTF-8 bytes then base64
    const encoded = btoa(unescape(encodeURIComponent(str)))
    // Make URL-safe
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  // Validate JWT
  const validateToken = (jwt: DecodedJwt) => {
    const now = Math.floor(Date.now() / 1000)
    const errors: string[] = []
    const warnings: string[] = []
    
    let isExpired = false
    let isNotYetValid = false
    let timeUntilExpiry: number | undefined
    let timeSinceIssued: number | undefined

    // Check expiration
    if (jwt.payload.exp) {
      if (jwt.payload.exp < now) {
        isExpired = true
        errors.push(`Token expired ${formatTimeAgo(jwt.payload.exp)} ago`)
      } else {
        timeUntilExpiry = jwt.payload.exp - now
      }
    } else {
      warnings.push('No expiration time (exp) claim found')
    }

    // Check not before
    if (jwt.payload.nbf && jwt.payload.nbf > now) {
      isNotYetValid = true
      errors.push(`Token not valid until ${formatTime(jwt.payload.nbf)}`)
    }

    // Check issued at
    if (jwt.payload.iat) {
      timeSinceIssued = now - jwt.payload.iat
      if (jwt.payload.iat > now) {
        warnings.push('Token issued in the future')
      }
    }

    // Check algorithm
    if (!jwt.header.alg || jwt.header.alg === 'none') {
      warnings.push('No algorithm specified or using "none" algorithm')
    }

    // Check required claims
    if (!jwt.payload.sub && !jwt.payload.iss) {
      warnings.push('Missing subject (sub) or issuer (iss) claims')
    }

    const validation: TokenValidation = {
      isValidFormat: true,
      isExpired,
      isNotYetValid,
      timeUntilExpiry,
      timeSinceIssued,
      errors,
      warnings
    }

    setValidation(validation)
  }

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Format time ago
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    
    if (diff < 60) return `${Math.floor(diff)} seconds`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`
    return `${Math.floor(diff / 86400)} days`
  }

  // Format duration
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`
    return `${Math.floor(seconds / 86400)} days`
  }

  // Generate JWT (simple implementation for demo)
  const generateJwt = () => {
    try {
      const header = JSON.parse(genHeader)
      const payload = JSON.parse(genPayload)
      
      const headerEncoded = base64UrlEncode(JSON.stringify(header))
      const payloadEncoded = base64UrlEncode(JSON.stringify(payload))
      
      // Simple signature (not cryptographically secure, just for demo)
      const data = `${headerEncoded}.${payloadEncoded}`
      const signature = base64UrlEncode(`signature_${genSecret}_${data}`)
      
      const token = `${headerEncoded}.${payloadEncoded}.${signature}`
      setGeneratedToken(token)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setError(`Failed to generate JWT: ${message}`)
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
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    decodeToken(token)
  }, [token, decodeToken])

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="JWT Decoder & Analyzer" 
        description="Decode, validate, and analyze JSON Web Tokens"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">JWT Token</h2>
                
                <Textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  className="min-h-[200px] font-mono text-sm"
                />
                
                {error && (
                  <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    {error}
                  </div>
                )}
              </div>

              {/* View Mode Tabs */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex gap-1 mb-4">
                  <Button
                    size="sm"
                    variant={viewMode === 'decoded' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('decoded')}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Decoded
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'validation' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('validation')}
                  >
                    <ShieldCheckIcon className="w-4 h-4" />
                    Validation
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'generator' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('generator')}
                  >
                    <KeyIcon className="w-4 h-4" />
                    Generator
                  </Button>
                </div>

                {/* JWT Generator */}
                {viewMode === 'generator' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Header</label>
                      <Textarea
                        value={genHeader}
                        onChange={(e) => setGenHeader(e.target.value)}
                        className="min-h-[100px] font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Payload</label>
                      <Textarea
                        value={genPayload}
                        onChange={(e) => setGenPayload(e.target.value)}
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secret (for demo only)</label>
                      <input
                        type="text"
                        value={genSecret}
                        onChange={(e) => setGenSecret(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono"
                      />
                    </div>
                    
                    <Button onClick={generateJwt} className="w-full">
                      Generate JWT
                    </Button>
                    
                    {generatedToken && (
                      <div className="mt-4">
                        <label className="block text-sm text-gray-400 mb-2">Generated Token</label>
                        <div className="bg-gray-800 border border-gray-700 rounded p-3">
                          <pre className="text-xs text-gray-300 font-mono break-all whitespace-pre-wrap">
                            {generatedToken}
                          </pre>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => copyToClipboard(generatedToken)}>
                              Copy
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setToken(generatedToken)}>
                              Load for Analysis
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Output Section */}
            <div className="space-y-6">
              {decodedJwt && viewMode === 'decoded' && (
                <>
                  {/* Header */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-400">Header</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(JSON.stringify(decodedJwt.header, null, 2))}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto font-mono">
                      <code>{JSON.stringify(decodedJwt.header, null, 2)}</code>
                    </pre>
                  </div>

                  {/* Payload */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-400">Payload</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(JSON.stringify(decodedJwt.payload, null, 2))}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto font-mono">
                      <code>{JSON.stringify(decodedJwt.payload, null, 2)}</code>
                    </pre>
                  </div>

                  {/* Signature */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4">Signature</h3>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <code className="text-sm text-gray-300 font-mono break-all">
                        {decodedJwt.signature}
                      </code>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Algorithm: {decodedJwt.header.alg}
                    </p>
                  </div>
                </>
              )}

              {validation && viewMode === 'validation' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4">Token Validation</h3>
                  
                  <div className="space-y-4">
                    {/* Status */}
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${
                      validation.errors.length === 0 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                    }`}>
                      {validation.errors.length === 0 ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <ExclamationTriangleIcon className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {validation.errors.length === 0 ? 'Token is valid' : 'Token has issues'}
                      </span>
                    </div>

                    {/* Time Information */}
                    {decodedJwt && (
                      <div className="space-y-3">
                        {decodedJwt.payload.iat && (
                          <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400">Issued:</span>
                            <span className="text-white">{formatTime(decodedJwt.payload.iat)}</span>
                            {validation.timeSinceIssued && (
                              <span className="text-gray-400">({formatDuration(validation.timeSinceIssued)} ago)</span>
                            )}
                          </div>
                        )}

                        {decodedJwt.payload.exp && (
                          <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="w-4 h-4 text-orange-400" />
                            <span className="text-gray-400">Expires:</span>
                            <span className={validation.isExpired ? 'text-red-400' : 'text-white'}>
                              {formatTime(decodedJwt.payload.exp)}
                            </span>
                            {validation.timeUntilExpiry && (
                              <span className="text-gray-400">(in {formatDuration(validation.timeUntilExpiry)})</span>
                            )}
                          </div>
                        )}

                        {decodedJwt.payload.nbf && (
                          <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-400">Not Before:</span>
                            <span className="text-white">{formatTime(decodedJwt.payload.nbf)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Errors */}
                    {validation.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-400 mb-2">Errors:</h4>
                        <ul className="space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-300 flex items-center gap-2">
                              <ExclamationTriangleIcon className="w-4 h-4" />
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {validation.warnings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-400 mb-2">Warnings:</h4>
                        <ul className="space-y-1">
                          {validation.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-yellow-300 flex items-center gap-2">
                              <ExclamationTriangleIcon className="w-4 h-4" />
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Claims Information */}
                    {decodedJwt && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Claims Information:</h4>
                        <div className="space-y-2 text-sm">
                          {decodedJwt.payload.iss && (
                            <div><span className="text-gray-400">Issuer:</span> <span className="text-white">{decodedJwt.payload.iss}</span></div>
                          )}
                          {decodedJwt.payload.sub && (
                            <div><span className="text-gray-400">Subject:</span> <span className="text-white">{decodedJwt.payload.sub}</span></div>
                          )}
                          {decodedJwt.payload.aud && (
                            <div><span className="text-gray-400">Audience:</span> <span className="text-white">{Array.isArray(decodedJwt.payload.aud) ? decodedJwt.payload.aud.join(', ') : decodedJwt.payload.aud}</span></div>
                          )}
                          {decodedJwt.payload.jti && (
                            <div><span className="text-gray-400">JWT ID:</span> <span className="text-white">{decodedJwt.payload.jti}</span></div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!decodedJwt && !error && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="text-center py-12 text-gray-500">
                    Enter a JWT token to see decoded information
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Decode & Parse</h3>
              <p className="text-sm text-gray-400">Decode JWT headers, payloads, and signatures</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Validation</h3>
              <p className="text-sm text-gray-400">Check expiration, claims, and token validity</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Security Analysis</h3>
              <p className="text-sm text-gray-400">Analyze algorithms and security best practices</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Token Generation</h3>
              <p className="text-sm text-gray-400">Generate sample JWTs for testing purposes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
