import React from 'react';
import { Link } from 'react-router-dom';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  Search,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  FileCheck,
  Building2,
  Users,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      title: '1. Discover & Compare Real Hostels',
      role: 'For Students',
      desc: 'Browse verified student accommodations in Ifite, Awka near UNIZIK. Filter by rent budget in Nigerian Naira (₦), constant borehole water, dedicated transformers, and perimeter security. See realistic photographs and verified landlord contact info without exploitation by unverified middleman agents.',
      badge: 'Transparent Accommodation',
    },
    {
      title: '2. Confidential Hazard Reporting',
      role: 'For Students & Residents',
      desc: 'Spot a dangerous crack, loose handrail on a 3rd-floor balcony, or exposed wiring near the borehole shed? Submit a report with photo evidence in 60 seconds. Choose confidential/anonymous mode to protect yourself from landlord intimidation or retaliation.',
      badge: 'Whistleblower Protection',
    },
    {
      title: '3. Manager Notification & Repair Dispatch',
      role: 'For Hostel Managers',
      desc: 'Hostel managers receive instant alerts in their dashboard with precise defect location. They can assign registered local technicians (welders, electricians, plumbers), set target completion dates, and document corrective actions with before-and-after photographs.',
      badge: 'Accountable Maintenance',
    },
    {
      title: '4. Qualified Engineering Oversight',
      role: 'For Licensed Inspectors',
      desc: 'For high-risk defects, COREN and MNSE registered structural engineers conduct on-site physical audits, measure crack displacement, test concrete integrity, and record binding engineering recommendations that cannot be altered or deleted by managers.',
      badge: 'COREN Professional Standards',
    },
  ];

  const statuses = [
    { name: 'Submitted', desc: 'Ticket logged by student and placed in queue.' },
    { name: 'Under Review', desc: 'Hostel manager or compliance team is reviewing the severity.' },
    { name: 'Inspection Requested', desc: 'Assigned to a licensed civil/structural engineer for physical assessment.' },
    { name: 'Action Required', desc: 'Formal engineering findings mandate immediate remedial work.' },
    { name: 'Repair in Progress', desc: 'Contracted technician is on-site performing corrective repairs.' },
    { name: 'Resolved', desc: 'Repairs completed and validated with photographic documentation.' },
    { name: 'Closed', desc: 'Ticket archived into permanent building safety history log.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          The HostelSafe System
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          How HostelSafe Protects Students & Enhances Accommodations
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From finding affordable rooms in Ifite Awka to resolving critical building defects, our closed-loop platform unites students, managers, and registered engineers.
        </p>
      </div>

      {/* Safety Notice */}
      <SafetyWarningBanner urgentMode={false} />

      {/* 4 Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] text-center">
          The 4 Pillars of the Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3 hover:border-teal-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                  {step.role}
                </span>
                <span className="text-xs font-bold text-slate-400">Pillar 0{idx + 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Stage Workflow Explanation */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Lifecycle & Accountability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk']">
            The 7-Stage Maintenance Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Every defect ticket progresses through transparent, verifiable milestones:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <h4 className="font-bold text-white text-sm">{st.name}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Tiers */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
          Understanding Listing Verification Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-900 text-sm block">1. Unverified</span>
            <p className="text-slate-600 leading-relaxed">
              Standard listing submitted without official physical or documentary confirmation. Students must exercise standard due diligence.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
            <span className="font-bold text-sky-900 text-sm block">2. Manager Verified</span>
            <p className="text-slate-600 leading-relaxed">
              The registered property manager has verified land titles, contact details, and current room availability status.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 text-sm block">3. Independently Inspected</span>
            <p className="text-slate-600 leading-relaxed">
              A certified civil/structural engineer (COREN/MNSE) has visited the premises and logged an official baseline structural audit.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/hostels"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow transition-colors"
        >
          Browse Verified Accommodations
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
