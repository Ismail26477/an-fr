"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"

interface Anime {
  id: string
  title: string
  description: string
  thumbnail_url?: string
}

interface SearchModalProps {
  onClose?: () => void
  onSearch?: (query: string) => void
}

export const SearchModal = ({ onClose, onSearch }: SearchModalProps) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setShowResults(true)
    const searchAnime = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("anime")
          .select("id, title, description, thumbnail_url")
          .ilike("title", `%${query}%`)
          .eq("is_archived", false)
          .limit(10)

        if (error) {
          console.error("[v0] Search error:", error)
          return
        }

        setResults(data || [])
      } catch (err) {
        console.error("[v0] Search exception:", err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchAnime, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/anime?search=${encodeURIComponent(query)}`)
      onSearch?.(query)
      setQuery("")
      setShowResults(false)
      onClose?.()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex-1 max-w-md mx-4 relative">
      {/* Search input */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg border border-white/30 hover:border-purple-500/50 focus-within:border-purple-500 transition-colors">
        <Search className="h-4 w-4 text-white/60" />
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery("")
              setShowResults(false)
            }}
            className="h-6 w-6 hover:bg-white/20 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          onClick={handleSearch}
          className="h-6 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors"
          disabled={!query.trim()}
        >
          Search
        </Button>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-white/20 text-white">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 rounded-lg shadow-lg border border-white/20 z-50">
          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="p-4 text-center text-sm text-white/60">Searching...</div>}

            {!loading && results.length === 0 && query && (
              <div className="p-4 text-center text-sm text-white/60">No anime found</div>
            )}

            {!loading && results.length > 0 && (
              <div>
                {results.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => {
                      navigate(`/anime/${anime.id}`)
                      setQuery("")
                      setShowResults(false)
                      onClose?.()
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/10 last:border-b-0"
                  >
                    {anime.thumbnail_url && (
                      <img
                        src={anime.thumbnail_url || "/placeholder.svg"}
                        alt={anime.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{anime.title}</div>
                      <div className="text-xs text-white/60 line-clamp-1">{anime.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
