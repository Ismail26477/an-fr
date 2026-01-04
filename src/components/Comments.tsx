"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  display_name: string | null
}

interface CommentsProps {
  animeId?: string
  movieId?: string
}

const Comments = ({ animeId, movieId }: CommentsProps) => {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const contentId = animeId || movieId
  const contentType = animeId ? "anime" : "movie"
  const filterColumn = contentType === "anime" ? "anime_id" : "movie_id"

  useEffect(() => {
    fetchComments()
  }, [contentId, user])

  const fetchComments = async () => {
    try {
      if (!contentId) return

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id, display_name")
        .eq(filterColumn, contentId)
        .order("created_at", { ascending: false })

      if (commentsError) {
        return
      }

      if (!commentsData) {
        setComments([])
        return
      }

      setComments(commentsData as any)
    } catch (err) {
      // Silent error handling
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim() || !contentId) return

    setLoading(true)
    try {
      let displayName = "User"

      if (user.user_metadata?.full_name) {
        displayName = user.user_metadata.full_name
      } else if (user.user_metadata?.name) {
        displayName = user.user_metadata.name
      } else if (user.email) {
        displayName = user.email.split("@")[0]
      }

      const insertData: any = {
        user_id: user.id,
        content: newComment.trim(),
        display_name: displayName,
      }

      if (contentType === "anime") {
        insertData.anime_id = contentId
      } else {
        insertData.movie_id = contentId
      }

      const { data, error } = await supabase.from("comments").insert(insertData).select()

      if (error) {
        toast({
          title: "Error",
          description: `Failed to post comment: ${error.message}`,
          variant: "destructive",
        })
      } else {
        setNewComment("")
        fetchComments()
        toast({
          title: "Success",
          description: "Comment posted!",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId)

    if (!error) {
      fetchComments()
      toast({
        title: "Success",
        description: "Comment deleted",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-2xl font-bold">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground bg-foreground/5 border border-foreground/10 rounded p-3">
          Sign in to leave a comment
        </p>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{comment.display_name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {user?.id === comment.user_id && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}

export default Comments
