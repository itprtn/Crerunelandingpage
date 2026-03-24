-- Add RLS policy to allow anonymous users to insert leads
-- This is needed for the public landing page form

-- Enable RLS on leads table (if not already enabled)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous lead insertion" ON public.leads;

-- Create policy to allow anyone to insert leads (for the public form)
CREATE POLICY "Allow anonymous lead insertion" ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Also add a policy to allow authenticated admins to read all leads
DROP POLICY IF EXISTS "Admins can read all leads" ON public.leads;
CREATE POLICY "Admins can read all leads" ON public.leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );

-- Allow admins to update leads
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );

-- Allow admins to delete leads
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );

-- Also add RLS for site_settings - allow anyone to read
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT
  USING (true);

-- Only admins can update site settings
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );
