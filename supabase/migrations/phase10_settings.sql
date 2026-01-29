-- Add Investment Focus and Notification Preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS investment_sectors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS investment_stages text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS investment_geo text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS min_check_size numeric,
ADD COLUMN IF NOT EXISTS max_check_size numeric,
ADD COLUMN IF NOT EXISTS investment_thesis text,
ADD COLUMN IF NOT EXISTS email_frequency text DEFAULT 'instant', -- instant, daily, weekly
ADD COLUMN IF NOT EXISTS digest_time time,
ADD COLUMN IF NOT EXISTS digest_day text, -- for weekly (e.g., 'Monday')
ADD COLUMN IF NOT EXISTS dnd_start_time time,
ADD COLUMN IF NOT EXISTS dnd_end_time time;

-- Create Alerts Table (if not exists)
CREATE TABLE IF NOT EXISTS public.alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL, -- deal_flow, portfolio, network, company
    name text, -- Name of the alert
    condition_text text NOT NULL, -- Human readable condition description
    condition_data jsonb DEFAULT '{}', -- Structured condition data
    channels text[] DEFAULT '{}', -- email, in_app, push
    is_active boolean DEFAULT true,
    last_triggered_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Ensure name column exists (in case table was created before name was added)
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS name text;

-- RLS Policies
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own alerts" ON public.alerts;
CREATE POLICY "Users can view their own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own alerts" ON public.alerts;
CREATE POLICY "Users can create their own alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON public.alerts;
CREATE POLICY "Users can update their own alerts" ON public.alerts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.alerts;
CREATE POLICY "Users can delete their own alerts" ON public.alerts
    FOR DELETE USING (auth.uid() = user_id);
