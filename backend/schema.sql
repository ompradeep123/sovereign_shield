-- SovereignShield - Database Schema
-- Supabase PostgreSQL Execution Script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Citizens Table
CREATE TABLE public.citizens (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Service Requests
CREATE TABLE public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Requested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Certificates
CREATE TABLE public.certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    data_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Blockchain Records
CREATE TABLE public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Threat Logs
CREATE TABLE public.threat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    user_id UUID REFERENCES public.citizens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS Policies

ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Citizens Policy
CREATE POLICY "Citizens can view their own profile" ON public.citizens FOR SELECT
    USING (auth.uid() = id);

-- Service Requests Policy
CREATE POLICY "Citizens can insert requests" ON public.service_requests FOR INSERT
    WITH CHECK (auth.uid() = citizen_id);
    
CREATE POLICY "Citizens can view their own requests" ON public.service_requests FOR SELECT
    USING (auth.uid() = citizen_id);

-- Certificates Policy
CREATE POLICY "Citizens can view their own certificates" ON public.certificates FOR SELECT
    USING (auth.uid() = citizen_id);

-- Blockchain Records
CREATE POLICY "Anyone can verify blockchain records" ON public.blockchain_records FOR SELECT
    USING (true);

-- System generated logic can bypass via service_role. 
-- For administrators, we can create a secondary check on the role metadata.
CREATE POLICY "Admins bypass RLS" ON public.service_requests FOR ALL
    USING ( (SELECT role FROM public.citizens WHERE id = auth.uid()) = 'admin' );
