"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

export const useWatchlist = (animeId?: string, movieId?: string) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [watchlistStatus, setWatchlistStatus] = useState<string>("plan-to-watch")

  // Determine which table and ID to use
  const isAnime = !!animeId && !movieId
  const table = isAnime ? "anime_watchlist" : "movie_watchlist"
  const contentId = animeId || movieId

  // Check if item is in watchlist on mount
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user || !contentId) {
        setIsInWatchlist(false)
        return
      }

      try {
        const idColumn = isAnime ? "anime_id" : "movie_id"
        console.log("[v0] Checking watchlist:", { userId: user.id, contentId, table, idColumn })

        const { data, error } = await supabase
          .from(table)
          .select("id, status")
          .eq("user_id", user.id)
          .eq(idColumn, contentId)
          .single()

        if (error) {
          // PGRST116 means no rows found, which is expected
          if (error.code !== "PGRST116") {
            console.error("[v0] Error checking watchlist:", error)
          }
          setIsInWatchlist(false)
          setWatchlistStatus("plan-to-watch")
        } else if (data) {
          console.log("[v0] Item found in watchlist:", data)
          setIsInWatchlist(true)
          setWatchlistStatus(data.status || "plan-to-watch")
        }
      } catch (err) {
        console.error("[v0] Exception checking watchlist:", err)
      }
    }

    checkWatchlist()
  }, [user, contentId, isAnime, table])

  const toggleWatchlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please login to add items to your watchlist",
        variant: "destructive",
      })
      return false
    }

    if (!contentId) return false

    setIsLoading(true)

    try {
      const idColumn = isAnime ? "anime_id" : "movie_id"
      console.log("[v0] Toggle watchlist:", {
        userId: user.id,
        contentId,
        table,
        isRemoving: isInWatchlist,
      })

      if (isInWatchlist) {
        const { error } = await supabase.from(table).delete().eq("user_id", user.id).eq(idColumn, contentId)

        if (error) {
          console.error("[v0] Delete error:", error)
          throw error
        }

        setIsInWatchlist(false)
        toast({
          title: "Removed from watchlist",
          description: "Item has been removed from your list",
        })
      } else {
        const { error } = await supabase.from(table).insert({
          user_id: user.id,
          [idColumn]: contentId,
          status: "plan-to-watch",
        })

        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }

        setIsInWatchlist(true)
        setWatchlistStatus("plan-to-watch")
        toast({
          title: "Added to watchlist",
          description: "Item has been added to your list",
        })
      }
    } catch (error) {
      console.error("[v0] Error toggling watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    } finally {
      setIsLoading(false)
    }

    return true
  }

  return {
    isInWatchlist,
    isLoading,
    watchlistStatus,
    toggleWatchlist,
  }
}
