CREATE TABLE IF NOT EXISTS public.wagers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    asset_class text NOT NULL CHECK (asset_class IN ('TDAY', 'SHIP', 'YEAR')),
    stake_amount integer NOT NULL,
    status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'WON', 'LOST')),
    deadline timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at timestamp with time zone,
    pnl_percentage integer
);

CREATE INDEX IF NOT EXISTS wagers_user_id_idx ON public.wagers(user_id);
CREATE INDEX IF NOT EXISTS wagers_status_idx ON public.wagers(status);
CREATE INDEX IF NOT EXISTS wagers_created_at_idx ON public.wagers(created_at);

ALTER TABLE public.wagers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wagers" ON public.wagers;
CREATE POLICY "Users can view own wagers" ON public.wagers
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own wagers" ON public.wagers;
CREATE POLICY "Users can insert own wagers" ON public.wagers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own wagers" ON public.wagers;
CREATE POLICY "Users can update own wagers" ON public.wagers
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own wagers" ON public.wagers;
CREATE POLICY "Users can delete own wagers" ON public.wagers
    FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_score integer NOT NULL DEFAULT 10000,
    win_rate numeric(5,2) NOT NULL DEFAULT 0.00,
    total_wagers integer NOT NULL DEFAULT 0,
    total_wins integer NOT NULL DEFAULT 0,
    total_losses integer NOT NULL DEFAULT 0,
    current_streak integer NOT NULL DEFAULT 0,
    longest_streak integer NOT NULL DEFAULT 0,
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created_init_stats ON auth.users;
CREATE TRIGGER on_user_created_init_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_stats();
