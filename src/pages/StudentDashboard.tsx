import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../lib/storage';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { Link } from 'react-router-dom';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import {
  User,
  Bookmark,
  AlertTriangle,
  Send,
  Bell,
  Clock,
  CheckCircle,
  Shield,
  Trash2,
  Building,
  Search,
  Settings,
  Save,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, updateProfile, refreshNotifications } = useAuth();
  const { searches, clearSearches } = useRecentSearches();
  const [activeTab, setActiveTab] = useState<'reports' | 'saved' | 'searches' | 'enquiries' | 'notifications' | 'settings'>('reports');
  const [savedRevision, setSavedRevision] = useState(0);

  // Account settings form state
  const [profileName, setProfileName] = useState(currentUser?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileOrg, setProfileOrg] = useState(currentUser?.organization || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const allReports = StorageService.getReports();
  // Filter reports submitted by this student (or demo student)
  const myReports = allReports.filter(
    (r) => r.reporter_id === currentUser?.id || r.reporter_id === 'u-student-01'
  );

  const savedHostelIds = currentUser ? StorageService.getSavedHostelIds(currentUser.id) : [];
  const allHostels = StorageService.getHostels();
  const savedHostels = allHostels.filter((h) => savedHostelIds.includes(h.id));
  void savedRevision;

  const allEnquiries = StorageService.getEnquiries();
  const myEnquiries = allEnquiries.filter(
    (e) => e.student_id === currentUser?.id || e.student_phone === currentUser?.phone
  );

  const notifications = currentUser ? StorageService.getNotifications(currentUser.id) : [];

  const handleMarkNotificationRead = (notifId: string) => {
    StorageService.markNotificationRead(notifId);
    refreshNotifications();
  };

  const handleRemoveSaved = (hostelId: string) => {
    if (!currentUser) return;
    StorageService.toggleSavedHostel(currentUser.id, hostelId);
    setSavedRevision((v) => v + 1);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: profileName.trim() || currentUser?.full_name,
      phone: profilePhone.trim(),
      organization: profileOrg.trim(),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md">
            {currentUser?.full_name?.slice(0, 2) || 'ST'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
                {currentUser?.full_name || 'Student Portal'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                Student
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser?.email} &bull; {currentUser?.phone}</p>
            <p className="text-xs text-teal-700 font-medium">{currentUser?.organization || 'Nnamdi Azikiwe University (UNIZIK)'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report-hazard"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Report New Hazard
          </Link>
          <Link
            to="/hostels"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow transition-all flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Explore Hostels
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          My Hazard Reports ({myReports.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Hostels ({savedHostels.length})
        </button>

        <button
          onClick={() => setActiveTab('searches')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'searches'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          Recent Searches ({searches.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          Booking Enquiries ({myEnquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications ({notifications.filter((n) => !n.read_at).length} unread)
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          Account Settings
        </button>
      </div>

      {/* Tab 1: Hazard Reports & Repair Progression */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Your Building Safety Reports & Repair Progression
            </h2>
            <span className="text-xs text-slate-500">Live 7-Stage Status Tracking</span>
          </div>

          {myReports.length > 0 ? (
            <div className="space-y-4">
              {myReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-400 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={report.status} />
                        <SeverityBadge severity={report.severity} />
                        {report.is_anonymous && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {report.category.replace(/_/g, ' ').toUpperCase()} &bull; {report.hostel_name}
                      </h3>
                      {report.location_details && (
                        <p className="text-xs text-slate-500">Location: {report.location_details}</p>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 sm:text-right">
                      <p>Reported: {new Date(report.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] font-mono text-slate-500">ID: {report.id}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Evidence Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {report.photos.map((photo, idx) => (
                        <a
                          key={idx}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 block relative group"
                        >
                          <img src={photo} alt="evidence" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity">
                            View
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Technician & Progress Notes */}
                  {(report.assigned_technician_name || report.progress_notes) && (
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Shield className="w-3.5 h-3.5 text-teal-600" />
                        Manager & Inspector Action Log
                      </div>
                      {report.assigned_technician_name && (
                        <p className="text-slate-600">
                          <strong>Assigned Specialist:</strong> {report.assigned_technician_name}{' '}
                          {report.target_date && `(Target: ${report.target_date})`}
                        </p>
                      )}
                      {report.progress_notes && (
                        <p className="text-slate-600 leading-relaxed">
                          <strong>Official Update:</strong> {report.progress_notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Building Reports Logged Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                If you observe cracked walls, loose railings, or broken wiring in your hostel, submit a report here to notify the manager.
              </p>
              <Link
                to="/report-hazard"
                className="inline-block px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold text-xs mt-2"
              >
                Submit First Report
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Hostels */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Bookmarked Hostels</h2>
          {savedHostels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHostels.map((hostel) => (
                <div key={hostel.id} className="relative group">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full">
                    <img
                      src={hostel.photos[0]}
                      alt={hostel.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{hostel.name}</h4>
                        <p className="text-xs text-slate-500">{hostel.location}</p>
                        <p className="text-base font-extrabold text-teal-800 mt-1">
                          ₦{hostel.rent_amount.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/{hostel.rent_period.replace('per ', '')}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <Link
                          to={`/hostels/${hostel.id}`}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold text-center hover:bg-slate-800"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleRemoveSaved(hostel.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You haven't bookmarked any accommodations yet.</p>
              <Link to="/hostels" className="text-xs font-semibold text-teal-700 underline">
                Browse Hostels in Ifite
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Booking Enquiries</h2>
          {myEnquiries.length > 0 ? (
            <div className="space-y-3">
              {myEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm">{enq.hostel_name}</span>
                    <p className="text-slate-600 leading-relaxed italic">"{enq.message}"</p>
                    <p className="text-[11px] text-slate-400">
                      Sent on {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                        enq.status === 'contacted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {enq.status === 'contacted' ? 'Manager Contacted' : 'Sent / Pending Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500">
              No booking enquiries sent yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">In-App Notifications</h2>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkNotificationRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.read_at
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-teal-50/70 border-teal-200 text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                      <p className="leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.read_at && (
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500">
              You have no notifications at this time.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Recent Searches */}
      {activeTab === 'searches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Hostel Searches</h2>
            {searches.length > 0 && (
              <button
                onClick={clearSearches}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear History
              </button>
            )}
          </div>
          {searches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searches.map((item) => (
                <Link
                  key={item.id}
                  to={item.params ? `/hostels?${item.params}` : '/hostels'}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-500 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-teal-600" />
                      {item.querySummary}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-700">Re-run &rarr;</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-xs text-slate-500 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No recent hostel searches recorded yet.</p>
              <Link to="/hostels" className="text-teal-700 font-semibold underline inline-block">
                Search Ifite Hostels
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Account Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Account & Contact Settings</h2>
              <p className="text-xs text-slate-500">Keep your contact details current for property enquiries.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">University / Department</label>
              <input
                type="text"
                value={profileOrg}
                onChange={(e) => setProfileOrg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Profile settings saved!
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Save Account Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
