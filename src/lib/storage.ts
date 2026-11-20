import {
  Hostel,
  MaintenanceReport,
  Inspection,
  MaintenanceTask,
  Profile,
  NotificationItem,
  Enquiry,
  AuditLog,
} from '../types/database';

export const DEMO_PROFILES: Record<string, Profile> = {
  student: {
    id: 'u-student-01',
    full_name: 'Chidimma Okeke',
    email: 'chidimma.student@hostelsafe.ng',
    role: 'student',
    phone: '+234 814 233 8901',
    organization: 'UNIZIK Dept of Civil Engineering',
    created_at: '2025-01-15T10:00:00Z',
  },
  manager: {
    id: 'u-manager-01',
    full_name: 'Chief Emeka Nwankwo',
    email: 'emeka.nwankwo@hostelsafe.ng',
    role: 'manager',
    phone: '+234 803 456 7890',
    organization: 'Nwankwo Real Estate & Property Management, Awka',
    created_at: '2024-11-10T08:30:00Z',
  },
  inspector: {
    id: 'u-inspector-01',
    full_name: 'Engr. Babatunde Adeleke, MNSE, COREN',
    email: 'babatunde.adeleke@hostelsafe.ng',
    role: 'inspector',
    phone: '+234 802 334 9912',
    organization: 'Anambra State Building Safety Compliance Inspection Board',
    credentials_info: 'COREN Reg. R41892 | MNSE (Nigerian Society of Engineers)',
    is_verified_inspector: true,
    created_at: '2024-09-01T09:00:00Z',
  },
  admin: {
    id: 'u-admin-01',
    full_name: 'Paschal Uchenna (HostelSafe Lead)',
    email: 'paschal.admin@hostelsafe.ng',
    role: 'admin',
    phone: '+234 809 111 2233',
    organization: 'HostelSafe National Safety Oversight Unit',
    created_at: '2024-08-01T08:00:00Z',
  },
};

export const INITIAL_HOSTELS: Hostel[] = [
  {
    id: 'hostel-001',
    manager_id: 'u-manager-01',
    manager_name: 'Chief Emeka Nwankwo',
    name: 'Crown Villa Royal Lodge',
    description: 'Modern self-contain apartments located just 3 minutes walk from UNIZIK First Gate. Features 24/7 borehole clean water, dedicated transformer with pre-paid meter, solar powered hallway illumination, gated perimeter with day and night security guard, and well-paved premises.',
    location: 'First Gate, Ifite, Awka',
    university: 'Nnamdi Azikiwe University (UNIZIK)',
    address: '14 Chief Ekwueme Street, Off First Gate, Ifite-Awka, Anambra State',
    latitude: 6.2458,
    longitude: 7.1215,
    rent_amount: 320000,
    rent_period: 'per year',
    room_type: 'Self-contain',
    facilities: [
      'Borehole Clean Water (24/7)',
      'Dedicated Transformer & Prepaid Meter',
      'Solar Security Lighting',
      '24/7 Security Guard & Gate',
      'Tiled Ceramic Floors',
      'Water Heater in Restroom',
      'Personal Kitchenette & Sink',
      'Covered Soakaway & Drainage',
    ],
    availability_status: 'few_rooms_left',
    verification_status: 'manager_verified',
    contact_phone: '+234 803 456 7890',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    ],
    created_at: '2025-01-10T12:00:00Z',
    updated_at: '2025-02-01T09:00:00Z',
  },
  {
    id: 'hostel-002',
    manager_id: 'u-manager-01',
    manager_name: 'Chief Emeka Nwankwo',
    name: 'Peace Heights Student Lodge',
    description: 'Clean, secure single rooms with shared modern tiled restrooms (maximum 2 students per restroom). Located at Book Foundation junction. Regular water supply pumped twice daily with a soundproof standby generator for water pumping and exams night study.',
    location: 'Book Foundation, Ifite, Awka',
    university: 'Nnamdi Azikiwe University (UNIZIK)',
    address: '8 Seminary Road, Near Miracle Junction, Ifite-Awka, Anambra State',
    latitude: 6.2492,
    longitude: 7.1189,
    rent_amount: 180000,
    rent_period: 'per year',
    room_type: 'Single Room',
    facilities: [
      'Borehole Water (Twice Daily)',
      'Standby Generator',
      'Fenced Perimeter & Heavy Gate',
      'Modern Reinforced Drainage',
      'Reading Desks Provided',
      'Weekly Refuse Disposal Service',
    ],
    availability_status: 'available',
    verification_status: 'independently_inspected',
    contact_phone: '+234 803 456 7890',
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    ],
    created_at: '2025-01-12T14:30:00Z',
    updated_at: '2025-02-14T11:00:00Z',
  },
  {
    id: 'hostel-003',
    manager_id: 'u-manager-02',
    manager_name: 'Mrs. Ngozi Ebele',
    name: 'Grace Haven Executive Suites',
    description: 'Spacious 2-Bedroom flats ideal for 2 or 3 serious flatmates sharing expenses. Situated 400m from UNIZIK Second Gate. Installed pure-sine wave solar inverter system, POP ceilings, borehole overhead tank, and 24/7 security perimeter.',
    location: 'Second Gate, Ifite, Awka',
    university: 'Nnamdi Azikiwe University (UNIZIK)',
    address: '22 University Way, Behind UNIZIK Second Gate, Awka',
    latitude: 6.2520,
    longitude: 7.1250,
    rent_amount: 450000,
    rent_period: 'per year',
    room_type: 'Two-bedroom Flat',
    facilities: [
      'Borehole Clean Water',
      'Solar Inverter Backup System',
      'CCTV Perimeter Surveillance',
      'POP Suspended Ceilings',
      'Balcony Clothesline Rail',
      'Dedicated Car/Keke Parking',
    ],
    availability_status: 'available',
    verification_status: 'manager_verified',
    contact_phone: '+234 806 112 3344',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
    ],
    created_at: '2025-01-18T16:00:00Z',
    updated_at: '2025-02-18T10:00:00Z',
  },
  {
    id: 'hostel-004',
    manager_id: 'u-manager-02',
    manager_name: 'Mrs. Ngozi Ebele',
    name: 'St. Jude Scholars Lodge',
    description: 'Affordable self-contain units in a quiet study environment off the Aroma-Ifite link road. Features running borehole water, iron security doors, day caretaker on duty, and close proximity to public shuttles.',
    location: 'Temp Site / Aroma Link, Awka',
    university: 'Nnamdi Azikiwe University (UNIZIK)',
    address: '5 Okpuno Road, Near Aroma Junction, Awka',
    latitude: 6.2375,
    longitude: 7.0850,
    rent_amount: 240000,
    rent_period: 'per year',
    room_type: 'Self-contain',
    facilities: [
      'Borehole Water',
      'Prepaid Meter',
      'Day & Night Caretaker',
      'Reinforced Iron Security Doors',
      'Refuse Disposal Point',
    ],
    availability_status: 'few_rooms_left',
    verification_status: 'unverified',
    contact_phone: '+234 802 998 7766',
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80',
    ],
    created_at: '2025-01-22T08:15:00Z',
    updated_at: '2025-02-10T14:20:00Z',
  },
];

export const INITIAL_REPORTS: MaintenanceReport[] = [
  {
    id: 'rep-001',
    hostel_id: 'hostel-001',
    hostel_name: 'Crown Villa Royal Lodge',
    reporter_id: 'u-student-01',
    reporter_name: 'Chidimma Okeke',
    category: 'wall_ceiling_cracks',
    description: 'Noticeable diagonal crack widening across the exterior wall beside the Block B second floor staircase. Water seepage occurs during heavy rainstorms.',
    location_details: 'Block B, 2nd floor staircase landing, external wall',
    severity: 'high',
    status: 'Inspection Requested',
    is_anonymous: false,
    assigned_to: 'u-manager-01',
    assigned_technician_name: 'Engr. Babatunde Adeleke (Site Inspector)',
    target_date: '2025-03-05',
    progress_notes: 'Hostel manager Chief Emeka reviewed on Feb 20. Requested independent civil engineering inspection to assess whether crack is structural or plaster shrinkage.',
    photos: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    created_at: '2025-02-18T11:20:00Z',
    updated_at: '2025-02-21T15:00:00Z',
  },
  {
    id: 'rep-002',
    hostel_id: 'hostel-002',
    hostel_name: 'Peace Heights Student Lodge',
    reporter_id: 'u-student-01',
    reporter_name: 'Chidimma Okeke',
    category: 'damaged_stairs_balconies',
    description: 'Loose iron handrail anchor along the main staircase. Handrail wobbles when students lean on it, presenting a potential fall hazard.',
    location_details: 'Main central stairs between 1st and 2nd floor',
    severity: 'medium',
    status: 'Repair in Progress',
    is_anonymous: false,
    assigned_to: 'u-manager-01',
    assigned_technician_name: 'Okafor Metal Works Awka',
    target_date: '2025-03-02',
    progress_notes: 'Welder contracted to re-anchor base plates with heavy expansion bolts and anti-rust coating.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    ],
    created_at: '2025-02-22T09:40:00Z',
    updated_at: '2025-02-24T12:00:00Z',
  },
  {
    id: 'rep-003',
    hostel_id: 'hostel-001',
    hostel_name: 'Crown Villa Royal Lodge',
    reporter_id: 'u-student-02',
    reporter_name: 'Anonymous Student',
    category: 'exposed_electrical_wiring',
    description: 'Damaged conduit pipe near the ground floor borehole switch exposing live 220V wires near standing water puddle.',
    location_details: 'Pumping machine shed, rear compound',
    severity: 'critical_hazard',
    status: 'Resolved',
    is_anonymous: true,
    assigned_to: 'u-manager-01',
    assigned_technician_name: 'Master Godwin Electrician Awka',
    target_date: '2025-02-12',
    progress_notes: 'Urgent hazard resolved same-day. Replaced brittle cabling with weather-rated armored PVC conduit and installed an IP65 rated waterproof isolator switch.',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    ],
    created_at: '2025-02-10T14:10:00Z',
    updated_at: '2025-02-12T17:30:00Z',
    resolved_at: '2025-02-12T17:30:00Z',
  },
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-001',
    hostel_id: 'hostel-002',
    hostel_name: 'Peace Heights Student Lodge',
    inspector_id: 'u-inspector-01',
    inspector_name: 'Engr. Babatunde Adeleke, MNSE, COREN',
    inspector_credentials: 'COREN R41892 | MNSE Civil/Structural',
    report_id: 'rep-002',
    inspection_type: 'structural_integrity',
    scheduled_at: '2025-02-15T10:00:00Z',
    completed_at: '2025-02-16T14:00:00Z',
    findings: 'Visual audit of load-bearing columns, cantilever slabs, and staircase frames. No active foundation displacement or critical shear failure detected. Staircase balustrade anchors exhibited localized mechanical loosening from age, non-structural in nature.',
    recommendations: '1. Re-anchor staircase balustrades with galvanized steel anchors.\n2. Apply elastomeric sealant to exterior hair cracks along parapet wall to avoid moisture ingress.\n3. Re-inspect drainage retaining wall before peak rainy season (May).',
    hazards_identified: ['Staircase handrail anchor instability', 'Minor perimeter masonry weathering'],
    structural_risk_level: 'minor_repairs_needed',
    status: 'completed',
    created_at: '2025-02-14T08:00:00Z',
    updated_at: '2025-02-16T14:00:00Z',
  },
  {
    id: 'insp-002',
    hostel_id: 'hostel-001',
    hostel_name: 'Crown Villa Royal Lodge',
    inspector_id: 'u-inspector-01',
    inspector_name: 'Engr. Babatunde Adeleke, MNSE, COREN',
    inspector_credentials: 'COREN R41892 | MNSE Civil/Structural',
    report_id: 'rep-001',
    inspection_type: 'structural_integrity',
    scheduled_at: '2025-03-05T11:00:00Z',
    findings: 'Pending on-site visit to inspect Block B staircase diagonal crack with ultrasonic crack meter and plumb line.',
    recommendations: 'Hostel management has been advised to restrict student congregation along Block B exterior corridor until test is concluded.',
    hazards_identified: ['Exterior diagonal shear crack awaiting measurement'],
    structural_risk_level: 'moderate_risk',
    status: 'scheduled',
    created_at: '2025-02-21T15:30:00Z',
    updated_at: '2025-02-21T15:30:00Z',
  },
];

export const INITIAL_TASKS: MaintenanceTask[] = [
  {
    id: 'task-001',
    hostel_id: 'hostel-002',
    hostel_name: 'Peace Heights Student Lodge',
    report_id: 'rep-002',
    assigned_to: 'u-manager-01',
    technician_name: 'Okafor Metal Works Awka (+234 803 777 1212)',
    description: 'Weld and reinforce loose staircase balustrade anchors with M10 expansion bolts.',
    target_date: '2025-03-02',
    status: 'in_progress',
    created_at: '2025-02-23T10:00:00Z',
  },
  {
    id: 'task-002',
    hostel_id: 'hostel-001',
    hostel_name: 'Crown Villa Royal Lodge',
    report_id: 'rep-003',
    assigned_to: 'u-manager-01',
    technician_name: 'Master Godwin Electrician (+234 802 888 3434)',
    description: 'Isolate and replace damaged conduit cabling with armored weather-proof wires and IP65 isolator box.',
    target_date: '2025-02-12',
    completed_at: '2025-02-12T17:30:00Z',
    status: 'completed',
    created_at: '2025-02-10T15:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    recipient_id: 'u-student-01',
    title: 'Report Status Updated: Under Review',
    message: 'Your report regarding "Staircase loose handrail" at Peace Heights Student Lodge was reviewed by Manager Chief Emeka. Technician assigned.',
    link: '/dashboard/student',
    created_at: '2025-02-22T10:00:00Z',
  },
  {
    id: 'notif-002',
    recipient_id: 'u-student-01',
    title: 'Inspection Scheduled',
    message: 'A certified structural inspector has been scheduled for the Block B crack at Crown Villa Royal Lodge on March 5th.',
    link: '/dashboard/student',
    created_at: '2025-02-21T16:00:00Z',
  },
  {
    id: 'notif-003',
    recipient_id: 'u-manager-01',
    title: 'New Hazard Report Submitted',
    message: 'A student submitted a safety hazard report for Crown Villa: "Wall and ceiling crack on Block B staircase". Immediate review requested.',
    link: '/dashboard/manager',
    created_at: '2025-02-18T11:22:00Z',
  },
  {
    id: 'notif-004',
    recipient_id: 'u-inspector-01',
    title: 'New Inspection Request Assigned',
    message: 'You have been assigned to conduct a Structural Integrity Inspection at Crown Villa Royal Lodge, Ifite Awka.',
    link: '/dashboard/inspector',
    created_at: '2025-02-21T15:35:00Z',
  },
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-001',
    hostel_id: 'hostel-001',
    hostel_name: 'Crown Villa Royal Lodge',
    student_id: 'u-student-01',
    student_name: 'Chidimma Okeke',
    student_phone: '+234 814 233 8901',
    message: 'Good day sir, I am a 300 level engineering student at UNIZIK. Is the self-contain room on the first floor still vacant? Can I inspect it tomorrow afternoon?',
    status: 'contacted',
    created_at: '2025-02-20T14:15:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    actor_id: 'u-admin-01',
    actor_name: 'Paschal Uchenna (HostelSafe Lead)',
    action: 'VERIFIED_INSPECTOR_CREDENTIALS',
    entity_type: 'inspector_profile',
    entity_id: 'u-inspector-01',
    details: { council: 'COREN', reg_no: 'R41892', status: 'verified_active' },
    created_at: '2025-01-05T09:00:00Z',
  },
  {
    id: 'audit-002',
    actor_id: 'u-admin-01',
    actor_name: 'Paschal Uchenna (HostelSafe Lead)',
    action: 'APPROVED_HOSTEL_VERIFICATION',
    entity_type: 'hostel',
    entity_id: 'hostel-002',
    details: { reason: 'Passed independent structural baseline audit' },
    created_at: '2025-02-17T11:00:00Z',
  },
  {
    id: 'audit-003',
    actor_id: 'u-manager-01',
    actor_name: 'Chief Emeka Nwankwo',
    action: 'RESOLVED_CRITICAL_ELECTRICAL_DEFECT',
    entity_type: 'maintenance_report',
    entity_id: 'rep-003',
    details: { technician: 'Master Godwin Electrician Awka' },
    created_at: '2025-02-12T17:35:00Z',
  },
];

// LocalStorage helpers with automatic seeding
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`hostelsafe_${key}`);
    if (!raw) {
      localStorage.setItem(`hostelsafe_${key}`, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`hostelsafe_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

// Data Storage API
export const StorageService = {
  // Hostels
  getHostels(): Hostel[] {
    return getStored<Hostel[]>('hostels', INITIAL_HOSTELS);
  },
  getHostelById(id: string): Hostel | undefined {
    const list = this.getHostels();
    return list.find((h) => h.id === id);
  },
  saveHostel(hostel: Hostel): Hostel {
    const list = this.getHostels();
    const existingIndex = list.findIndex((h) => h.id === hostel.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...hostel, updated_at: new Date().toISOString() };
    } else {
      list.unshift(hostel);
    }
    setStored('hostels', list);
    return hostel;
  },
  deleteHostel(id: string): boolean {
    const list = this.getHostels().filter((h) => h.id !== id);
    setStored('hostels', list);
    return true;
  },

  // Maintenance Reports
  getReports(): MaintenanceReport[] {
    return getStored<MaintenanceReport[]>('reports', INITIAL_REPORTS);
  },
  getReportById(id: string): MaintenanceReport | undefined {
    return this.getReports().find((r) => r.id === id);
  },
  createReport(report: MaintenanceReport): MaintenanceReport {
    const list = this.getReports();
    list.unshift(report);
    setStored('reports', list);

    // Also trigger notification for manager & admins
    this.addNotification({
      id: `notif-${Date.now()}`,
      recipient_id: report.assigned_to || 'u-manager-01',
      title: 'New Hazard Report Submitted',
      message: `A report on "${report.category.replace(/_/g, ' ')}" was filed for ${report.hostel_name || 'your property'}.`,
      link: '/dashboard/manager',
      created_at: new Date().toISOString(),
    });

    // Record audit log
    this.addAuditLog({
      id: `audit-${Date.now()}`,
      actor_id: report.reporter_id,
      actor_name: report.is_anonymous ? 'Anonymous Student' : report.reporter_name || 'Student',
      action: 'SUBMITTED_SAFETY_REPORT',
      entity_type: 'maintenance_report',
      entity_id: report.id,
      details: { severity: report.severity, category: report.category },
      created_at: new Date().toISOString(),
    });

    return report;
  },
  updateReport(report: MaintenanceReport): MaintenanceReport {
    const list = this.getReports();
    const idx = list.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      list[idx] = { ...report, updated_at: new Date().toISOString() };
      setStored('reports', list);

      // Notify student if not anonymous
      if (report.reporter_id) {
        this.addNotification({
          id: `notif-${Date.now()}`,
          recipient_id: report.reporter_id,
          title: `Report Status: ${report.status}`,
          message: `Your safety report for ${report.hostel_name || 'hostel'} was updated to "${report.status}".`,
          link: '/dashboard/student',
          created_at: new Date().toISOString(),
        });
      }
    }
    return report;
  },

  // Inspections
  getInspections(): Inspection[] {
    return getStored<Inspection[]>('inspections', INITIAL_INSPECTIONS);
  },
  getInspectionById(id: string): Inspection | undefined {
    return this.getInspections().find((i) => i.id === id);
  },
  saveInspection(inspection: Inspection): Inspection {
    const list = this.getInspections();
    const idx = list.findIndex((i) => i.id === inspection.id);
    if (idx >= 0) {
      list[idx] = { ...inspection, updated_at: new Date().toISOString() };
    } else {
      list.unshift(inspection);
    }
    setStored('inspections', list);

    this.addAuditLog({
      id: `audit-${Date.now()}`,
      actor_id: inspection.inspector_id,
      actor_name: inspection.inspector_name || 'Inspector',
      action: 'UPDATED_INSPECTION_AUDIT',
      entity_type: 'inspection',
      entity_id: inspection.id,
      details: { risk_level: inspection.structural_risk_level, status: inspection.status },
      created_at: new Date().toISOString(),
    });

    return inspection;
  },

  // Tasks
  getTasks(): MaintenanceTask[] {
    return getStored<MaintenanceTask[]>('tasks', INITIAL_TASKS);
  },
  saveTask(task: MaintenanceTask): MaintenanceTask {
    const list = this.getTasks();
    const idx = list.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      list[idx] = task;
    } else {
      list.unshift(task);
    }
    setStored('tasks', list);
    return task;
  },

  // Saved Hostels
  getSavedHostelIds(studentId: string): string[] {
    const saved = getStored<string[]>(`saved_${studentId}`, ['hostel-001']);
    return saved;
  },
  toggleSavedHostel(studentId: string, hostelId: string): boolean {
    const current = this.getSavedHostelIds(studentId);
    let updated: string[];
    let isSaved = false;
    if (current.includes(hostelId)) {
      updated = current.filter((id) => id !== hostelId);
      isSaved = false;
    } else {
      updated = [...current, hostelId];
      isSaved = true;
    }
    setStored(`saved_${studentId}`, updated);
    return isSaved;
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    return getStored<Enquiry[]>('enquiries', INITIAL_ENQUIRIES);
  },
  createEnquiry(enquiry: Enquiry): Enquiry {
    const list = this.getEnquiries();
    list.unshift(enquiry);
    setStored('enquiries', list);

    // Notify hostel manager
    const hostel = this.getHostelById(enquiry.hostel_id);
    if (hostel) {
      this.addNotification({
        id: `notif-${Date.now()}`,
        recipient_id: hostel.manager_id,
        title: 'New Student Enquiry',
        message: `${enquiry.student_name} enquired about ${hostel.name}: "${enquiry.message.slice(0, 80)}..."`,
        link: '/dashboard/manager',
        created_at: new Date().toISOString(),
      });
    }

    return enquiry;
  },
  updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved'): void {
    const list = this.getEnquiries();
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      setStored('enquiries', list);
    }
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    return all.filter((n) => n.recipient_id === userId || n.recipient_id === 'all');
  },
  addNotification(notif: NotificationItem): void {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    all.unshift(notif);
    setStored('notifications', all);
  },
  markNotificationRead(id: string): void {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    const item = all.find((n) => n.id === id);
    if (item) {
      item.read_at = new Date().toISOString();
      setStored('notifications', all);
    }
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
  },
  addAuditLog(log: AuditLog): void {
    const all = this.getAuditLogs();
    all.unshift(log);
    setStored('audit_logs', all);
  },

  // Reset to default seed
  resetData(): void {
    setStored('hostels', INITIAL_HOSTELS);
    setStored('reports', INITIAL_REPORTS);
    setStored('inspections', INITIAL_INSPECTIONS);
    setStored('tasks', INITIAL_TASKS);
    setStored('notifications', INITIAL_NOTIFICATIONS);
    setStored('enquiries', INITIAL_ENQUIRIES);
    setStored('audit_logs', INITIAL_AUDIT_LOGS);
  },
};
