import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../lib/storage';
import { HostelService } from '../services/hostelService';
import { Hostel, MaintenanceReport, MaintenanceTask, Enquiry, ReportStatus, AvailabilityStatus } from '../types/database';
import { StatusBadge, SeverityBadge, AvailabilityBadge, VerificationBadge } from '../components/StatusBadge';
import {
  Building,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Plus,
  Upload,
  Edit,
  X,
  Save,
  Camera,
  MessageSquare,
  Phone,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const managerId = currentUser?.id || 'u-manager-01';

  // Load database entities
  const [hostels, setHostels] = useState<Hostel[]>(() =>
    StorageService.getHostels().filter((h) => h.manager_id === managerId)
  );
  const [reports, setReports] = useState<MaintenanceReport[]>(() =>
    StorageService.getReports().filter(
      (r) => r.assigned_to === managerId || hostels.some((h) => h.id === r.hostel_id)
    )
  );
  const [tasks, setTasks] = useState<MaintenanceTask[]>(() =>
    StorageService.getTasks().filter(
      (t) => t.assigned_to === managerId || hostels.some((h) => h.id === t.hostel_id)
    )
  );
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() =>
    StorageService.getEnquiries().filter((e) => hostels.some((h) => h.id === e.hostel_id))
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'tasks' | 'enquiries'>('overview');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Modal states
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('Repair in Progress');
  const [technicianName, setTechnicianName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progressNotes, setProgressNotes] = useState('');
  const [repairPhotos, setRepairPhotos] = useState<string[]>([]);

  // Hostel form states
  const [hostelFormName, setHostelFormName] = useState('');
  const [hostelFormDesc, setHostelFormDesc] = useState('');
  const [hostelFormLocation, setHostelFormLocation] = useState('First Gate, Ifite, Awka');
  const [hostelFormAddress, setHostelFormAddress] = useState('');
  const [hostelFormRent, setHostelFormRent] = useState(250000);
  const [hostelFormRentPeriod, setHostelFormRentPeriod] = useState<'per year' | 'per semester'>('per year');
  const [hostelFormRoomType, setHostelFormRoomType] = useState('Self-contain');
  const [hostelFormAvailability, setHostelFormAvailability] = useState<AvailabilityStatus>('available');
  const [hostelFormPhone, setHostelFormPhone] = useState(currentUser?.phone || '+234 803 456 7890');
  const [hostelFormFacilities, setHostelFormFacilities] = useState<string>('Borehole Water, Prepaid Meter, Gated Compound');
  const [hostelFormPhotos, setHostelFormPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
  ]);

  // Derived metrics
  const totalHostels = hostels.length;
  const openReports = reports.filter((r) => r.status !== 'Resolved' && r.status !== 'Closed').length;
  const activeTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'pending').length;
  const completedRepairs = reports.filter((r) => r.status === 'Resolved').length;

  // Handlers for hostel modal
  const openCreateHostelModal = () => {
    setEditingHostel(null);
    setUploadError(null);
    setHostelFormName('');
    setHostelFormDesc('');
    setHostelFormLocation('First Gate, Ifite, Awka');
    setHostelFormAddress('12 Miracle Road, Ifite-Awka');
    setHostelFormRent(280000);
    setHostelFormRentPeriod('per year');
    setHostelFormRoomType('Self-contain');
    setHostelFormAvailability('available');
    setHostelFormFacilities('Borehole Clean Water, Solar Security Lighting, Dedicated Prepaid Meter, Iron Gate');
    setHostelFormPhotos([
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    ]);
    setIsHostelModalOpen(true);
  };

  const openEditHostelModal = (h: Hostel) => {
    setEditingHostel(h);
    setUploadError(null);
    setHostelFormName(h.name);
    setHostelFormDesc(h.description);
    setHostelFormLocation(h.location);
    setHostelFormAddress(h.address);
    setHostelFormRent(h.rent_amount);
    setHostelFormRentPeriod(h.rent_period);
    setHostelFormRoomType(h.room_type);
    setHostelFormAvailability(h.availability_status);
    setHostelFormPhone(h.contact_phone);
    setHostelFormFacilities(h.facilities.join(', '));
    setHostelFormPhotos(h.photos);
    setIsHostelModalOpen(true);
  };

  const handleHostelPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await HostelService.uploadFile(files[i], 'hostel-photos', managerId);
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        uploadedUrls.push(result.url);
      }
    }
    if (uploadedUrls.length > 0) {
      setHostelFormPhotos((prev) => [...prev, ...uploadedUrls]);
    }
  };

  const handleSaveHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    const facilityList = hostelFormFacilities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedHostel: Hostel = {
      id: editingHostel ? editingHostel.id : `hostel-${Date.now()}`,
      manager_id: managerId,
      manager_name: currentUser?.full_name || 'Hostel Manager',
      name: hostelFormName,
      description: hostelFormDesc,
      location: hostelFormLocation,
      university: 'Nnamdi Azikiwe University (UNIZIK)',
      address: hostelFormAddress,
      latitude: editingHostel?.latitude || 6.2465,
      longitude: editingHostel?.longitude || 7.121,
      rent_amount: Number(hostelFormRent),
      rent_period: hostelFormRentPeriod,
      room_type: hostelFormRoomType,
      facilities: facilityList.length > 0 ? facilityList : ['Borehole Water', 'Gated Perimeter'],
      availability_status: hostelFormAvailability,
      verification_status: editingHostel ? editingHostel.verification_status : 'manager_verified',
      contact_phone: hostelFormPhone,
      photos: hostelFormPhotos.length > 0 ? hostelFormPhotos : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'],
      created_at: editingHostel ? editingHostel.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await HostelService.syncHostel(updatedHostel);
    setHostels(StorageService.getHostels().filter((h) => h.manager_id === managerId));
    setIsHostelModalOpen(false);
  };

  // Handlers for Report Action Modal
  const openActionModal = (report: MaintenanceReport) => {
    setSelectedReport(report);
    setUploadError(null);
    setNewStatus(report.status);
    setTechnicianName(report.assigned_technician_name || '');
    setTargetDate(report.target_date || '');
    setProgressNotes(report.progress_notes || '');
    setRepairPhotos(report.photos || []);
    setIsActionModalOpen(true);
  };

  const handleRepairPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await HostelService.uploadFile(files[i], 'defect-reports', selectedReport?.id || 'repairs');
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        uploadedUrls.push(result.url);
      }
    }
    if (uploadedUrls.length > 0) {
      setRepairPhotos((prev) => [...prev, ...uploadedUrls]);
    }
  };

  const handleSaveReportAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const updated: MaintenanceReport = {
      ...selectedReport,
      status: newStatus,
      assigned_technician_name: technicianName,
      target_date: targetDate,
      progress_notes: progressNotes,
      photos: repairPhotos,
      resolved_at: newStatus === 'Resolved' ? new Date().toISOString() : selectedReport.resolved_at,
    };

    await HostelService.syncReport(updated, false);

    // If a technician was assigned, create/update a task
    if (technicianName) {
      StorageService.saveTask({
        id: `task-${Date.now()}`,
        hostel_id: selectedReport.hostel_id,
        hostel_name: selectedReport.hostel_name,
        report_id: selectedReport.id,
        assigned_to: managerId,
        technician_name: technicianName,
        description: `Repair for ${selectedReport.category.replace(/_/g, ' ')}: ${progressNotes || 'Conduct repair work.'}`,
        target_date: targetDate || new Date().toISOString().split('T')[0],
        status: newStatus === 'Resolved' ? 'completed' : 'in_progress',
        completed_at: newStatus === 'Resolved' ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString(),
      });
    }

    setReports(
      StorageService.getReports().filter(
        (r) => r.assigned_to === managerId || hostels.some((h) => h.id === r.hostel_id)
      )
    );
    setTasks(
      StorageService.getTasks().filter(
        (t) => t.assigned_to === managerId || hostels.some((h) => h.id === t.hostel_id)
      )
    );
    setIsActionModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-teal-400 font-extrabold text-2xl flex items-center justify-center uppercase shadow-md">
            <Building className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
                {currentUser?.full_name || 'Chief Emeka Nwankwo'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                Hostel Manager
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser?.organization || 'Nwankwo Real Estate & Property Management, Awka'}
            </p>
            <p className="text-xs text-slate-400">
              Responsible for maintaining student safety standards across managed Awka properties.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateHostelModal}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          List New Hostel
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Managed Hostels</span>
            <Building className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            {totalHostels}
          </div>
          <p className="text-[11px] text-slate-400">Ifite Awka Zone</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Open Defect Reports</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-['Space_Grotesk']">
            {openReports}
          </div>
          <p className="text-[11px] text-slate-400">Awaiting or in progress</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Repair Tasks</span>
            <Wrench className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-sky-700 font-['Space_Grotesk']">
            {activeTasks}
          </div>
          <p className="text-[11px] text-slate-400">Assigned to technicians</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved Repairs</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-['Space_Grotesk']">
            {completedRepairs}
          </div>
          <p className="text-[11px] text-slate-400">Preserved in audit log</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          My Listed Hostels ({hostels.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Incident Defect Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Assigned Repair Tasks ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Student Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Tab Content 1: My Hostels */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Managed Accommodations</h2>
            <button
              onClick={openCreateHostelModal}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={hostel.photos[0]}
                      alt={hostel.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <VerificationBadge status={hostel.verification_status} />
                        <AvailabilityBadge status={hostel.availability_status} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{hostel.name}</h3>
                      <p className="text-xs text-slate-500">{hostel.address}</p>
                      <p className="text-sm font-extrabold text-teal-800">
                        ₦{hostel.rent_amount.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/{hostel.rent_period.replace('per ', '')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                    {hostel.facilities.slice(0, 4).map((f, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                    {hostel.facilities.length > 4 && (
                      <span className="text-slate-400">+{hostel.facilities.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Updated {new Date(hostel.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditHostelModal(hostel)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <a
                      href={`/hostels/${hostel.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                    >
                      Public Page
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Maintenance Reports Received */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Incident Tickets for Your Hostels</h2>
            <span className="text-xs text-slate-500">Click "Update Action" to assign a technician or update stage</span>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-400 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={report.status} />
                        <SeverityBadge severity={report.severity} />
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {report.hostel_name}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {report.category.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                      {report.location_details && (
                        <p className="text-xs text-slate-500">Location: {report.location_details}</p>
                      )}
                    </div>

                    <button
                      onClick={() => openActionModal(report)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Take Action / Update
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {report.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt="Defect"
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions & Progress Note */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                    <p className="text-slate-600">
                      <strong>Assigned Specialist:</strong>{' '}
                      {report.assigned_technician_name || 'Not yet assigned'}
                    </p>
                    {report.target_date && (
                      <p className="text-slate-600">
                        <strong>Target Deadline:</strong> {report.target_date}
                      </p>
                    )}
                    {report.progress_notes && (
                      <p className="text-slate-600">
                        <strong>Manager Notes:</strong> {report.progress_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500">
              No defect tickets currently open for your properties.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Repair Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Repair Task Tracking</h2>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.status.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-900">{task.hostel_name}</span>
                    </div>
                    <p className="text-slate-700">{task.description}</p>
                    <p className="text-slate-500 text-[11px]">
                      Technician: <strong>{task.technician_name}</strong> &bull; Target: {task.target_date}
                    </p>
                  </div>

                  {task.status !== 'completed' && (
                    <button
                      onClick={() => {
                        const updated = {
                          ...task,
                          status: 'completed' as const,
                          completed_at: new Date().toISOString(),
                        };
                        StorageService.saveTask(updated);
                        setTasks(StorageService.getTasks().filter((t) => t.assigned_to === managerId));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500">
              No tasks currently tracked.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Student Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Incoming Student Enquiries</h2>
          {enquiries.length > 0 ? (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{enq.student_name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {enq.hostel_name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          enq.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'contacted'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">&ldquo;{enq.message}&rdquo;</p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" /> {enq.student_phone} &bull;{' '}
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {enq.status === 'new' && (
                      <button
                        onClick={() => {
                          StorageService.updateEnquiryStatus(enq.id, 'contacted');
                          setEnquiries(
                            StorageService.getEnquiries().filter((e) =>
                              hostels.some((h) => h.id === e.hostel_id)
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {enq.status !== 'resolved' && (
                      <button
                        onClick={() => {
                          StorageService.updateEnquiryStatus(enq.id, 'resolved');
                          setEnquiries(
                            StorageService.getEnquiries().filter((e) =>
                              hostels.some((h) => h.id === e.hostel_id)
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500">
              No student enquiries received yet.
            </div>
          )}
        </div>
      )}

      {/* Hostel Create/Edit Modal */}
      {isHostelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingHostel ? 'Edit Hostel Listing' : 'Register New Student Hostel'}
              </h3>
              <button
                onClick={() => setIsHostelModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHostel} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hostel Name *</label>
                <input
                  type="text"
                  required
                  value={hostelFormName}
                  onChange={(e) => setHostelFormName(e.target.value)}
                  placeholder="e.g., Peace Heights Lodge"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={hostelFormDesc}
                  onChange={(e) => setHostelFormDesc(e.target.value)}
                  placeholder="Describe proximity to UNIZIK gates, water reliability, security..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area in Awka *</label>
                  <select
                    value={hostelFormLocation}
                    onChange={(e) => setHostelFormLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="First Gate, Ifite, Awka">First Gate, Ifite</option>
                    <option value="Second Gate, Ifite, Awka">Second Gate, Ifite</option>
                    <option value="Book Foundation, Ifite, Awka">Book Foundation, Ifite</option>
                    <option value="Temp Site / Aroma Link, Awka">Temp Site / Aroma</option>
                    <option value="Seminary Road, Ifite, Awka">Seminary Road</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Street Address *</label>
                  <input
                    type="text"
                    required
                    value={hostelFormAddress}
                    onChange={(e) => setHostelFormAddress(e.target.value)}
                    placeholder="e.g., 14 Chief Ekwueme Street"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rent Amount (₦) *</label>
                  <input
                    type="number"
                    required
                    value={hostelFormRent}
                    onChange={(e) => setHostelFormRent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rent Period *</label>
                  <select
                    value={hostelFormRentPeriod}
                    onChange={(e) => setHostelFormRentPeriod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="per year">per year</option>
                    <option value="per semester">per semester</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room Type *</label>
                  <select
                    value={hostelFormRoomType}
                    onChange={(e) => setHostelFormRoomType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Self-contain">Self-contain</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Two-bedroom Flat">Two-bedroom Flat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room Availability Status</label>
                  <select
                    value={hostelFormAvailability}
                    onChange={(e) => setHostelFormAvailability(e.target.value as AvailabilityStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="available">Rooms Available</option>
                    <option value="few_rooms_left">Only Few Rooms Left</option>
                    <option value="full">Fully Occupied</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={hostelFormPhone}
                    onChange={(e) => setHostelFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Facilities & Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={hostelFormFacilities}
                  onChange={(e) => setHostelFormFacilities(e.target.value)}
                  placeholder="Borehole Water, Standby Generator, Gated Compound, Pre-paid meter"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Property Photographs</label>
                {uploadError && (
                  <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg">{uploadError}</p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {hostelFormPhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                      <img src={photo} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setHostelFormPhotos(hostelFormPhotos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-red-600"
                        aria-label="Remove property photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-teal-700">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-semibold">Add Photo</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleHostelPhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHostelModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action / Repair Update Modal */}
      {isActionModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Update Maintenance Defect Ticket
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedReport.category.replace(/_/g, ' ')} &bull; {selectedReport.hostel_name}
                </p>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReportAction} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Update Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 font-semibold"
                >
                  <option value="Submitted">Submitted (Queued)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Inspection Requested">Inspection Requested (COREN Auditor)</option>
                  <option value="Action Required">Action Required</option>
                  <option value="Repair in Progress">Repair in Progress (Technician on site)</option>
                  <option value="Resolved">Resolved (Completed & Verified)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Assigned Technician / Specialist Name & Contact
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="e.g., Okafor Metal Works Awka (+234 803 777 1212)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Manager Progress Notes & Corrective Steps
                </label>
                <textarea
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Explain what repair steps are being performed..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Before / After Repair Photos</label>
                {uploadError && (
                  <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg">{uploadError}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {repairPhotos.map((photo, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                      <img src={photo} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setRepairPhotos(repairPhotos.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-slate-500">
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-semibold mt-0.5">Upload</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleRepairPhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
