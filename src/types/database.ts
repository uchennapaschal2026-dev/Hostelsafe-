// Database Types for HostelSafe

export type UserRole = 'student' | 'manager' | 'inspector' | 'admin';

export type ReportCategory =
  | 'wall_ceiling_cracks'
  | 'damaged_stairs_balconies'
  | 'exposed_electrical_wiring'
  | 'roof_damage_leaks'
  | 'visible_steel_corrosion'
  | 'poor_drainage_sanitation'
  | 'blocked_emergency_exits'
  | 'fire_safety_concerns'
  | 'other_structural_defects';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical_hazard';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Inspection Requested'
  | 'Action Required'
  | 'Repair in Progress'
  | 'Resolved'
  | 'Closed';

export type VerificationStatus = 'unverified' | 'manager_verified' | 'independently_inspected';

export type AvailabilityStatus = 'available' | 'few_rooms_left' | 'full';

export type StructuralRiskLevel =
  | 'safe_standard'
  | 'minor_repairs_needed'
  | 'moderate_risk'
  | 'severe_immediate_hazard';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  credentials_info?: string;
  is_verified_inspector?: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Hostel {
  id: string;
  manager_id: string;
  manager_name?: string;
  name: string;
  description: string;
  location: string; // e.g. "First Gate, Ifite, Awka"
  university: string;
  address: string;
  latitude: number;
  longitude: number;
  rent_amount: number;
  rent_period: 'per year' | 'per semester';
  room_type: string; // "Self-contain", "Single Room", "2-Bedroom Flat"
  facilities: string[];
  availability_status: AvailabilityStatus;
  verification_status: VerificationStatus;
  contact_phone: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceReport {
  id: string;
  hostel_id: string;
  hostel_name?: string;
  reporter_id?: string;
  reporter_name?: string;
  category: ReportCategory;
  description: string;
  location_details?: string;
  severity: ReportSeverity;
  status: ReportStatus;
  is_anonymous: boolean;
  assigned_to?: string;
  assigned_technician_name?: string;
  target_date?: string;
  progress_notes?: string;
  photos: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Inspection {
  id: string;
  hostel_id: string;
  hostel_name?: string;
  inspector_id: string;
  inspector_name?: string;
  inspector_credentials?: string;
  report_id?: string;
  inspection_type:
    | 'structural_integrity'
    | 'electrical_safety'
    | 'fire_emergency_exit'
    | 'roof_ceiling_condition'
    | 'plumbing_sanitation'
    | 'comprehensive_building_audit';
  scheduled_at?: string;
  completed_at?: string;
  findings: string;
  recommendations: string;
  hazards_identified: string[];
  structural_risk_level: StructuralRiskLevel;
  report_storage_path?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTask {
  id: string;
  hostel_id: string;
  hostel_name?: string;
  report_id?: string;
  assigned_to?: string;
  technician_name: string;
  description: string;
  target_date: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  created_at: string;
}

export interface SavedHostel {
  id: string;
  student_id: string;
  hostel_id: string;
  hostel?: Hostel;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  link?: string;
  read_at?: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  hostel_id: string;
  hostel_name?: string;
  student_id?: string;
  student_name: string;
  student_phone: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}
