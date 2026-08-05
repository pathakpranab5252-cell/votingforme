-- Core Tables for VotingForMe Platform

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'poll_creator');
CREATE TYPE poll_status AS ENUM ('draft', 'active', 'voting_open', 'closed', 'published');
CREATE TYPE voting_type AS ENUM ('single_choice', 'multi_select_unordered', 'multi_select_ordered');
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
  voting_type voting_type DEFAULT 'single_choice',
  max_selections INTEGER DEFAULT 1,
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
  voted_for_selections JSONB DEFAULT '[]'::jsonb,
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

-- Policies for public.users
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

-- Policies for public.polls
CREATE POLICY "Creators can view own polls" 
ON public.polls FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own polls" 
ON public.polls FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own polls" 
ON public.polls FOR UPDATE USING (auth.uid() = creator_id);

-- Policies for public.candidates
CREATE POLICY "Anyone can view candidates for a poll"
ON public.candidates FOR SELECT USING (true);

CREATE POLICY "Creators can manage candidates"
ON public.candidates FOR ALL USING (true);

-- Policies for public.voters
CREATE POLICY "Anyone can view ballot by token"
ON public.voters FOR SELECT USING (true);

CREATE POLICY "Voters can record their vote"
ON public.voters FOR UPDATE USING (true);

-- Automatic User Profile Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, organization_name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'organization_name',
    5,
    'poll_creator'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
