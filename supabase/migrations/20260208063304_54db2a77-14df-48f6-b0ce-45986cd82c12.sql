-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe) - public signup
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- No select/update/delete for regular users - admin only via dashboard
-- This protects subscriber privacy

-- Create storage bucket for whitepapers
INSERT INTO storage.buckets (id, name, public)
VALUES ('whitepapers', 'whitepapers', true);

-- Allow public read access to whitepapers
CREATE POLICY "Public can view whitepapers"
ON storage.objects
FOR SELECT
USING (bucket_id = 'whitepapers');