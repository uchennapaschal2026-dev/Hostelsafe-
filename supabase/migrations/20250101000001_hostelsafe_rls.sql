-- HostelSafe Row Level Security (RLS) Policies
-- Migration 02: Access Control & Authorization Security

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ----------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------
-- Anyone can view basic public profile info
CREATE POLICY "Public profiles are readable"
ON profiles FOR SELECT
USING (true);

-- Users can only insert/update their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update own profile (prevent self-elevation of role)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND (
    -- Cannot change role unless user is an admin
    role = (SELECT role FROM profiles WHERE id = auth.uid()) OR is_admin()
  )
);

-- Admin can manage all profiles
CREATE POLICY "Admins have full access to profiles"
ON profiles FOR ALL
USING (is_admin());

-- ----------------------------------------------------
-- HOSTELS POLICIES
-- ----------------------------------------------------
-- Public can browse all hostels
CREATE POLICY "Public can view hostels"
ON hostels FOR SELECT
USING (true);

-- Managers can create hostels
CREATE POLICY "Managers can insert their hostels"
ON hostels FOR INSERT
WITH CHECK (
  auth.uid() = manager_id AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

-- Managers can update only their own hostels
CREATE POLICY "Managers can update own hostels"
ON hostels FOR UPDATE
USING (
  auth.uid() = manager_id OR is_admin()
)
WITH CHECK (
  auth.uid() = manager_id OR is_admin()
);

-- Managers or Admin can delete their own hostels
CREATE POLICY "Managers can delete own hostels"
ON hostels FOR DELETE
USING (
  auth.uid() = manager_id OR is_admin()
);

-- ----------------------------------------------------
-- HOSTEL PHOTOS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can view hostel photos"
ON hostel_photos FOR SELECT
USING (true);

CREATE POLICY "Hostel managers can manage hostel photos"
ON hostel_photos FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM hostels
    WHERE hostels.id = hostel_photos.hostel_id
    AND (hostels.manager_id = auth.uid() OR is_admin())
  )
);

-- ----------------------------------------------------
-- MAINTENANCE REPORTS POLICIES
-- ----------------------------------------------------
-- Students can see their own reports.
-- Managers can see reports for the hostels they manage.
-- Inspectors can see reports assigned to them or requesting inspection.
-- Admins can view all reports.
CREATE POLICY "Authorized view of maintenance reports"
ON maintenance_reports FOR SELECT
USING (
  (reporter_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM hostels WHERE hostels.id = maintenance_reports.hostel_id AND hostels.manager_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('inspector', 'admin')))
);

-- Any authenticated user can submit a report
CREATE POLICY "Authenticated users can submit reports"
ON maintenance_reports FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (reporter_id IS NULL OR reporter_id = auth.uid())
);

-- Managers of that hostel, assigned inspectors, or admins can update status and notes
-- Notice: students CANNOT update report status after submission!
CREATE POLICY "Managers and inspectors can update assigned reports"
ON maintenance_reports FOR UPDATE
USING (
  (EXISTS (SELECT 1 FROM hostels WHERE hostels.id = maintenance_reports.hostel_id AND hostels.manager_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('inspector', 'admin')))
)
WITH CHECK (
  (EXISTS (SELECT 1 FROM hostels WHERE hostels.id = maintenance_reports.hostel_id AND hostels.manager_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('inspector', 'admin')))
);

-- ----------------------------------------------------
-- REPORT PHOTOS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Authorized users can view report photos"
ON report_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM maintenance_reports mr
    LEFT JOIN hostels h ON h.id = mr.hostel_id
    WHERE mr.id = report_photos.report_id
    AND (
      mr.reporter_id = auth.uid() OR
      h.manager_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('inspector', 'admin'))
    )
  )
);

CREATE POLICY "Report authors or managers can upload report photos"
ON report_photos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM maintenance_reports mr
    LEFT JOIN hostels h ON h.id = mr.hostel_id
    WHERE mr.id = report_photos.report_id
    AND (
      mr.reporter_id = auth.uid() OR
      h.manager_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('inspector', 'admin'))
    )
  )
);

-- ----------------------------------------------------
-- INSPECTIONS POLICIES
-- ----------------------------------------------------
-- Inspections can be viewed by the hostel manager, assigned inspector, and admins.
CREATE POLICY "Inspectors and managers can view inspections"
ON inspections FOR SELECT
USING (
  inspector_id = auth.uid() OR
  EXISTS (SELECT 1 FROM hostels WHERE hostels.id = inspections.hostel_id AND hostels.manager_id = auth.uid()) OR
  is_admin()
);

-- Only verified inspectors or admins can create or update inspections
CREATE POLICY "Only certified inspectors can create or update inspections"
ON inspections FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('inspector', 'admin') AND (is_verified_inspector = TRUE OR role = 'admin'))
);

CREATE POLICY "Assigned inspector or admin can update findings"
ON inspections FOR UPDATE
USING (
  inspector_id = auth.uid() OR is_admin()
)
WITH CHECK (
  inspector_id = auth.uid() OR is_admin()
);

-- ----------------------------------------------------
-- MAINTENANCE TASKS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Managers and admins can view and manage tasks"
ON maintenance_tasks FOR ALL
USING (
  EXISTS (SELECT 1 FROM hostels WHERE hostels.id = maintenance_tasks.hostel_id AND hostels.manager_id = auth.uid()) OR
  is_admin()
);

-- ----------------------------------------------------
-- SAVED HOSTELS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Students manage own saved hostels"
ON saved_hostels FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- ----------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Users access own notifications"
ON notifications FOR ALL
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- ----------------------------------------------------
-- ENQUIRIES POLICIES
-- ----------------------------------------------------
CREATE POLICY "Enquiries visibility"
ON enquiries FOR SELECT
USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM hostels WHERE hostels.id = enquiries.hostel_id AND hostels.manager_id = auth.uid()) OR
  is_admin()
);

CREATE POLICY "Students can send enquiries"
ON enquiries FOR INSERT
WITH CHECK (
  student_id = auth.uid() OR student_id IS NULL
);

CREATE POLICY "Hostel managers can update enquiry status"
ON enquiries FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM hostels WHERE hostels.id = enquiries.hostel_id AND hostels.manager_id = auth.uid()) OR
  is_admin()
);

-- ----------------------------------------------------
-- AUDIT LOGS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
USING (is_admin());

CREATE POLICY "System can append audit logs"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
