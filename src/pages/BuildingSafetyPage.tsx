import React from 'react';
import { Link } from 'react-router-dom';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import {
  ShieldAlert,
  AlertTriangle,
  Building,
  Zap,
  Droplets,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Scale,
  FileText,
} from 'lucide-react';

export const BuildingSafetyPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner with Background Image */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=2000&q=80"
            alt="Structural Engineering Architecture"
            className="w-full h-full object-cover opacity-20 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30 inline-block">
            Public Safety Awareness & Guidelines
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
            Hostel Building Safety & Hazard Identification
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Understanding building health protects student lives. Learn how to distinguish harmless hairline plaster shrinkage from dangerous structural shear fractures and critical electrical hazards.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      {/* Official Disclaimer */}
      <SafetyWarningBanner urgentMode={false} />

      {/* Guide 1: Understanding Cracks */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. Structural Cracks vs. Plaster Shrinkage
            </h2>
            <p className="text-xs text-slate-500">How to assess wall and ceiling fractures</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-700" /> Plaster Shrinkage (Non-Structural)
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600 leading-relaxed">
              <li>Hairline cracks less than 1.5mm in width.</li>
              <li>Superficial spiderweb appearance on painted cement plaster.</li>
              <li>Does not penetrate through masonry blocks or concrete beams.</li>
              <li>Does not widen or alter position over consecutive months.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
            <h3 className="font-bold text-red-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Dangerous Structural Shear Cracks
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-700 leading-relaxed">
              <li>Diagonal or stepped 45-degree cracks wider than 3mm.</li>
              <li>Visible daylight or moisture seeping directly through the fracture.</li>
              <li>Horizontal fissures along the joint between column heads and floor slabs.</li>
              <li>Sticking doors and window frames caused by shifting foundation settlement.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Guide 2: Balconies, Stairs & Corridors */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. Cantilever Balconies, Stairs & Handrails
            </h2>
            <p className="text-xs text-slate-500">Preventing catastrophic fall hazards in multi-story lodges</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Cantilever balconies in student hostels often bear intense dynamic load during gatherings. Look out for:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Rebar Corrosion (Spalling)</h4>
            <p className="text-slate-600 leading-relaxed">
              Chunks of concrete falling off the underside of balcony slabs, exposing brown rusted iron rods.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Loose Iron Balustrades</h4>
            <p className="text-slate-600 leading-relaxed">
              Handrails where base anchor bolts have rusted away or cracked the coping edge masonry.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Staircase Joint Separation</h4>
            <p className="text-slate-600 leading-relaxed">
              Cracking where the concrete flight joins the upper landing slab, signaling structural detachment.
            </p>
          </div>
        </div>
      </section>

      {/* Guide 3: Electrical & Water Danger */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. Electrical Hazards & Moisture Interaction
            </h2>
            <p className="text-xs text-slate-500">Preventing electrocution and electrical fire outbreaks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">Borehole Pumping Shed Wiring</h4>
            <p className="leading-relaxed text-slate-600">
              Pumping machines operating with exposed joint wires wrapped only in brittle cellophane or insulation tape near damp grounds create high electrocution risk for students drawing water.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">Ceiling Water Ingress on Distribution Boards</h4>
            <p className="leading-relaxed text-slate-600">
              Roof leaks soaking into main distribution boards or pre-paid meter boxes. Immediately switch off main breakers from an isolated dry position if sparking occurs.
            </p>
          </div>
        </div>
      </section>

      {/* Student Rights & Legal Protections */}
      <section className="bg-teal-950 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold font-['Space_Grotesk']">
            Tenant Rights & Safety Mandates in Anambra State
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Under Nigerian tenancy and property laws, property managers and landlords have an implied covenant of quiet enjoyment and habitability. Landlords are legally required to maintain structural soundness, safe electrical installations, and sanitary wastewater disposal.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <Link
            to="/report-hazard"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-colors"
          >
            File a Safety Report
          </Link>
          <a
            href="tel:112"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Emergency Contact: 112
          </a>
        </div>
      </section>
      </div>
    </div>
  );
};
