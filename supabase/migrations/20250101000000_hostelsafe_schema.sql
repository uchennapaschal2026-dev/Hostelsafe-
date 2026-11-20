-- HostelSafe PostgreSQL Database Schema
-- Migration 01: Core Tables & Indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles: 'student', 'manager', 'inspector', 'admin'
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'manager', 'inspector', 'admin')),
    phone TEXT,
    organization TEXT,
    credentials_info TEXT,
    is_verified_inspector BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostels Table
CREATE TABLE IF NOT EXISTS hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL, -- e.g., 'Ifite, Awka'
    university TEXT NOT NULL DEFAULT 'Nnamdi Azikiwe University (UNIZIK)',
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rent_amount NUMERIC NOT NULL CHECK (rent_amount > 0),
    rent_period TEXT NOT NULL CHECK (rent_period IN ('per year', 'per semester')),
    room_type TEXT NOT NULL, -- 'Self-contain', 'Single Room', 'Two-bedroom Flat', etc.
    facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'few_rooms_left', 'full')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'manager_verified', 'independently_inspected')),
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostel Photos Table
CREATE TABLE IF NOT EXISTS hostel_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Reports Table (Building Safety & Hazard Tracking)
CREATE TABLE IF NOT EXISTS maintenance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN (
        'wall_ceiling_cracks',
        'damaged_stairs_balconies',
        'exposed_electrical_wiring',
        'roof_damage_leaks',
        'visible_steel_corrosion',
        'poor_drainage_sanitation',
        'blocked_emergency_exits',
        'fire_safety_concerns',
        'other_structural_defects'
    )),
    description TEXT NOT NULL,
    location_details TEXT, -- e.g., 'Block B, 2nd floor staircase'
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical_hazard')),
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN (
        'Submitted',
        'Under Review',
        'Inspection Requested',
        'Action Required',
        'Repair in Progress',
        'Resolved',
        'Closed'
    )),
    is_anonymous BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_technician_name TEXT,
    target_date DATE,
    progress_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Report Evidence Photos
CREATE TABLE IF NOT EXISTS report_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    photo_type TEXT NOT NULL DEFAULT 'defect' CHECK (photo_type IN ('defect', 'before', 'after')),
    caption TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections Table (Authorized Building Inspectors)
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    report_id UUID REFERENCES maintenance_reports(id) ON DELETE SET NULL,
    inspection_type TEXT NOT NULL CHECK (inspection_type IN (
        'structural_integrity',
        'electrical_safety',
        'fire_emergency_exit',
        'roof_ceiling_condition',
        'plumbing_sanitation',
        'comprehensive_building_audit'
    )),
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    findings TEXT,
    recommendations TEXT,
    hazards_identified TEXT[],
    structural_risk_level TEXT CHECK (structural_risk_level IN ('safe_standard', 'minor_repairs_needed', 'moderate_risk', 'severe_immediate_hazard')),
    report_storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Tasks Table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    report_id UUID REFERENCES maintenance_reports(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    technician_name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Hostels Table (Student Bookmarks)
CREATE TABLE IF NOT EXISTS saved_hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, hostel_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostel Inquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hostels_manager ON hostels(manager_id);
CREATE INDEX IF NOT EXISTS idx_hostels_location ON hostels(location);
CREATE INDEX IF NOT EXISTS idx_hostels_rent ON hostels(rent_amount);
CREATE INDEX IF NOT EXISTS idx_reports_hostel ON maintenance_reports(hostel_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON maintenance_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON maintenance_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_inspections_hostel ON inspections(hostel_id);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX IF NOT EXISTS idx_tasks_hostel ON maintenance_tasks(hostel_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
