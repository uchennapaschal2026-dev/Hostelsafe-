import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Mail, Phone, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-sm">
      {/* Safety Notice Strip */}
      <div className="bg-teal-950/60 border-b border-teal-900/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider bg-teal-800/80 px-2 py-0.5 rounded text-[11px] text-teal-100">
              Community Mandate
            </span>
            <span>Protecting student lives through transparent accommodation discovery and structural defect accountability.</span>
          </div>
          <div className="flex items-center gap-4 text-teal-300">
            <span>Anambra Safety Desk: +234 803 456 7890</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Emergency Response: 112</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
                Hostel<span className="text-teal-400">Safe</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              HostelSafe is a specialized student accommodation verification and structural safety reporting platform launched in Ifite, Awka (serving Nnamdi Azikiwe University). We empower students to find vetted accommodations, report dangerous building defects, and track certified repairs.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Launch Hub: First Gate, Ifite-Awka, Anambra State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@hostelsafe.ng / compliance@hostelsafe.ng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/hostels" className="hover:text-teal-400 transition-colors">
                  Find Hostels in Ifite
                </Link>
              </li>
              <li>
                <Link to="/report-hazard" className="hover:text-teal-400 transition-colors">
                  Report Building Hazard
                </Link>
              </li>
              <li>
                <Link to="/building-safety" className="hover:text-teal-400 transition-colors">
                  Building Safety Education
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">
                  How Verification Works
                </Link>
              </li>
              <li>
                <Link to="/dashboard/student" className="hover:text-teal-400 transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Stakeholders</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/dashboard/manager" className="hover:text-teal-400 transition-colors">
                  Hostel Manager Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/inspector" className="hover:text-teal-400 transition-colors">
                  Qualified Inspector Desk
                </Link>
              </li>
              <li>
                <Link to="/dashboard/admin" className="hover:text-teal-400 transition-colors">
                  Compliance Admin Console
                </Link>
              </li>
              <li>
                <a
                  href="https://coren.gov.ng"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1"
                >
                  COREN Nigeria <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://unizik.edu.ng"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1"
                >
                  UNIZIK Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company & Legal</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About HostelSafe
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact & Field Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy & Whistleblower Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  Terms & Safety Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Structural Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Structural Safety Disclaimer:</strong> Information on HostelSafe includes reports from resident students, declarations from property managers, and independent inspection logs. No user report, photo, or online review certifies a building as structurally safe. Formal compliance requires physical engineering assessment. Always evacuate and contact emergency services if you suspect an imminent structural failure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px]">
            <p>&copy; {new Date().getFullYear()} HostelSafe Technologies Nigeria. All rights reserved.</p>
            <p className="flex items-center gap-1 text-slate-400">
              Built with care for Nigerian University Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
