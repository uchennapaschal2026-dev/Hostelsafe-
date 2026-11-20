import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { StorageService } from '../lib/storage';
import { HostelService } from '../services/hostelService';
import { useAuth } from '../context/AuthContext';
import { ReportCategory, ReportSeverity } from '../types/database';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  AlertTriangle,
  CheckCircle,
  Camera,
  X,
  EyeOff,
  UserCheck,
} from 'lucide-react';

export const ReportHazardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const hostels = StorageService.getHostels();

  const preselectedHostelId = searchParams.get('hostelId') || (hostels[0]?.id ?? '');

  // Form states
  const [selectedHostelId, setSelectedHostelId] = useState(preselectedHostelId);
  const [category, setCategory] = useState<ReportCategory>('wall_ceiling_cracks');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
  ]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const handleAddSamplePhoto = () => {
    if (!photoUrlInput.trim()) return;
    setUploadedPhotos([...uploadedPhotos, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await HostelService.uploadFile(files[i], 'defect-reports', selectedHostelId || 'general');
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        newUrls.push(result.url);
      }
    }
    if (newUrls.length > 0) {
      setUploadedPhotos((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedHostelId) return;

    setSubmitting(true);

    const targetHostel = StorageService.getHostelById(selectedHostelId);
    const newReportId = `rep-${Date.now()}`;

    const newReport = {
      id: newReportId,
      hostel_id: selectedHostelId,
      hostel_name: targetHostel?.name || 'Selected Hostel',
      reporter_id: isAnonymous ? undefined : currentUser?.id || 'u-student-01',
      reporter_name: isAnonymous ? 'Anonymous Student' : currentUser?.full_name || 'Student Reporter',
      category,
      description,
      location_details: locationDetails,
      severity,
      status: 'Submitted' as const,
      is_anonymous: isAnonymous,
      assigned_to: targetHostel?.manager_id,
      photos: uploadedPhotos,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await HostelService.syncReport(newReport, true);
    setSubmittedReportId(newReportId);
    setSubmitting(false);
  };

  if (submittedReportId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            Report Successfully Filed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            Your Hazard Report Has Been Logged
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Report ID: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">{submittedReportId}</code>.
            The hostel manager and compliance inspection board have been notified.
          </p>
        </div>

        {severity === 'critical_hazard' && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-left space-y-2">
            <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Critical Safety Action:
            </h4>
            <p className="text-xs text-red-800 leading-relaxed">
              Because you flagged this as a critical hazard, stay clear of the affected structural element. If there is risk of collapse or electrocution, warn fellow residents immediately.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard/student"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow transition-colors"
          >
            Track in Student Dashboard
          </Link>
          <button
            onClick={() => {
              setSubmittedReportId(null);
              setDescription('');
              setLocationDetails('');
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-md border border-red-200">
          <AlertTriangle className="w-4 h-4" />
          <span>Building Safety & Defect Reporting Form</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Report a Building Defect or Hazard
        </h1>
        <p className="text-sm text-slate-600">
          Help protect fellow students in Ifite Awka. Submit observations of wall fractures, sagging stairs, faulty wiring, or drainage failures.
        </p>
      </div>

      {/* Safety Warning */}
      <SafetyWarningBanner urgentMode={severity === 'critical_hazard'} />

      {/* Reporting Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Hostel Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Select Hostel in Ifite Awka *
          </label>
          <select
            required
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.location}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Reports will be directly linked to this property and dispatched to its registered manager.
          </p>
        </div>

        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Defect Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Defect Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="wall_ceiling_cracks">Wall & Ceiling Cracks</option>
              <option value="damaged_stairs_balconies">Damaged Stairs, Balconies & Handrails</option>
              <option value="exposed_electrical_wiring">Exposed Electrical Wiring & Panels</option>
              <option value="roof_damage_leaks">Roof Damage & Ceiling Water Leaks</option>
              <option value="visible_steel_corrosion">Visible Steel Rebar Corrosion & Concrete Spalling</option>
              <option value="poor_drainage_sanitation">Collapsed Soakaway & Poor Sanitation</option>
              <option value="blocked_emergency_exits">Blocked Emergency Exits & Escape Routes</option>
              <option value="fire_safety_concerns">Fire Safety Equipment Missing or Defective</option>
              <option value="other_structural_defects">Other Suspected Structural Defects</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Estimated Hazard Level *
            </label>
            <select
              required
              value={severity}
              onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
              className={`w-full border rounded-xl p-3 text-sm focus:ring-2 focus:outline-none font-semibold ${
                severity === 'critical_hazard'
                  ? 'bg-red-50 border-red-400 text-red-900 focus:ring-red-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-teal-500'
              }`}
            >
              <option value="low">Low (Cosmetic, non-immediate repair)</option>
              <option value="medium">Medium (Moderate wear, needs scheduled maintenance)</option>
              <option value="high">High (Substantial defect, safety hazard if unattended)</option>
              <option value="critical_hazard">CRITICAL (Immediate danger of structural collapse or electrocution)</option>
            </select>
          </div>
        </div>

        {/* Location Within Building */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Specific Location Within Property
          </label>
          <input
            type="text"
            placeholder="e.g., Block B, 2nd floor staircase landing near Room 14"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-500">
            Precise location helps technicians and engineers quickly locate the issue without disturbing other tenants.
          </p>
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Detailed Observations & Description *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe what you see: crack width, whether it is widening, sounds of creaking, water ingress during rains, sparks, foul odor from soakaway, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Photo Upload / Attachment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Photographic Evidence
            </label>
            <span className="text-[11px] text-slate-500">Attach clear photos of the defect</span>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              {uploadError}
            </p>
          )}

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {uploadedPhotos.map((photo, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                <img src={photo} alt={`Defect evidence ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30 cursor-pointer transition-colors p-3 text-center">
              <Camera className="w-6 h-6 text-slate-400 group-hover:text-teal-600 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Upload Photo</span>
              <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct URL input fallback */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="url"
              placeholder="Or paste an image URL..."
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSamplePhoto}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
            >
              Add URL
            </button>
          </div>
        </div>

        {/* Reporter Privacy / Anonymous Protection */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <EyeOff className="w-5 h-5 text-purple-600" />
              ) : (
                <UserCheck className="w-5 h-5 text-teal-600" />
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isAnonymous ? 'Confidential / Anonymous Mode Enabled' : 'Standard Student Report'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isAnonymous
                    ? 'Your name and contact phone will NOT be disclosed to the hostel manager.'
                    : `Report submitted as ${currentUser?.full_name || 'Logged-in Student'}.`}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {submitting ? 'Submitting Report...' : 'Submit Building Defect Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
