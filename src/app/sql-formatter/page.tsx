'use client'

import { useState } from 'react'
import { format } from 'sql-formatter'
import { 
  ClipboardIcon, 
  ArrowDownTrayIcon, 
  CodeBracketIcon,
  CubeIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Textarea from '../../components/common/Textarea'

interface QueryInfo {
  index: number
  type: string
  length: number
  lines: number
}

interface SqlAnalysisResult {
  queries: QueryInfo[]
  tables: string[]
  columns: string[]
  keywords: string[]
  functions: string[]
  complexity: string
  suggestions: string[]
}

interface SqlAnalysis {
  queries: QueryInfo[]
  tables: Set<string>
  columns: Set<string>
  keywords: Set<string>
  functions: Set<string>
  complexity: string
  suggestions: string[]
}

interface FormatterConfig {
  language: string
  tabWidth: number
  useTabs: boolean
  keywordCase: 'preserve' | 'upper' | 'lower'
  dataTypeCase: 'preserve' | 'upper' | 'lower'
  functionCase: 'preserve' | 'upper' | 'lower'
  identifierCase: 'preserve' | 'upper' | 'lower'
  indentStyle: 'standard' | 'tabularLeft' | 'tabularRight'
  linesBetweenQueries: number
  denseOperators: boolean
  newlineBeforeOpeningParen: boolean
  newlineBeforeClosingParen: boolean
}

const sqlDialects = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'mssql', label: 'SQL Server' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'db2', label: 'IBM DB2' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'redshift', label: 'Redshift' },
  { value: 'spark', label: 'Spark SQL' }
]

const commonSqlKeywords = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
  'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
  'ALTER', 'DROP', 'INDEX', 'TABLE', 'DATABASE', 'VIEW', 'PROCEDURE', 'FUNCTION',
  'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT', 'WITH', 'AS', 'DISTINCT', 'ALL',
  'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL'
]

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [config, setConfig] = useState<FormatterConfig>({
    language: 'sql',
    tabWidth: 2,
    useTabs: false,
    keywordCase: 'upper',
    dataTypeCase: 'upper', 
    functionCase: 'upper',
    identifierCase: 'preserve',
    indentStyle: 'standard',
    linesBetweenQueries: 1,
    denseOperators: false,
    newlineBeforeOpeningParen: false,
    newlineBeforeClosingParen: false
  })
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'formatted' | 'minified' | 'analysis'>('formatted')
  const [sqlAnalysis, setSqlAnalysis] = useState<SqlAnalysisResult | null>(null)

  // Format SQL
  const formatSql = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const formatterOptions = {
        language: config.language as 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'mariadb' | 'db2' | 'snowflake' | 'bigquery' | 'redshift' | 'spark',
        tabWidth: config.tabWidth,
        useTabs: config.useTabs,
        keywordCase: config.keywordCase,
        dataTypeCase: config.dataTypeCase,
        functionCase: config.functionCase,
        identifierCase: config.identifierCase,
        indentStyle: config.indentStyle,
        linesBetweenQueries: config.linesBetweenQueries,
        denseOperators: config.denseOperators,
        newlineBeforeOpeningParen: config.newlineBeforeOpeningParen,
        newlineBeforeClosingParen: config.newlineBeforeClosingParen
      }

      if (viewMode === 'formatted') {
        const formatted = format(input, formatterOptions)
        setOutput(formatted)
      } else if (viewMode === 'minified') {
        // Simple minification - remove extra whitespace
        const minified = input
          .replace(/\s+/g, ' ')
          .replace(/\s*([(),;])\s*/g, '$1')
          .replace(/\s*(=|!=|<>|<=|>=|<|>)\s*/g, ' $1 ')
          .trim()
        setOutput(minified)
      } else if (viewMode === 'analysis') {
        analyzeSql(input)
        setOutput('')
      }
      
      setError('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Error formatting SQL: ${message}`)
      setOutput('')
    }
  }

  // Analyze SQL
  const analyzeSql = (sql: string): SqlAnalysis => {
    const analysis: SqlAnalysis = {
      queries: [] as QueryInfo[],
      tables: new Set<string>(),
      columns: new Set<string>(),
      keywords: new Set<string>(),
      functions: new Set<string>(),
      complexity: 'Low',
      suggestions: [] as string[]
    }

    // Split into individual queries
    const queries = sql.split(';').filter(q => q.trim())
    analysis.queries = queries.map((query, index) => {
      const trimmed = query.trim()
      let type = 'UNKNOWN'
      
      if (trimmed.toUpperCase().startsWith('SELECT')) type = 'SELECT'
      else if (trimmed.toUpperCase().startsWith('INSERT')) type = 'INSERT'
      else if (trimmed.toUpperCase().startsWith('UPDATE')) type = 'UPDATE'
      else if (trimmed.toUpperCase().startsWith('DELETE')) type = 'DELETE'
      else if (trimmed.toUpperCase().startsWith('CREATE')) type = 'CREATE'
      else if (trimmed.toUpperCase().startsWith('ALTER')) type = 'ALTER'
      else if (trimmed.toUpperCase().startsWith('DROP')) type = 'DROP'
      
      return {
        index: index + 1,
        type,
        length: trimmed.length,
        lines: trimmed.split('\n').length
      }
    })

    // Extract tables (basic pattern matching)
    const tableMatches = sql.match(/(?:FROM|JOIN|INTO|UPDATE)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
    if (tableMatches) {
      tableMatches.forEach(match => {
        const table = match.split(/\s+/)[1]
        if (table) analysis.tables.add(table.toLowerCase())
      })
    }

    // Extract keywords
    commonSqlKeywords.forEach(keyword => {
      if (sql.toUpperCase().includes(keyword)) {
        analysis.keywords.add(keyword)
      }
    })

    // Complexity analysis
    const complexityFactors = [
      sql.includes('UNION'),
      sql.includes('SUBQUERY') || sql.includes('SELECT') && sql.split('SELECT').length > 2,
      sql.includes('CASE'),
      sql.includes('WITH'),
      (sql.match(/JOIN/gi)?.length || 0) > 2,
      analysis.tables.size > 5
    ].filter(Boolean).length

    if (complexityFactors >= 3) analysis.complexity = 'High'
    else if (complexityFactors >= 1) analysis.complexity = 'Medium'

    // Generate suggestions
    if (sql.includes('SELECT *')) {
      analysis.suggestions.push('Consider specifying column names instead of using SELECT *')
    }
    if (!sql.includes('WHERE') && sql.toUpperCase().includes('SELECT')) {
      analysis.suggestions.push('Consider adding WHERE clause to limit results')
    }
    if (sql.includes('LIKE %') && sql.includes('% LIKE')) {
      analysis.suggestions.push('Leading wildcards in LIKE can be slow - consider full-text search')
    }
    if (analysis.queries.some(q => q.type === 'SELECT' && !sql.includes('LIMIT'))) {
      analysis.suggestions.push('Consider adding LIMIT to SELECT queries for better performance')
    }

    setSqlAnalysis({
      ...analysis,
      tables: Array.from(analysis.tables),
      columns: Array.from(analysis.columns),
      keywords: Array.from(analysis.keywords),
      functions: Array.from(analysis.functions)
    })
    
    return analysis
  }

  // Load sample SQL
  const loadSample = () => {
    const sampleSql = `SELECT u.id, u.name, u.email, p.title, p.content, c.name as category
FROM users u
INNER JOIN posts p ON u.id = p.user_id
LEFT JOIN categories c ON p.category_id = c.id
WHERE u.active = 1 AND p.published_at IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;

UPDATE users SET last_login = NOW() WHERE id = 123;

INSERT INTO posts (user_id, title, content, category_id) 
VALUES (1, 'Sample Post', 'This is a sample post content', 2);`
    
    setInput(sampleSql)
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      const content = viewMode === 'analysis' ? JSON.stringify(sqlAnalysis, null, 2) : output
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download file
  const downloadFile = () => {
    let content = output
    let filename = 'formatted.sql'
    let mimeType = 'text/sql'
    
    if (viewMode === 'analysis') {
      content = JSON.stringify(sqlAnalysis, null, 2)
      filename = 'sql-analysis.json'
      mimeType = 'application/json'
    } else if (viewMode === 'minified') {
      filename = 'minified.sql'
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader 
        title="SQL Formatter & Analyzer" 
        description="Format, beautify, and analyze SQL queries with multi-dialect support"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">SQL Input</h2>
                  <Button onClick={loadSample} size="sm" variant="secondary">
                    Load Sample
                  </Button>
                </div>
                
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your SQL query here..."
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="mt-4 flex gap-2">
                  <Button onClick={formatSql} className="flex-1">
                    <CodeBracketIcon className="w-4 h-4" />
                    Format SQL
                  </Button>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    {error}
                  </div>
                )}
              </div>
            </div>
            
            {/* Configuration */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cog6ToothIcon className="w-5 h-5" />
                  Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">SQL Dialect</label>
                    <select 
                      value={config.language}
                      onChange={(e) => setConfig({...config, language: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                    >
                      {sqlDialects.map(dialect => (
                        <option key={dialect.value} value={dialect.value}>
                          {dialect.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Indentation</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={config.tabWidth}
                        onChange={(e) => setConfig({...config, tabWidth: parseInt(e.target.value)})}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                        placeholder="Width"
                      />
                      <select
                        value={config.indentStyle}
                        onChange={(e) => setConfig({...config, indentStyle: e.target.value as 'standard' | 'tabularLeft' | 'tabularRight'})}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                      >
                        <option value="standard">Standard</option>
                        <option value="tabularLeft">Tabular Left</option>
                        <option value="tabularRight">Tabular Right</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Keyword Case</label>
                    <select 
                      value={config.keywordCase}
                      onChange={(e) => setConfig({...config, keywordCase: e.target.value as 'preserve' | 'upper' | 'lower'})}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                    >
                      <option value="upper">UPPERCASE</option>
                      <option value="lower">lowercase</option>
                      <option value="preserve">Preserve</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Function Case</label>
                    <select 
                      value={config.functionCase}
                      onChange={(e) => setConfig({...config, functionCase: e.target.value as 'preserve' | 'upper' | 'lower'})}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                    >
                      <option value="upper">UPPERCASE</option>
                      <option value="lower">lowercase</option>
                      <option value="preserve">Preserve</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={config.useTabs}
                        onChange={(e) => setConfig({...config, useTabs: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Use tabs instead of spaces</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={config.denseOperators}
                        onChange={(e) => setConfig({...config, denseOperators: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Dense operators</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Output Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">Output</h2>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={viewMode === 'formatted' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('formatted')}
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                        Formatted
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'minified' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('minified')}
                      >
                        <CubeIcon className="w-4 h-4" />
                        Minified
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'analysis' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('analysis')}
                      >
                        Analysis
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {(output || sqlAnalysis) && (
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
                
                {/* Formatted/Minified Output */}
                {(viewMode === 'formatted' || viewMode === 'minified') && output && (
                  <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-[500px] font-mono">
                    <code>{output}</code>
                  </pre>
                )}
                
                {/* Analysis Output */}
                {viewMode === 'analysis' && sqlAnalysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-lg font-semibold text-blue-400">{sqlAnalysis.queries.length}</div>
                        <div className="text-sm text-gray-400">Queries</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-lg font-semibold text-green-400">{sqlAnalysis.tables.length}</div>
                        <div className="text-sm text-gray-400">Tables</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className={`text-lg font-semibold ${
                          sqlAnalysis.complexity === 'High' ? 'text-red-400' :
                          sqlAnalysis.complexity === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {sqlAnalysis.complexity}
                        </div>
                        <div className="text-sm text-gray-400">Complexity</div>
                      </div>
                    </div>
                    
                    {sqlAnalysis.tables.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Tables Referenced:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sqlAnalysis.tables.map((table: string) => (
                            <span key={table} className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm">
                              {table}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {sqlAnalysis.queries.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Query Breakdown:</h4>
                        <div className="space-y-2">
                          {sqlAnalysis.queries.map((query: QueryInfo) => (
                            <div key={query.index} className="bg-gray-800 rounded p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white">Query {query.index}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  query.type === 'SELECT' ? 'bg-blue-900/50 text-blue-300' :
                                  query.type === 'INSERT' ? 'bg-green-900/50 text-green-300' :
                                  query.type === 'UPDATE' ? 'bg-yellow-900/50 text-yellow-300' :
                                  query.type === 'DELETE' ? 'bg-red-900/50 text-red-300' :
                                  'bg-gray-700 text-gray-300'
                                }`}>
                                  {query.type}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {query.length} characters, {query.lines} lines
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {sqlAnalysis.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Optimization Suggestions:</h4>
                        <ul className="space-y-2">
                          {sqlAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-300 flex items-start gap-2">
                              <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {!output && !sqlAnalysis && !error && (
                  <div className="text-center py-12 text-gray-500">
                    Enter SQL code and click &quot;Format SQL&quot; to see the output
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Multi-Dialect</h3>
              <p className="text-sm text-gray-400">Support for MySQL, PostgreSQL, SQLite, and more</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Customizable</h3>
              <p className="text-sm text-gray-400">Extensive formatting options and style preferences</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Analysis</h3>
              <p className="text-sm text-gray-400">Query complexity analysis and optimization suggestions</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-blue-400 mb-2">Minification</h3>
              <p className="text-sm text-gray-400">Compress SQL for production or network efficiency</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
