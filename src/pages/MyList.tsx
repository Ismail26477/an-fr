"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, ChevronLeft } from "lucide-react"
import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { useUserWatchlist } from "@/hooks/useUserWatchlist"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

const MyListPage = () => {
  const { user } = useAuth()
  const { watchlist, loading, error, removeFromWatchlist } = useUserWatchlist()
  const { toast } = useToast()
  const [filterType, setFilterType] = useState<"all" | "anime" | "movie">("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filtered = watchlist.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false
    if (filterStatus !== "all" && item.watchlist_status !== filterStatus) return false
    return true
  })

  const handleRemove = async (watchlistId: string, type: "anime" | "movie", title: string) => {
    try {
      await removeFromWatchlist(watchlistId, type)
      toast({
        title: "Removed from My List",
        description: `${title} has been removed from your watchlist.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">My List</h1>
            <p className="text-muted-foreground mb-8">Please log in to view your watchlist</p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-4xl font-bold mb-2">My List</h1>
            <p className="text-muted-foreground">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "anime" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("anime")}
              >
                Anime
              </Button>
              <Button
                variant={filterType === "movie" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("movie")}
              >
                Movies
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Status
              </Button>
              <Button
                variant={filterStatus === "plan-to-watch" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("plan-to-watch")}
              >
                Plan to Watch
              </Button>
              <Button
                variant={filterStatus === "watching" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("watching")}
              >
                Watching
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="py-4 px-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 mb-6">
              <p>Error loading watchlist: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your watchlist...</p>
            </div>
          )}

          {/* Watchlist Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="group">
                  <Link
                    to={item.type === "anime" ? `/anime/${item.id.split("-")[0]}` : `/movie/${item.id.split("-")[0]}`}
                    className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-3 hover:scale-105 transition-transform duration-300 block"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        {item.rating && <p className="text-yellow-400 font-semibold mb-2">⭐ {item.rating}</p>}
                        <p className="text-xs text-gray-300 capitalize">{item.watchlist_status?.replace("-", " ")}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={
                            item.type === "anime"
                              ? `/anime/${item.id.split("-")[0]}`
                              : `/movie/${item.id.split("-")[0]}`
                          }
                          className="font-semibold text-sm md:text-base line-clamp-2 hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.type, item.title)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove from My List"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {item.release_year && <p className="text-xs text-muted-foreground">{item.release_year}</p>}
                      <p className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full capitalize">
                        {item.type}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground capitalize">
                      {item.watchlist_status?.replace("-", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && watchlist.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">Your watchlist is empty</p>
              <Link to="/anime">
                <Button>Browse Anime</Button>
              </Link>
            </div>
          )}

          {/* No Results State */}
          {!loading && filtered.length === 0 && watchlist.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No items match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyListPage
