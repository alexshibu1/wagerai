ALTER TABLE public.wagers
ADD COLUMN IF NOT EXISTS linked_year_wager_id uuid REFERENCES public.wagers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS health_percentage integer DEFAULT 100 CHECK (health_percentage >= 0 AND health_percentage <= 100),
ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS wagers_linked_year_wager_id_idx ON public.wagers(linked_year_wager_id);
CREATE INDEX IF NOT EXISTS wagers_last_activity_idx ON public.wagers(last_activity_at);

CREATE OR REPLACE FUNCTION public.update_health_on_daily_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'WON' AND NEW.asset_class = 'TDAY' AND NEW.linked_year_wager_id IS NOT NULL THEN
    UPDATE public.wagers
    SET 
      health_percentage = LEAST(100, COALESCE(health_percentage, 100) + 10),
      last_activity_at = timezone('utc'::text, now())
    WHERE id = NEW.linked_year_wager_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_wager_completed_update_health ON public.wagers;
CREATE TRIGGER on_wager_completed_update_health
  AFTER UPDATE ON public.wagers
  FOR EACH ROW
  WHEN (OLD.status = 'OPEN' AND NEW.status = 'WON')
  EXECUTE FUNCTION public.update_health_on_daily_complete();

CREATE OR REPLACE FUNCTION public.decay_health_bars()
RETURNS void AS $$
BEGIN
  UPDATE public.wagers
  SET health_percentage = GREATEST(0, health_percentage - 5)
  WHERE 
    asset_class = 'YEAR' 
    AND status = 'OPEN' 
    AND last_activity_at < timezone('utc'::text, now()) - interval '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
