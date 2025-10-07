/** @jsxImportSource react */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Fuse from 'fuse.js'
import type { IFuseOptions, FuseResultMatch } from 'fuse.js'

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface SearchDocument {
  id: string
  title: string
  description: string
  content: string
  url: string
  lang: string
}

interface SearchResult extends SearchDocument {
  score?: number
  matches?: readonly FuseResultMatch[]
}

interface HighlightMatch {
  text: string
  highlight: boolean
}

// ============================================================================
// Fuse.js Configuration
// ============================================================================

const FUSE_OPTIONS: IFuseOptions<SearchDocument> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'content', weight: 0.2 }
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true
}

const MAX_RESULTS = 6
const DEBOUNCE_DELAY = 300

// ============================================================================
// Main Component
// ============================================================================

export default function Search() {
  // State
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [fuseInstance, setFuseInstance] = useState<Fuse<SearchDocument> | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ============================================================================
  // Load Search Index on Mount
  // ============================================================================

  useEffect(() => {
    let isMounted = true

    const loadSearchIndex = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/search-index.json')
        if (!response.ok) {
          throw new Error('Failed to load search index')
        }

        const data = await response.json()
        if (!isMounted) {
          return
        }

        const docs = Array.isArray(data.documents) ? data.documents : []
        setFuseInstance(new Fuse(docs, FUSE_OPTIONS))
        setError('')
      } catch (err) {
        console.error('Search index load failed:', err)
        if (isMounted) {
          setError('Search is temporarily unavailable')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSearchIndex()

    return () => {
      isMounted = false
    }
  }, [])

  // ============================================================================
  // Debounce Query (300ms)
  // ============================================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [query])

  // ============================================================================
  // Click Outside Handler
  // ============================================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) {
        return
      }
      if (containerRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
      setActiveIndex(-1)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ============================================================================
  // Keyboard Shortcut (/ to focus)
  // ============================================================================

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  // ============================================================================
  // Execute Search
  // ============================================================================

  const results = useMemo<SearchResult[]>(() => {
    if (!fuseInstance || !debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      return []
    }

    const searchResults = fuseInstance.search(debouncedQuery.trim())
    
    return searchResults
      .slice(0, MAX_RESULTS)
      .map(({ item, score, matches }) => ({
        ...item,
        score,
        matches
      }))
  }, [fuseInstance, debouncedQuery])

  // ============================================================================
  // Highlight Matched Terms
  // ============================================================================

  const highlightMatches = useCallback((text: string, matches?: readonly FuseResultMatch[]): HighlightMatch[] => {
    if (!matches || matches.length === 0) {
      return [{ text, highlight: false }]
    }

    const allIndices: number[][] = []
    matches.forEach(match => {
      match.indices.forEach(([start, end]) => {
        allIndices.push([start, end])
      })
    })

    if (allIndices.length === 0) {
      return [{ text, highlight: false }]
    }

    // Merge overlapping indices
    allIndices.sort((a, b) => a[0] - b[0])
    const merged: number[][] = []
    let current = allIndices[0]

    for (let i = 1; i < allIndices.length; i++) {
      if (allIndices[i][0] <= current[1] + 1) {
        current = [current[0], Math.max(current[1], allIndices[i][1])]
      } else {
        merged.push(current)
        current = allIndices[i]
      }
    }
    merged.push(current)

    const parts: HighlightMatch[] = []
    let lastIndex = 0

    merged.forEach(([start, end]) => {
      if (start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, start), highlight: false })
      }
      parts.push({ text: text.slice(start, end + 1), highlight: true })
      lastIndex = end + 1
    })

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false })
    }

    return parts
  }, [])

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()

    if (activeIndex >= 0 && results[activeIndex]) {
      window.location.href = results[activeIndex].url
      return
    }

    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return
    }

    // Future: navigate to /search?q=... page
    // For now, just select first result if available
    if (results.length === 0) {
      return
    }

    window.location.href = results[0].url
  }, [activeIndex, results, query])

  const handleResultClick = useCallback((url: string) => {
    if (!url) {
      return
    }
    window.location.href = url
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(prev => {
        const nextIndex = prev + 1
        return nextIndex >= results.length ? results.length - 1 : nextIndex
      })
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(prev => {
        const nextIndex = prev - 1
        return nextIndex < 0 ? -1 : nextIndex
      })
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }, [results.length])

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            error ? 'Search temporarily unavailable (index failed to load)' : isLoading ? 'Loading search…' : 'Search documentation…'
          }
          disabled={isLoading}
          className="w-full px-3 py-2 pr-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search the site"
          aria-autocomplete="list"
          aria-controls="search-results"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Submit search"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="absolute left-0 right-0 mt-2 text-xs text-red-400 bg-gray-900 border border-red-500/30 rounded-md px-3 py-2 z-20">
          {error}
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && query.trim() && !error && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 shadow-xl"
          aria-label={`${results.length} search results`}
        >
          {results.map((result, index) => {
            const titleMatches = result.matches?.filter(m => m.key === 'title')
            const highlightedTitle = highlightMatches(result.title, titleMatches)

            return (
              <li key={result.id} role="presentation">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleResultClick(result.url)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors min-h-[44px] ${
                    activeIndex === index 
                      ? 'bg-blue-600/20 text-white' 
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {highlightedTitle.map((part, i) => (
                      part.highlight ? (
                        <mark key={i} className="bg-yellow-500/40 text-white rounded px-0.5">
                          {part.text}
                        </mark>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    ))}
                  </span>
                  {result.description && (
                    <span className="text-xs text-gray-400 line-clamp-2">
                      {result.description}
                    </span>
                  )}
                  <span className="text-xs text-blue-400">{result.url}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* No Results Message */}
      {isOpen && query.trim() && query.trim().length >= 2 && !error && results.length === 0 && !isLoading && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 shadow-xl px-4 py-6 text-center">
          <p className="text-sm text-gray-400 mb-2">No results found for "{query}"</p>
          <p className="text-xs text-gray-500">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  )
}
