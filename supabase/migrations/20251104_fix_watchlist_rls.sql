-- Fix RLS policies for watchlist and movie_watchlist tables
-- The issue was that the policies need to account for NULL profiles

-- Drop existing policies that might have issues
DROP POLICY IF EXISTS "Users can view own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can add to watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can update own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can remove from watchlist" ON public.watchlist;

DROP POLICY IF EXISTS "Users can view own movie watchlist" ON public.movie_watchlist;
DROP POLICY IF EXISTS "Users can add to movie watchlist" ON public.movie_watchlist;
DROP POLICY IF EXISTS "Users can update own movie watchlist" ON public.movie_watchlist;
DROP POLICY IF EXISTS "Users can remove from movie watchlist" ON public.movie_watchlist;

-- Recreate watchlist policies with proper auth handling
CREATE POLICY "Users can view own watchlist"
  ON public.watchlist FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to watchlist"
  ON public.watchlist FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own watchlist"
  ON public.watchlist FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can remove from watchlist"
  ON public.watchlist FOR DELETE
  USING (user_id = auth.uid());

-- Recreate movie_watchlist policies with proper auth handling
CREATE POLICY "Users can view own movie watchlist"
  ON public.movie_watchlist FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to movie watchlist"
  ON public.movie_watchlist FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own movie watchlist"
  ON public.movie_watchlist FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can remove from movie watchlist"
  ON public.movie_watchlist FOR DELETE
  USING (user_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_anime_id ON public.watchlist(anime_id);
CREATE INDEX IF NOT EXISTS idx_movie_watchlist_user_id ON public.movie_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_watchlist_movie_id ON public.movie_watchlist(movie_id);

-- Function to ensure user profile exists before watchlist operations
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Check if user profile exists, if not create it
  INSERT INTO public.profiles (id)
  VALUES (NEW.user_id)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to ensure profile exists before inserting into watchlist
DROP TRIGGER IF EXISTS before_watchlist_insert ON public.watchlist;
CREATE TRIGGER before_watchlist_insert
  BEFORE INSERT ON public.watchlist
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_profile();

-- Trigger to ensure profile exists before inserting into movie_watchlist
DROP TRIGGER IF EXISTS before_movie_watchlist_insert ON public.movie_watchlist;
CREATE TRIGGER before_movie_watchlist_insert
  BEFORE INSERT ON public.movie_watchlist
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_profile();
