import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge, AvailabilityBadge, StatusBadge, SeverityBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  MapPin,
  Phone,
  Bookmark,
  Share2,
  Droplets,
  Zap,
  Shield,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  ArrowLeft,
  Wrench,
  Check,
} from 'lucide-react';

export const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const hostel = StorageService.getHostelById(id || '');

  // Form states
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [enquiryName, setEnquiryName] = useState(currentUser?.full_name || '');
  const [enquiryPhone, setEnquiryPhone] = useState(currentUser?.phone || '');
  const [enquiryMessage, setEnquiryMessage] = useState(
    'Good day, I saw this accommodation on HostelSafe and would like to schedule a physical viewing and inquire about room vacancy.'
  );
  const [enquirySent, setEnquirySent] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    if (!currentUser || !id) return false;
    return StorageService.getSavedHostelIds(currentUser.id).includes(id);
  });
  const [copiedLink, setCopiedLink] = useState(false);

  if (!hostel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Hostel Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested accommodation listing does not exist or may have been unlisted by the manager.
        </p>
        <Link
          to="/hostels"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hostels Search
        </Link>
      </div>
    );
  }

  // Related reports and inspections for this hostel
  const allReports = StorageService.getReports();
  const hostelReports = allReports.filter((r) => r.hostel_id === hostel.id);

  const allInspections = StorageService.getInspections();
  const hostelInspections = allInspections.filter((i) => i.hostel_id === hostel.id);

  const handleBookmarkToggle = () => {
    if (!currentUser) return;
    const newState = StorageService.toggleSavedHostel(currentUser.id, hostel.id);
    setIsSaved(newState);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone || !enquiryMessage) return;

    StorageService.createEnquiry({
      id: `enq-${Date.now()}`,
      hostel_id: hostel.id,
      hostel_name: hostel.name,
      student_id: currentUser?.id,
      student_name: enquiryName,
      student_phone: enquiryPhone,
      message: enquiryMessage,
      status: 'new',
      created_at: new Date().toISOString(),
    });

    setEnquirySent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/hostels"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Hostels
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Share'}
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isSaved
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-rose-600' : ''}`} />
            {isSaved ? 'Saved to Bookmarks' : 'Save Hostel'}
          </button>
        </div>
      </div>

      {/* Title & Key Highlights Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge status={hostel.verification_status} />
          <AvailabilityBadge status={hostel.availability_status} />
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            {hostel.room_type}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              {hostel.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{hostel.address}</span>
            </div>
          </div>

          <div className="text-left md:text-right bg-teal-50/80 p-3.5 rounded-2xl border border-teal-100">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">Annual Rent</span>
            <span className="text-3xl font-extrabold text-teal-900 font-['Space_Grotesk']">
              ₦{hostel.rent_amount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block">/ {hostel.rent_period.replace('per ', '')}</span>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main active photo */}
        <div className="md:col-span-3 aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 relative">
          <img
            src={hostel.photos[activePhotoIdx]}
            alt={hostel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold">
            Photo {activePhotoIdx + 1} of {hostel.photos.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
          {hostel.photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`relative flex-1 min-w-[100px] md:min-w-0 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                idx === activePhotoIdx ? 'border-teal-600 ring-2 ring-teal-500/30' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={photo} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Description, Amenities, Safety Record, Map */}
        <div className="lg:col-span-8 space-y-8">
          {/* Official Property Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">About This Accommodation</h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {hostel.description}
            </p>
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>Managed by: <strong>{hostel.manager_name || 'Registered Property Manager'}</strong></span>
              <span>Institution: <strong>{hostel.university}</strong></span>
            </div>
          </div>

          {/* Facilities & Utilities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Facilities & Verified Utilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hostel.facilities.map((facility, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-semibold"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Building Safety Log & Defect History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-700" />
                  Building Safety & Maintenance Transparency Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real records of student-submitted reports and independent structural audits for this property.
                </p>
              </div>

              <Link
                to={`/report-hazard?hostelId=${hostel.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Hazard Here
              </Link>
            </div>

            {/* Inspections summary */}
            {hostelInspections.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Certified Engineering Inspections ({hostelInspections.length})
                </h4>
                {hostelInspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {insp.inspection_type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-slate-500">
                        Audited: {new Date(insp.completed_at || insp.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700">
                      <strong>Inspector:</strong> {insp.inspector_name} ({insp.inspector_credentials})
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>Findings:</strong> {insp.findings}
                    </p>
                    <div className="pt-1 text-slate-800">
                      <strong>Recommendations:</strong> {insp.recommendations}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reports history */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Resident Maintenance Reports ({hostelReports.length})
              </h4>
              {hostelReports.length > 0 ? (
                <div className="space-y-2.5">
                  {hostelReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={report.status} size="sm" />
                          <SeverityBadge severity={report.severity} />
                        </div>
                        <p className="font-semibold text-slate-900">
                          {report.category.replace(/_/g, ' ')}
                        </p>
                        <p className="text-slate-500 line-clamp-1">{report.description}</p>
                      </div>

                      <div className="text-slate-400 text-[11px] shrink-0">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No maintenance defects currently reported for this property.
                </p>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Location in Ifite Awka</h3>
            <p className="text-xs text-slate-600">
              Situated in {hostel.location}. Convenient to lecture halls and campus shuttle stops.
            </p>
            <LeafletMap hostels={[hostel]} selectedHostelId={hostel.id} heightClass="h-[320px]" />
          </div>
        </div>

        {/* Right Column (4 cols): Manager Contact & Enquiry Form */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Enquiry / Booking Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Direct Contact
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Connect with Manager</h3>
              <p className="text-xs text-slate-500 mt-1">
                Send an official booking enquiry or schedule a physical verification visit.
              </p>
            </div>

            {/* Direct Phone */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Manager Phone</span>
                <span className="text-sm font-bold text-slate-900">{hostel.contact_phone}</span>
              </div>
              <a
                href={`tel:${hostel.contact_phone}`}
                className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors"
                title="Call Manager"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Enquiry Form */}
            {enquirySent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Enquiry Dispatched!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your message was sent to the property manager. You will receive a response via phone or in your student portal.
                </p>
                <button
                  onClick={() => setEnquirySent(false)}
                  className="text-xs font-semibold text-emerald-800 underline mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="e.g., Emeka Obi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Official Enquiry
                </button>
              </form>
            )}

            {/* Quick Warning */}
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Never transfer caution fees or rent without physically inspecting the room and verifying hostel ownership.
            </p>
          </div>

          {/* Safety Reminder */}
          <SafetyWarningBanner urgentMode={false} />
        </div>
      </div>
    </div>
  );
};
