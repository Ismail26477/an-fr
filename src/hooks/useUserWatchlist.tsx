"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "./useAuth"

interface WatchlistItem {
  id: string
  title: string
  image: string
  type: "anime" | "movie"
  rating?: number
  release_year?: number
  status?: string
  watchlist_status?: string
  added_at: string
}

export const useUserWatchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWatchlist = async () => {
    if (!user) {
      setWatchlist([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: animeWatchlist, error: animeError } = await supabase
        .from("anime_watchlist")
        .select(
          `
          id,
          anime_id,
          status,
          added_at,
          anime:anime_id(id, title, thumbnail_url, rating, release_year, status)
        `,
        )
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })

      if (animeError) throw new Error(`Anime watchlist error: ${animeError.message}`)

      const { data: movieWatchlist, error: movieError } = await supabase
        .from("movie_watchlist")
        .select(
          `
          id,
          movie_id,
          status,
          added_at,
          movie:movie_id(id, title, thumbnail_url, rating, release_year, status)
        `,
        )
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })

      if (movieError) throw new Error(`Movie watchlist error: ${movieError.message}`)

      const combinedWatchlist: WatchlistItem[] = [
        ...(animeWatchlist || []).map((item: any) => ({
          id: item.id,
          title: item.anime?.title || "Unknown Anime",
          image: item.anime?.thumbnail_url || "/placeholder.svg",
          type: "anime" as const,
          rating: item.anime?.rating,
          release_year: item.anime?.release_year,
          status: item.anime?.status,
          watchlist_status: item.status,
          added_at: item.added_at,
        })),
        ...(movieWatchlist || []).map((item: any) => ({
          id: item.id,
          title: item.movie?.title || "Unknown Movie",
          image: item.movie?.thumbnail_url || "/placeholder.svg",
          type: "movie" as const,
          rating: item.movie?.rating,
          release_year: item.movie?.release_year,
          status: item.movie?.status,
          watchlist_status: item.status,
          added_at: item.added_at,
        })),
      ]

      setWatchlist(combinedWatchlist)
    } catch (err) {
      console.error("[v0] Watchlist fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to load watchlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [user])

  const removeFromWatchlist = async (watchlistId: string, type: "anime" | "movie") => {
    try {
      const table = type === "anime" ? "anime_watchlist" : "movie_watchlist"
      const { error } = await supabase.from(table).delete().eq("id", watchlistId)

      if (error) throw error

      setWatchlist((prev) => prev.filter((item) => item.id !== watchlistId))
    } catch (err) {
      console.error("[v0] Remove watchlist error:", err)
      throw err
    }
  }

  return {
    watchlist,
    loading,
    error,
    refetch: fetchWatchlist,
    removeFromWatchlist,
  }
}
