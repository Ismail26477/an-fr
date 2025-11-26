-- Create movie_watchlist table for tracking user's movie lists
CREATE TABLE IF NOT EXISTS public.movie_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id uuid NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  status text DEFAULT 'plan-to-watch',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

ALTER TABLE public.movie_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for movie_watchlist
CREATE POLICY "Users can view own movie watchlist"
  ON public.movie_watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to movie watchlist"
  ON public.movie_watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own movie watchlist"
  ON public.movie_watchlist FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from movie watchlist"
  ON public.movie_watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_movie_watchlist_user_id ON public.movie_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_watchlist_movie_id ON public.movie_watchlist(movie_id);
