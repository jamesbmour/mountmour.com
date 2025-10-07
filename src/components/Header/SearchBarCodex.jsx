import React, { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'content', weight: 0.2 }
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2
}

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [fuseInstance, setFuseInstance] = useState(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const loadSearchIndex = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/search-index.json')
        if (!response.ok) {
          throw new Error('Unable to load search index')
        }

        const data = await response.json()
        if (!isMounted) return

        const docs = Array.isArray(data.documents) ? data.documents : []
        setFuseInstance(new Fuse(docs, fuseOptions))
        setError('')
      } catch (err) {
        console.error('Search index load failed', err)
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target)) return
      setIsInputFocused(false)
      setActiveIndex(-1)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const results = useMemo(() => {
    if (!fuseInstance || !query.trim()) return []

    return fuseInstance
      .search(query.trim())
      .slice(0, 6)
      .map(({ item, score }) => ({ ...item, score }))
  }, [fuseInstance, query])

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex >= results.length) {
      setActiveIndex(results.length ? results.length - 1 : -1)
    }
  }, [results, activeIndex])

  const goToUrl = (url) => {
    if (typeof window === 'undefined') return
    window.location.href = url
  }

  const navigateToSearchPage = (searchQuery) => {
    goToUrl(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (activeIndex >= 0 && results[activeIndex]) {
      goToUrl(results[activeIndex].url)
      return
    }

    if (query.trim()) {
      navigateToSearchPage(query.trim())
    }
  }

  const handleResultSelect = (url) => {
    if (!url) return
    goToUrl(url)
  }

  const handleKeyDown = (event) => {
    if (!results.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => {
        const nextIndex = prev + 1
        return nextIndex >= results.length ? results.length - 1 : nextIndex
      })
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => {
        const nextIndex = prev - 1
        return nextIndex < 0 ? -1 : nextIndex
      })
      return
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      const selected = results[activeIndex]
      if (selected) {
        handleResultSelect(selected.url)
      }
    }

    if (event.key === 'Escape') {
      setIsInputFocused(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsInputFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? 'Loading search…' : 'Search documentation…'}
          className="w-full px-3 py-2 pr-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-label="Search the site"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Submit search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {error && (
        <p className="absolute left-0 right-0 mt-2 text-xs text-red-400 bg-gray-900 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {isInputFocused && query.trim() && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 shadow-lg"
        >
          {results.map((result, index) => (
            <li key={result.id} role="option" aria-selected={activeIndex === index}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleResultSelect(result.url)}
                className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors ${
                  activeIndex === index ? 'bg-blue-600/20 text-white' : 'hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-semibold text-white">{result.title}</span>
                {result.description ? (
                  <span className="text-xs text-gray-400 overflow-hidden text-ellipsis">
                    {result.description}
                  </span>
                ) : null}
                <span className="text-xs text-blue-400">{result.url}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
