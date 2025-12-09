-- Table to track deep work blocks completed
CREATE TABLE IF NOT EXISTS public.deep_work_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wager_id uuid NOT NULL REFERENCES public.wagers(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    block_number integer NOT NULL,
    completed_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    duration_seconds integer NOT NULL DEFAULT 5400, -- 90 minutes default
    task_title text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS deep_work_blocks_user_id_idx ON public.deep_work_blocks(user_id);
CREATE INDEX IF NOT EXISTS deep_work_blocks_wager_id_idx ON public.deep_work_blocks(wager_id);
CREATE INDEX IF NOT EXISTS deep_work_blocks_completed_at_idx ON public.deep_work_blocks(completed_at);

ALTER TABLE public.deep_work_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own deep work blocks" ON public.deep_work_blocks;
CREATE POLICY "Users can view own deep work blocks" ON public.deep_work_blocks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own deep work blocks" ON public.deep_work_blocks;
CREATE POLICY "Users can insert own deep work blocks" ON public.deep_work_blocks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table to track session volatility data
CREATE TABLE IF NOT EXISTS public.session_volatility (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wager_id uuid NOT NULL REFERENCES public.wagers(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    time_label text NOT NULL, -- e.g., "5m", "10m", "1h"
    value numeric(10,2) NOT NULL,
    event_type text, -- 'task', 'deepwork', 'cancel', null
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS session_volatility_user_id_idx ON public.session_volatility(user_id);
CREATE INDEX IF NOT EXISTS session_volatility_wager_id_idx ON public.session_volatility(wager_id);
CREATE INDEX IF NOT EXISTS session_volatility_created_at_idx ON public.session_volatility(created_at);

ALTER TABLE public.session_volatility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own session volatility" ON public.session_volatility;
CREATE POLICY "Users can view own session volatility" ON public.session_volatility
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own session volatility" ON public.session_volatility;
CREATE POLICY "Users can insert own session volatility" ON public.session_volatility
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add columns to wagers table to track session metadata
ALTER TABLE public.wagers
ADD COLUMN IF NOT EXISTS volatility_data jsonb,
ADD COLUMN IF NOT EXISTS final_volatility numeric(10,2),
ADD COLUMN IF NOT EXISTS deep_work_blocks_completed integer DEFAULT 0;

-- Function to increment deep work blocks count
CREATE OR REPLACE FUNCTION public.increment_deep_work_blocks(wager_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.wagers
  SET deep_work_blocks_completed = COALESCE(deep_work_blocks_completed, 0) + 1
  WHERE id = wager_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
