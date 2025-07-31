'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  CodeBracketIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Textarea from '../../components/common/Textarea'

interface JsonError {
  line: number
  column: number
  message: string
}

interface JsonTreeNode {
  key: string
  value: unknown
  type: string
  path: string
  isExpanded: boolean
  level: number
}

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [errors, setErrors] = useState<JsonError[]>([])
  const [indent, setIndent] = useState(2)
  const [viewMode, setViewMode] = useState<'formatted' | 'tree' | 'minified'>('formatted')
  const [treeData, setTreeData] = useState<JsonTreeNode[]>([])
  const [searchPath, setSearchPath] = useState('')
  const [schema, setSchema] = useState('')
  const [schemaErrors, setSchemaErrors] = useState<string[]>([])

  // JSON validation and formatting
  const validateAndFormat = useCallback(() => {
    if (!input.trim()) {
      setIsValid(null)
      setOutput('')
      setErrors([])
      setTreeData([])
      return
    }

    try {
      const parsed = JSON.parse(input)
      setIsValid(true)
      setErrors([])
      
      if (viewMode === 'formatted') {
        setOutput(JSON.stringify(parsed, null, indent))
      } else if (viewMode === 'minified') {
        setOutput(JSON.stringify(parsed))
      } else if (viewMode === 'tree') {
        const tree = generateTreeData(parsed, '', 0)
        setTreeData(tree)
        setOutput('')
      }
      
      // Validate against schema if provided
      if (schema.trim()) {
        validateSchema(parsed)
      }
    } catch (error: unknown) {
      setIsValid(false)
      setOutput('')
      setTreeData([])
      
      // Parse error details
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const lineMatch = errorMessage.match(/line (\d+)/)
      const columnMatch = errorMessage.match(/column (\d+)/)
      
      setErrors([{
        line: lineMatch ? parseInt(lineMatch[1]) : 1,
        column: columnMatch ? parseInt(columnMatch[1]) : 1,
        message: errorMessage
      }])
    }
  }, [input, indent, viewMode, schema])

  // Generate tree data structure
  const generateTreeData = (obj: unknown, path: string, level: number): JsonTreeNode[] => {
    const nodes: JsonTreeNode[] = []
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`
        const node: JsonTreeNode = {
          key: `[${index}]`,
          value: item,
          type: Array.isArray(item) ? 'array' : typeof item === 'object' && item !== null ? 'object' : typeof item,
          path: currentPath,
          isExpanded: level < 2,
          level
        }
        nodes.push(node)
        
        if (typeof item === 'object' && item !== null) {
          if (node.isExpanded) {
            nodes.push(...generateTreeData(item, currentPath, level + 1))
          }
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key
        const node: JsonTreeNode = {
          key,
          value,
          type: Array.isArray(value) ? 'array' : typeof value === 'object' && value !== null ? 'object' : typeof value,
          path: currentPath,
          isExpanded: level < 2,
          level
        }
        nodes.push(node)
        
        if (typeof value === 'object' && value !== null) {
          if (node.isExpanded) {
            nodes.push(...generateTreeData(value, currentPath, level + 1))
          }
        }
      })
    }
    
    return nodes
  }

  // Toggle tree node expansion
  const toggleNode = (path: string) => {
    setTreeData(prevTree => {
      const newTree = [...prevTree]
      const nodeIndex = newTree.findIndex(node => node.path === path)
      
      if (nodeIndex !== -1) {
        newTree[nodeIndex].isExpanded = !newTree[nodeIndex].isExpanded
        
        // Remove or add child nodes
        if (!newTree[nodeIndex].isExpanded) {
          // Remove child nodes by filtering
          const nodeLevel = newTree[nodeIndex].level
          return newTree.filter((node, idx) => 
            idx <= nodeIndex || node.level <= nodeLevel
          )
        } else {
          // Add child nodes
          const node = newTree[nodeIndex]
          if (typeof node.value === 'object' && node.value !== null) {
            const childNodes = generateTreeData(node.value, node.path, node.level + 1)
            newTree.splice(nodeIndex + 1, 0, ...childNodes)
          }
        }
      }
      
      return newTree
    })
  }

  // Schema validation
  const validateSchema = (data: unknown) => {
    try {
      const schemaObj = JSON.parse(schema)
      // Basic schema validation (simplified)
      const errors = validateJsonSchema(data, schemaObj)
      setSchemaErrors(errors)
    } catch {
      setSchemaErrors(['Invalid schema format'])
    }
  }

  const validateJsonSchema = (data: unknown, schema: Record<string, unknown>): string[] => {
    const errors: string[] = []
    
    if (schema.type) {
      const dataType = Array.isArray(data) ? 'array' : typeof data
      if (dataType !== schema.type) {
        errors.push(`Expected type ${schema.type}, got ${dataType}`)
      }
    }
    
    if (schema.required && Array.isArray(schema.required)) {
      const dataObj = data as Record<string, unknown>
      (schema.required as string[]).forEach((field: string) => {
        if (!(field in dataObj)) {
          errors.push(`Required field "${field}" is missing`)
        }
      })
    }
    
    return errors
  }

  // Find value by path
  const findByPath = (path: string) => {
    if (!path.trim()) return
    
    try {
      const parsed = JSON.parse(input)
      const pathParts = path.split(/[\.\[]/).map(p => p.replace(/\]$/, ''))
      let current: unknown = parsed
      
      for (const part of pathParts) {
        if (part === '') continue
        current = (current as Record<string, unknown>)[part]
        if (current === undefined) break
      }
      
      if (current !== undefined) {
        setOutput(JSON.stringify(current, null, indent))
      }
    } catch {
      // Handle error silently
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You might want to show a toast notification here
    } catch (err: unknown) {
      console.error('Failed to copy:', err)
    }
  }

  // Download as file
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    validateAndFormat()
  }, [validateAndFormat])

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="JSON Formatter & Validator" 
        description="Format, validate, and explore JSON data with advanced features"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Input JSON</h2>
                
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="min-h-[400px] font-mono text-sm"
                />
                
                {/* Controls */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Indent:</label>
                    <select 
                      value={indent} 
                      onChange={(e) => setIndent(Number(e.target.value))}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">View:</label>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={viewMode === 'formatted' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('formatted')}
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                        Format
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'tree' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('tree')}
                      >
                        <EyeIcon className="w-4 h-4" />
                        Tree
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'minified' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('minified')}
                      >
                        <CubeIcon className="w-4 h-4" />
                        Minify
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Validation Status */}
                {isValid !== null && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    isValid ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {isValid ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </span>
                  </div>
                )}
                
                {/* Errors */}
                {errors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                        Line {error.line}, Column {error.column}: {error.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Schema Validation */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Schema Validation (Optional)</h3>
                <Textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  placeholder="Paste JSON schema here..."
                  className="min-h-[150px] font-mono text-sm"
                />
                {schemaErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {schemaErrors.map((error, index) => (
                      <div key={index} className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Output Section */}
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Output</h2>
                  <div className="flex gap-2">
                    {(output || treeData.length > 0) && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(output)}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadFile(output, 'formatted.json')}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Path Finder */}
                {isValid && viewMode !== 'tree' && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Find by path:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchPath}
                        onChange={(e) => setSearchPath(e.target.value)}
                        placeholder="e.g., user.name or data[0].id"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                      />
                      <Button size="sm" onClick={() => findByPath(searchPath)}>
                        Find
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Tree View */}
                {viewMode === 'tree' && treeData.length > 0 && (
                  <div className="max-h-[500px] overflow-auto">
                    {treeData.map((node, index) => (
                      <TreeNode 
                        key={`${node.path}-${index}`} 
                        node={node} 
                        onToggle={toggleNode} 
                      />
                    ))}
                  </div>
                )}
                
                {/* Formatted/Minified Output */}
                {viewMode !== 'tree' && output && (
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-[500px] font-mono">
                    <code>{output}</code>
                  </pre>
                )}
                
                {!output && !treeData.length && isValid === null && (
                  <div className="text-center py-12 text-gray-500">
                    Enter JSON data to see formatted output
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Validation</h3>
              <p className="text-sm text-gray-400">Real-time JSON syntax validation with detailed error messages</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Formatting</h3>
              <p className="text-sm text-gray-400">Beautiful formatting with customizable indentation</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Tree View</h3>
              <p className="text-sm text-gray-400">Interactive tree view for exploring large JSON structures</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Schema Validation</h3>
              <p className="text-sm text-gray-400">Validate JSON against custom schemas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Tree Node Component
function TreeNode({ node, onToggle }: { node: JsonTreeNode; onToggle: (path: string) => void }) {
  const isObject = node.type === 'object' || node.type === 'array'
  const hasChildren: boolean = (() => {
    if (!isObject || !node.value) return false
    if (typeof node.value !== 'object' || node.value === null) return false
    return Object.keys(node.value).length > 0
  })()
  
  const getValueDisplay = (): string => {
    if (node.type === 'string') return `"${node.value}"`
    if (node.type === 'object' || node.type === 'array') {
      if (node.value && typeof node.value === 'object' && node.value !== null) {
        const count = Object.keys(node.value).length
        return node.type === 'array' ? `Array[${count}]` : `Object{${count}}`
      }
      return node.type === 'array' ? 'Array[0]' : 'Object{0}'
    }
    return String(node.value)
  }
  
  const getTypeColor = () => {
    switch (node.type) {
      case 'string': return 'text-green-400'
      case 'number': return 'text-blue-400'
      case 'boolean': return 'text-purple-400'
      case 'object': return 'text-yellow-400'
      case 'array': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div 
      className="flex items-center py-1 hover:bg-gray-800/50 rounded px-2 cursor-pointer"
      style={{ paddingLeft: `${node.level * 16 + 8}px` }}
      onClick={() => hasChildren && onToggle(node.path)}
    >
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {hasChildren && (
          <span className="flex-shrink-0">
            {node.isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-4" />}
        
        <span className="text-gray-300 font-medium mr-2">{node.key}:</span>
        <span className={`${getTypeColor()} font-mono text-sm truncate`}>
          {getValueDisplay()}
        </span>
      </div>
    </div>
  )
}
