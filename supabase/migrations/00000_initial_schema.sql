-- Core Tables for VotingForMe Platform

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'poll_creator');
CREATE TYPE poll_status AS ENUM ('draft', 'active', 'voting_open', 'closed', 'published');
CREATE TYPE entity_type AS ENUM ('poll', 'user', 'credit', 'vote');

-- 1. Users Table (Extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role DEFAULT 'poll_creator',
  credits INTEGER DEFAULT 5,
  is_premium BOOLEAN DEFAULT false,
  organization_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Polls Table
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status poll_status DEFAULT 'draft',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  credits_consumed INTEGER DEFAULT 0,
  auto_publish_results BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Candidates Table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0
);

-- 4. Voters Table
CREATE TABLE public.voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  token UUID UNIQUE DEFAULT gen_random_uuid(),
  has_voted BOOLEAN DEFAULT false,
  voted_at TIMESTAMPTZ,
  voted_for UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
  email_sent BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  UNIQUE(poll_id, email)
);

-- 5. Credit Transactions Table
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  performed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Activity Log Table
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Basic Policies (can be refined later)
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Creators can view own polls" 
ON public.polls FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own polls" 
ON public.polls FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own polls" 
ON public.polls FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can view candidates for a poll"
ON public.candidates FOR SELECT USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_polls_modtime
BEFORE UPDATE ON public.polls FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
