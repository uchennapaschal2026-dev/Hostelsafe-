import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../lib/storage';
import { Hostel, MaintenanceReport, Inspection, AuditLog, VerificationStatus } from '../types/database';
import { StatusBadge, SeverityBadge, VerificationBadge } from '../components/StatusBadge';
import {
  ShieldAlert,
  Building,
  UserCheck,
  AlertTriangle,
  History,
  CheckCircle,
  XCircle,
  FileText,
  BadgeCheck,
  Sparkles,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'hazards' | 'hostels' | 'inspectors' | 'audit'>('hazards');

  const [hostels, setHostels] = useState<Hostel[]>(() => StorageService.getHostels());
  const [reports, setReports] = useState<MaintenanceReport[]>(() => StorageService.getReports());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());

  // Metrics
  const criticalHazards = reports.filter((r) => r.severity === 'critical_hazard' || r.severity === 'high');
  const pendingVerifications = hostels.filter((h) => h.verification_status === 'unverified');

  const handleToggleHostelVerification = (hostel: Hostel) => {
    const nextStatus: VerificationStatus =
      hostel.verification_status === 'independently_inspected'
        ? 'unverified'
        : hostel.verification_status === 'unverified'
        ? 'manager_verified'
        : 'independently_inspected';

    const updated: Hostel = { ...hostel, verification_status: nextStatus };
    StorageService.saveHostel(updated);
    setHostels(StorageService.getHostels());

    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      actor_id: currentUser?.id,
      actor_name: currentUser?.full_name || 'Admin',
      action: 'MODERATED_HOSTEL_VERIFICATION',
      entity_type: 'hostel',
      entity_id: hostel.id,
      details: { previous: hostel.verification_status, new: nextStatus, hostel_name: hostel.name },
      created_at: new Date().toISOString(),
    });
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleEscalateReport = (report: MaintenanceReport) => {
    const updated = {
      ...report,
      status: 'Inspection Requested' as const,
      progress_notes: 'ADMIN ESCALATION: Assigned for urgent engineering inspection by state compliance board.',
    };
    StorageService.updateReport(updated);
    setReports(StorageService.getReports());

    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      actor_id: currentUser?.id,
      actor_name: currentUser?.full_name || 'Admin',
      action: 'ESCALATED_CRITICAL_HAZARD',
      entity_type: 'maintenance_report',
      entity_id: report.id,
      details: { category: report.category, hostel: report.hostel_name },
      created_at: new Date().toISOString(),
    });
    setAuditLogs(StorageService.getAuditLogs());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 font-extrabold text-2xl flex items-center justify-center uppercase border border-teal-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk']">
                System Administration & Compliance
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as: <strong>{currentUser?.full_name}</strong> &bull; {currentUser?.email}
            </p>
            <p className="text-xs text-slate-500">
              Managing student accommodations and structural compliance across Ifite Awka.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Hostels</span>
          <div className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">{hostels.length}</div>
          <p className="text-[11px] text-teal-700">Ifite, Awka Zone</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgent Hazards</span>
          <div className="text-3xl font-extrabold text-red-600 font-['Space_Grotesk']">{criticalHazards.length}</div>
          <p className="text-[11px] text-red-600">Requires oversight</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unverified Listings</span>
          <div className="text-3xl font-extrabold text-amber-600 font-['Space_Grotesk']">{pendingVerifications.length}</div>
          <p className="text-[11px] text-slate-500">Awaiting documentation</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit Actions</span>
          <div className="text-3xl font-extrabold text-slate-800 font-['Space_Grotesk']">{auditLogs.length}</div>
          <p className="text-[11px] text-slate-500">Logged events</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('hazards')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'hazards'
              ? 'border-red-600 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Urgent Hazard Triage ({criticalHazards.length})
        </button>

        <button
          onClick={() => setActiveTab('hostels')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'hostels'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          Listing Moderation ({hostels.length})
        </button>

        <button
          onClick={() => setActiveTab('inspectors')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'inspectors'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Inspector Credentials
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Urgent Hazard Triage */}
      {activeTab === 'hazards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">High & Critical Life Hazards</h2>
            <span className="text-xs text-slate-500">Require immediate intervention or structural engineering audit</span>
          </div>

          <div className="space-y-3">
            {criticalHazards.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm space-y-3 hover:border-red-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={report.severity} />
                      <StatusBadge status={report.status} size="sm" />
                      <span className="font-bold text-slate-900 text-sm">{report.hostel_name}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {report.category.replace(/_/g, ' ')} &bull; {report.location_details || 'Main Building'}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleEscalateReport(report)}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors self-start sm:self-auto"
                  >
                    Escalate to State Inspector
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                {report.progress_notes && (
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 border border-slate-100">
                    <strong>Current Note:</strong> {report.progress_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Listing Moderation */}
      {activeTab === 'hostels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Hostel Listings Verification Review</h2>
            <span className="text-xs text-slate-500">Click badge to cycle status</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 text-[10px]">
                <tr>
                  <th className="p-3">Hostel</th>
                  <th className="p-3">Manager</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Rent</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hostels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{h.name}</td>
                    <td className="p-3 text-slate-600">{h.manager_name}</td>
                    <td className="p-3 text-slate-500">{h.location}</td>
                    <td className="p-3 font-semibold text-teal-800">₦{h.rent_amount.toLocaleString()}</td>
                    <td className="p-3">
                      <VerificationBadge status={h.verification_status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleHostelVerification(h)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inspector Credentials Verification */}
      {activeTab === 'inspectors' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Verified Structural Engineers & Inspectors</h2>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">
                  Engr. Babatunde Adeleke, MNSE, COREN
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  COREN Registration: R41892 &bull; Active License
                </p>
                <p className="text-xs text-emerald-700 font-semibold">
                  Status: Approved State Structural Building Auditor
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Administrators must verify engineer credentials against the official Council for the Regulation of Engineering in Nigeria (COREN) register prior to granting inspector privileges on HostelSafe.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Security & Administrative Audit Log</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-slate-500">by {log.actor_name}</span>
                    </div>
                    {log.details && (
                      <p className="text-slate-600 font-mono text-[11px]">
                        {JSON.stringify(log.details)}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
