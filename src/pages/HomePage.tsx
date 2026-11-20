import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../lib/storage';
import { HostelCard } from '../components/HostelCard';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  Search,
  ShieldAlert,
  Building,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Zap,
  Shield,
  Eye,
  SlidersHorizontal,
  FileText,
  Users,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const hostels = StorageService.getHostels();
  const featuredHostels = hostels.slice(0, 3);

  // Search state
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (maxRent) params.set('maxRent', maxRent);
    if (selectedFacility) params.set('facility', selectedFacility);
    navigate(`/hostels?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-slate-800">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2200&q=80"
            alt="Hostel Architecture Background"
            className="w-full h-full object-cover object-center opacity-20 scale-105 filter brightness-75 contrast-125"
          />
          {/* Gradient Overlays for readable text and contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-teal-950/50" />
          {/* Subtle glowing ambient spots */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Pilot Launch: Ifite, Awka &bull; Nnamdi Azikiwe University
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-[1.1]">
              Find Your Hostel. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400">
                Protect Your Safety.
              </span>{' '}
              <br />
              Live Better.
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              The premier Nigerian university accommodation platform that combines transparent, verified student hostel discovery with an open system for reporting dangerous building defects and tracking structural repairs.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/hostels"
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2 group"
              >
                <Search className="w-4 h-4" />
                Find a Hostel in Ifite
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/report-hazard"
                className="px-6 py-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/20 border border-red-500/40 transition-all flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report a Building Hazard
              </Link>
            </div>
          </div>

          {/* Quick Search Widget */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 text-slate-900">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Location Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Location (Awka)
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">All Areas in Ifite & Awka</option>
                  <option value="First Gate">First Gate, Ifite</option>
                  <option value="Second Gate">Second Gate, Ifite</option>
                  <option value="Book Foundation">Book Foundation / Miracle</option>
                  <option value="Temp Site">Temp Site / Aroma Link</option>
                  <option value="Seminary">Seminary Road</option>
                </select>
              </div>

              {/* Max Rent */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Max Rent (₦ / Year)
                </label>
                <select
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Any Rent Budget</option>
                  <option value="200000">Up to ₦200,000</option>
                  <option value="300000">Up to ₦300,000</option>
                  <option value="400000">Up to ₦400,000</option>
                  <option value="500000">Up to ₦500,000</option>
                </select>
              </div>

              {/* Priority Utility */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Priority Facility
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Any Facilities</option>
                  <option value="Borehole">Borehole Water</option>
                  <option value="Solar">Solar / Inverter Backup</option>
                  <option value="Generator">Standby Generator</option>
                  <option value="Security">24/7 Security Guard</option>
                  <option value="Prepaid">Pre-paid Meter</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-3 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Search className="w-4 h-4" />
                  Search Hostels
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Safety Disclaimer Banner */}
        <SafetyWarningBanner urgentMode={false} />

        {/* Featured Hostels Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                <Building className="w-3.5 h-3.5" />
                Verified Student Accommodations
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-['Space_Grotesk']">
                Featured Hostels in Ifite, Awka
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Real accommodations near UNIZIK with transparent rent and verified amenities.
              </p>
            </div>
            <Link
              to="/hostels"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 group"
            >
              Browse All Hostels ({hostels.length})
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        </section>

        {/* Building Safety Awareness & Defect Types */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full inline-block">
                Life Safety & Building Health
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk']">
                Recognize Dangerous Building Conditions
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Too many students overlook early warning signs of structural deterioration. HostelSafe empowers you to report hazards so authorized engineers and responsive property managers can act before disaster strikes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-slate-800/70 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Wall & Ceiling Cracks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diagonal shear cracks wider than 3mm or step-cracks along load-bearing pillars indicate differential foundation movement.
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Balconies & Handrails</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Wobbly iron balustrades or deflection in cantilevered corridor slabs can trigger catastrophic falls on upper floors.
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Exposed Live Wiring</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Frayed pumping machine cables, ungrounded junction boxes, or exposed distribution boards near wet student corridors.
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Foundation Drainage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Blocked soakaways and collapsed open gutters erode foundational footing during Anambra’s torrential rainy season.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/report-hazard"
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Submit a Hazard Report Now
              </Link>
              <Link
                to="/building-safety"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
              >
                Learn Safety Guidelines &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
              Clear Transparent Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
              How HostelSafe Works
            </h2>
            <p className="text-sm text-slate-600">
              Connecting students, property managers, and qualified building safety inspectors on one accountable platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Transparent Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by verified facilities—constant borehole water, solar power, security perimeter, and rent in Nigerian Naira (₦). No hidden fees or deceptive descriptions.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Independent inspection badges
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Direct manager enquiry without agents
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Confidential Reporting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spot a crack or broken handrail? Submit photo evidence securely with optional anonymous reporting to protect students from victimization.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Real-time 7-stage status tracking
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Direct notification to property managers
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Qualified Assessment & Repair</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Certified inspectors (COREN/MNSE) audit high-risk claims, and managers log verified repairs with before-and-after photographic evidence.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Permanent audit trail on database
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Technician assignment & deadline tracking
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 border border-slate-800 shadow-2xl">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1800&q=80"
              alt="Community Hostel"
              className="w-full h-full object-cover opacity-20 filter brightness-75 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-slate-950/90 to-sky-950/90" />
          </div>

          <div className="relative space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk']">
              Ready to find safe accommodation or protect your fellow students?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join the community of students and responsible property owners in Ifite, Awka making student living safer every day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Link
                to="/hostels"
                className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg transition-all"
              >
                Explore Available Hostels
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all"
              >
                Register as Manager or Student
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
