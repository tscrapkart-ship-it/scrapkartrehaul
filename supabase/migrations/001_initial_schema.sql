-- ScrapKart V1 Complete Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('recycler', 'waste_producer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. COMPANIES TABLE
-- ============================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry_type TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Sellers can CRUD their own company
CREATE POLICY "Sellers can insert own company"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Sellers can update own company"
  ON public.companies FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Sellers can delete own company"
  ON public.companies FOR DELETE
  USING (auth.uid() = owner_id);

-- Everyone authenticated can view companies
CREATE POLICY "Authenticated users can view companies"
  ON public.companies FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 3. SCRAPS TABLE
-- ============================================
CREATE TABLE public.scraps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Metal', 'E-waste', 'Plastic', 'Paper', 'Glass', 'Mixed Scrap')),
  quantity DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'collected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scraps ENABLE ROW LEVEL SECURITY;

-- Sellers can CRUD their own scraps
CREATE POLICY "Sellers can insert own scraps"
  ON public.scraps FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own scraps"
  ON public.scraps FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own scraps"
  ON public.scraps FOR DELETE
  USING (auth.uid() = seller_id);

-- All authenticated users can view available scraps
CREATE POLICY "Authenticated users can view scraps"
  ON public.scraps FOR SELECT
  USING (auth.role() = 'authenticated');

-- Indexes for marketplace queries
CREATE INDEX idx_scraps_status ON public.scraps(status);
CREATE INDEX idx_scraps_category ON public.scraps(category);
CREATE INDEX idx_scraps_created_at ON public.scraps(created_at DESC);
CREATE INDEX idx_scraps_seller ON public.scraps(seller_id);

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scrap_id UUID NOT NULL REFERENCES public.scraps(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'collected', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Only buyer can create bookings (as buyer)
CREATE POLICY "Buyers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Both parties can view their bookings
CREATE POLICY "Participants can view bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Both parties can update booking status
CREATE POLICY "Participants can update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================
-- 5. MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages: only booking participants can read/write
CREATE POLICY "Booking participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND (b.buyer_id = auth.uid() OR b.seller_id = auth.uid())
    )
  );

CREATE POLICY "Booking participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND (b.buyer_id = auth.uid() OR b.seller_id = auth.uid())
    )
  );

-- Receiver can update read_status
CREATE POLICY "Receiver can update read status"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

CREATE INDEX idx_messages_booking ON public.messages(booking_id, created_at);

-- ============================================
-- 6. STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage or via SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('scrap-images', 'scrap-images', true);

-- Storage policies: authenticated users can upload to their own path
CREATE POLICY "Authenticated users can upload company logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view company logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload scrap images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'scrap-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view scrap images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'scrap-images');

-- ============================================
-- 7. ENABLE REALTIME ON MESSAGES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- 8. FOREIGN KEY LOOKUPS (for joined queries)
-- ============================================
-- These are used by Supabase client .select() with joins
-- bookings_buyer_id_fkey and bookings_seller_id_fkey are auto-created
-- but we need explicit names for the client to reference them

-- Verify foreign keys exist (they should from the CREATE TABLE):
-- bookings.buyer_id -> users.id
-- bookings.seller_id -> users.id
-- bookings.scrap_id -> scraps.id
-- messages.booking_id -> bookings.id
