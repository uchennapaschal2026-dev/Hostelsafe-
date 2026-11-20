import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert } from 'lucide-react';

interface SafetyWarningBannerProps {
  urgentMode?: boolean;
}

export const SafetyWarningBanner: React.FC<SafetyWarningBannerProps> = ({ urgentMode = false }) => {
  return (
    <div
      className={`rounded-xl p-4 md:p-5 border transition-all ${
        urgentMode
          ? 'bg-red-50 border-red-300 text-red-950 shadow-sm'
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            urgentMode ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          {urgentMode ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-base tracking-tight text-slate-900">
              {urgentMode ? 'Emergency Building Hazard Notice' : 'Official Structural Safety Disclaimer'}
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-white/80 border border-slate-300 text-slate-700">
              Compliance Standard
            </span>
          </div>

          <p className="text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Important Legal Notice:</strong> A photograph, resident report, automated analysis, or hostel manager statement <span className="underline decoration-red-500 font-semibold">cannot certify a building as structurally safe</span>. Comprehensive safety requires formal on-site structural auditing by licensed civil/structural engineers registered with COREN and the Nigerian Society of Engineers (NSE).
          </p>

          {urgentMode && (
            <div className="pt-2 mt-2 border-t border-red-200/80 flex flex-wrap items-center gap-3 text-xs font-semibold text-red-900">
              <span className="flex items-center gap-1.5 text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Active wall rupture or live wires? Evacuate the affected area immediately!
              </span>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call Nigeria Emergency: 112
              </a>
              <span className="text-slate-600">Anambra Fire & Safety Service: +234 803 333 4455</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
