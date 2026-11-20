import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Lock,
  Scale,
  Building2,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
        About HostelSafe
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk']">
        Making Nigerian Student Housing Transparent & Structurally Safe
      </h1>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
        HostelSafe launched in Ifite, Awka (serving Nnamdi Azikiwe University — UNIZIK) with a clear civic mission: help students find honest, affordable rooms while ensuring dangerous building defects are never ignored.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2">
        <Building2 className="w-6 h-6 text-teal-600" />
        <h3 className="font-bold text-slate-900 text-base">Direct Property Access</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Eliminate inflated agent fees by connecting students directly with registered hostel managers and verified utility records.
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2">
        <ShieldCheck className="w-6 h-6 text-sky-600" />
        <h3 className="font-bold text-slate-900 text-base">Engineering Accountability</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Partnering with COREN and MNSE registered civil engineers to log permanent, tamper-resistant structural inspections.
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2">
        <Users className="w-6 h-6 text-emerald-600" />
        <h3 className="font-bold text-slate-900 text-base">Built to Scale</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Designed in Anambra State with a modular architecture ready to expand across university hubs nationwide.
        </p>
      </div>
    </div>

    <SafetyWarningBanner urgentMode={false} />

    <div className="flex flex-wrap gap-3">
      <Link
        to="/hostels"
        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
      >
        Explore Ifite Hostels
      </Link>
      <Link
        to="/contact"
        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
      >
        Contact Compliance Desk
      </Link>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Contact & Support
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Reach the HostelSafe Safety & Support Desk
        </h1>
        <p className="text-sm text-slate-600">
          Questions about listing verification, COREN inspector onboarding, or urgent hostel compliance? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-6 space-y-5 text-xs">
          <h3 className="font-bold text-base text-teal-400">Awka Field Office</h3>
          <div className="space-y-3 text-slate-300">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>First Gate Corridor, Ifite-Awka, Anambra State, Nigeria</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>support@hostelsafe.ng</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <span>+234 803 456 7890</span>
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            For life-threatening structural collapses or live electrical sparks, call Nigeria Emergency <strong>112</strong> immediately and evacuate the building.
          </div>
        </div>

        <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Message Recorded</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, {name}. Our Ifite compliance team has logged your inquiry ({topic}) and will follow up at {email}.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="text-xs font-bold text-teal-700 underline"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                >
                  <option value="general">General Student Inquiry</option>
                  <option value="manager_onboarding">Hostel Manager Verification</option>
                  <option value="inspector_application">COREN Inspector Credential Application</option>
                  <option value="abuse_report">Report Misleading Listing</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
      <Lock className="w-4 h-4" /> Data Protection & Whistleblower Confidentiality
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
      Privacy Policy
    </h1>
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">1. Student Reporter & Whistleblower Protection</h2>
        <p>
          When a student selects Confidential / Anonymous reporting on a building defect, HostelSafe omits the student&apos;s name, email, and phone number from hostel manager views. Access to restricted defect evidence and inspection documents is governed by Row Level Security (RLS) policies and signed URLs.
        </p>
      </section>
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">2. Information Collected</h2>
        <p>
          We collect account registration details (name, email, phone, and optional COREN credentials for inspectors), hostel listing details, maintenance photographs, and booking enquiries strictly to operate accommodation discovery and building safety tracking.
        </p>
      </section>
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">3. Contact & Data Requests</h2>
        <p>
          To request correction or removal of personal profile data, contact <strong>compliance@hostelsafe.ng</strong>. Note that official building safety audit logs and resolved structural inspection records are preserved for public safety integrity.
        </p>
      </section>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
      <Scale className="w-4 h-4" /> Platform Governance & Legal Terms
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
      Terms of Service & Safety Disclaimer
    </h1>
    <SafetyWarningBanner urgentMode={false} />
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">1. Listing Accuracy & Verification Tiers</h2>
        <p>
          Hostel managers are legally responsible for the accuracy of rent amounts, room availability, and utility claims. HostelSafe clearly distinguishes manager-provided statements from independent engineering inspection records.
        </p>
      </section>
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">2. No Implied Structural Certification</h2>
        <p>
          Nothing on HostelSafe — including user-uploaded photographs, severity indicators, manager status updates, or listing badges — certifies any structure as permanently safe. Only an on-site evaluation by a licensed COREN/MNSE structural engineer constitutes professional assessment, subject to the scope and date of that inspection.
        </p>
      </section>
      <section className="space-y-1.5">
        <h2 className="font-bold text-slate-900 text-base">3. Role & Access Integrity</h2>
        <p>
          Users may not misrepresent property ownership, falsify maintenance resolutions, or alter official engineering inspection findings. Administrators reserve the right to suspend listings and log moderation events in the platform audit trail.
        </p>
      </section>
    </div>
  </div>
);
