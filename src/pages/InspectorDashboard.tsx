import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../lib/storage';
import { HostelService } from '../services/hostelService';
import { Inspection, StructuralRiskLevel } from '../types/database';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  ShieldCheck,
  Plus,
  FileText,
  BadgeCheck,
  X,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export const InspectorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>(() =>
    StorageService.getInspections()
  );
  const hostels = StorageService.getHostels();

  // Audit form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  const [selectedHostelId, setSelectedHostelId] = useState(hostels[0]?.id || '');
  const [inspectionType, setInspectionType] = useState<Inspection['inspection_type']>('structural_integrity');
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [riskLevel, setRiskLevel] = useState<StructuralRiskLevel>('minor_repairs_needed');
  const [hazardsInput, setHazardsInput] = useState('Parapet wall moisture seepage, Staircase anchor wear');
  const [scheduledDate, setScheduledDate] = useState('2025-03-10');
  const [reportDocUrl, setReportDocUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const openNewAuditModal = () => {
    setEditingInspection(null);
    setUploadError(null);
    setSelectedHostelId(hostels[0]?.id || '');
    setInspectionType('structural_integrity');
    setFindings('');
    setRecommendations('');
    setRiskLevel('minor_repairs_needed');
    setHazardsInput('Parapet wall moisture seepage, Staircase anchor wear');
    setReportDocUrl('');
    setIsModalOpen(true);
  };

  const openCompleteAuditModal = (insp: Inspection) => {
    setEditingInspection(insp);
    setUploadError(null);
    setSelectedHostelId(insp.hostel_id);
    setInspectionType(insp.inspection_type);
    setFindings(insp.findings || '');
    setRecommendations(insp.recommendations || '');
    setRiskLevel(insp.structural_risk_level || 'minor_repairs_needed');
    setHazardsInput((insp.hazards_identified || []).join(', '));
    setReportDocUrl(insp.report_storage_path || '');
    setIsModalOpen(true);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await HostelService.uploadFile(file, 'inspection-docs', currentUser?.id || 'inspector');
    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      setReportDocUrl(res.url);
    }
  };

  const handleSaveInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetHostel = StorageService.getHostelById(selectedHostelId);
    const savedInspection: Inspection = {
      id: editingInspection ? editingInspection.id : `insp-${Date.now()}`,
      hostel_id: selectedHostelId,
      hostel_name: targetHostel?.name || editingInspection?.hostel_name || 'Inspected Hostel',
      inspector_id: currentUser?.id || 'u-inspector-01',
      inspector_name: currentUser?.full_name || 'Engr. Babatunde Adeleke, MNSE, COREN',
      inspector_credentials: currentUser?.credentials_info || 'COREN Reg. R41892 | MNSE',
      report_id: editingInspection?.report_id,
      inspection_type: inspectionType,
      scheduled_at: editingInspection?.scheduled_at || `${scheduledDate}T10:00:00Z`,
      completed_at: new Date().toISOString(),
      findings,
      recommendations,
      hazards_identified: hazardsInput.split(',').map((s) => s.trim()).filter(Boolean),
      structural_risk_level: riskLevel,
      report_storage_path: reportDocUrl || editingInspection?.report_storage_path,
      status: 'completed',
      created_at: editingInspection ? editingInspection.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await HostelService.syncInspection(savedInspection);
    setInspections(StorageService.getInspections());
    setIsModalOpen(false);
    setEditingInspection(null);
    setFindings('');
    setRecommendations('');
    setReportDocUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Inspector Profile Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-800 text-teal-300 font-extrabold text-2xl flex items-center justify-center uppercase shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
                {currentUser?.full_name || 'Engr. Babatunde Adeleke'}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified COREN Engineer
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono font-medium">
              {currentUser?.credentials_info || 'COREN Reg. R41892 | MNSE Civil/Structural Engineering'}
            </p>
            <p className="text-xs text-slate-500">
              Authority: Anambra State Structural Safety & Compliance Oversight Desk
            </p>
          </div>
        </div>

        <button
          onClick={openNewAuditModal}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record Inspection Audit
        </button>
      </div>

      {/* Safety Notice */}
      <SafetyWarningBanner urgentMode={false} />

      {/* Inspection List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Registered Building Audits & Inspections ({inspections.length})
          </h2>
          <span className="text-xs text-slate-500">Official Engineering Logs</span>
        </div>

        <div className="space-y-4">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                      {insp.inspection_type.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        insp.structural_risk_level === 'severe_immediate_hazard'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : insp.structural_risk_level === 'moderate_risk'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      Risk: {insp.structural_risk_level?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {insp.hostel_name}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Field Audit #{insp.id}
                  </h3>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-xs text-slate-500 sm:text-right">
                    <p>
                      {insp.status === 'scheduled' ? 'Scheduled:' : 'Audited:'}{' '}
                      {new Date(insp.completed_at || insp.scheduled_at || insp.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] text-teal-700 font-semibold">{insp.inspector_credentials}</p>
                  </div>
                  {insp.status !== 'completed' && (
                    <button
                      onClick={() => openCompleteAuditModal(insp)}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-end"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete &amp; Seal Audit
                    </button>
                  )}
                  {insp.report_storage_path && (
                    <a
                      href={insp.report_storage_path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-sky-700 hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Uploaded Report
                    </a>
                  )}
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-500">Technical Findings:</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {insp.findings}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-teal-800">
                  Mandated Corrective Actions:
                </h4>
                <p className="text-slate-800 leading-relaxed bg-teal-50/60 p-3 rounded-xl border border-teal-100 whitespace-pre-line">
                  {insp.recommendations}
                </p>
              </div>

              {/* Identified hazards pills */}
              {insp.hazards_identified && insp.hazards_identified.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="font-semibold text-slate-500">Flagged Conditions:</span>
                  {insp.hazards_identified.map((hazard, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-medium text-[11px]"
                    >
                      {hazard}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Record Inspection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editingInspection ? 'Complete Scheduled Structural Audit' : 'Submit Official Structural Audit'}
                </h3>
                <p className="text-xs text-slate-500">
                  Audits are logged directly into the permanent building safety ledger.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hostel Audited *</label>
                <select
                  value={selectedHostelId}
                  onChange={(e) => setSelectedHostelId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Audit Type *</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="structural_integrity">Structural Integrity (Concrete & Steel)</option>
                    <option value="electrical_safety">Electrical Infrastructure & Earthing</option>
                    <option value="fire_emergency_exit">Fire Safety & Emergency Egress</option>
                    <option value="roof_ceiling_condition">Roof Truss & Ceiling Drainage</option>
                    <option value="plumbing_sanitation">Plumbing & Soakaway Foundation</option>
                    <option value="comprehensive_building_audit">Full Comprehensive Audit</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Structural Risk Assessment *</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as StructuralRiskLevel)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                  >
                    <option value="safe_standard">Safe Standard (No critical risk)</option>
                    <option value="minor_repairs_needed">Minor Non-Structural Repairs Needed</option>
                    <option value="moderate_risk">Moderate Risk (Remediation Required)</option>
                    <option value="severe_immediate_hazard">SEVERE IMMEDIATE HAZARD (Evacuate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Identified Hazards (comma separated)
                </label>
                <input
                  type="text"
                  value={hazardsInput}
                  onChange={(e) => setHazardsInput(e.target.value)}
                  placeholder="e.g., Cantilever balcony anchor wear, Diagonal wall crack, Poor soakaway"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Engineering Observations & Findings *
                </label>
                <textarea
                  rows={4}
                  required
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="Document measurements: crack width (mm), steel rebar spalling, soil settlement around soakaway..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mandatory Recommendations & Remediation Deadlines *
                </label>
                <textarea
                  rows={3}
                  required
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="State remedial engineering interventions, required certified contractors, and re-inspection date..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Attach Signed Inspection Document (PDF or Scan, max 10MB)
                </label>
                {uploadError && (
                  <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg">{uploadError}</p>
                )}
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer font-semibold text-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    {reportDocUrl ? 'Replace Document' : 'Upload Report PDF / Image'}
                    <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={handleDocUpload} className="hidden" />
                  </label>
                  {reportDocUrl && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Document attached
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold"
                >
                  Seal & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
