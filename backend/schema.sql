-- SovereignShield - Database Schema
-- Supabase PostgreSQL Execution Script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Citizens Table
CREATE TABLE IF NOT EXISTS public.citizens (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Service Requests
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Requested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    data_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Blockchain Records
CREATE TABLE IF NOT EXISTS public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Threat Logs
CREATE TABLE IF NOT EXISTS public.threat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    user_id UUID REFERENCES public.citizens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Biometric Profiles
CREATE TABLE IF NOT EXISTS public.biometric_profiles (
    citizen_id UUID PRIMARY KEY REFERENCES public.citizens(id) ON DELETE CASCADE,
    face_embedding TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Trusted Devices
CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    metadata JSONB,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS Policies
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

-- Citizens Policy
DROP POLICY IF EXISTS "Citizens can view their own profile" ON public.citizens;
CREATE POLICY "Citizens can view their own profile" ON public.citizens FOR SELECT
    USING (auth.uid() = id);

-- Service Requests Policy
DROP POLICY IF EXISTS "Citizens can insert requests" ON public.service_requests;
CREATE POLICY "Citizens can insert requests" ON public.service_requests FOR INSERT
    WITH CHECK (auth.uid() = citizen_id);
    
DROP POLICY IF EXISTS "Citizens can view their own requests" ON public.service_requests;
CREATE POLICY "Citizens can view their own requests" ON public.service_requests FOR SELECT
    USING (auth.uid() = citizen_id);

-- Certificates Policy
DROP POLICY IF EXISTS "Citizens can view their own certificates" ON public.certificates;
CREATE POLICY "Citizens can view their own certificates" ON public.certificates FOR SELECT
    USING (auth.uid() = citizen_id);

-- Blockchain Records
DROP POLICY IF EXISTS "Anyone can verify blockchain records" ON public.blockchain_records;
CREATE POLICY "Anyone can verify blockchain records" ON public.blockchain_records FOR SELECT
    USING (true);

-- Audit Logs
DROP POLICY IF EXISTS "Citizens can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Citizens can view their own audit logs" ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR SELECT
    USING ( (SELECT role FROM public.citizens WHERE id = auth.uid()) = 'admin' );

-- Threat Logs
DROP POLICY IF EXISTS "Admins can view threat logs" ON public.threat_logs;
CREATE POLICY "Admins can view threat logs" ON public.threat_logs FOR SELECT
    USING ( (SELECT role FROM public.citizens WHERE id = auth.uid()) = 'admin' );

-- Global Admin Override
DROP POLICY IF EXISTS "Admins bypass RLS on services" ON public.service_requests;
CREATE POLICY "Admins bypass RLS on services" ON public.service_requests FOR ALL
    USING ( (SELECT role FROM public.citizens WHERE id = auth.uid()) = 'admin' );

DROP POLICY IF EXISTS "Admins bypass RLS on citizens" ON public.citizens;
CREATE POLICY "Admins bypass RLS on citizens" ON public.citizens FOR SELECT
    USING ( (SELECT role FROM public.citizens WHERE id = auth.uid()) = 'admin' );

-- Biometric Profiles Policy
DROP POLICY IF EXISTS "Citizens can manage their own biometrics" ON public.biometric_profiles;
CREATE POLICY "Citizens can manage their own biometrics" ON public.biometric_profiles FOR ALL
    USING (auth.uid() = citizen_id);

-- Trusted Devices Policy
DROP POLICY IF EXISTS "Citizens can manage their own devices" ON public.trusted_devices;
CREATE POLICY "Citizens can manage their own devices" ON public.trusted_devices FOR ALL
    USING (auth.uid() = citizen_id);
