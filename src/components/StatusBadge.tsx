import React from 'react';
import { ReportStatus, ReportSeverity, VerificationStatus, AvailabilityStatus } from '../types/database';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Wrench, Eye, ShieldCheck, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs md:text-sm px-2.5 py-1';

  switch (status) {
    case 'Submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <Eye className="w-3.5 h-3.5" />
          Under Review
        </span>
      );
    case 'Inspection Requested':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5" />
          Inspection Requested
        </span>
      );
    case 'Action Required':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          Action Required
        </span>
      );
    case 'Repair in Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 ${sizeClasses}`}>
          <Wrench className="w-3.5 h-3.5 animate-spin" />
          Repair in Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          Closed
        </span>
      );
    default:
      return <span className={`rounded bg-slate-100 text-slate-800 ${sizeClasses}`}>{status}</span>;
  }
};

export const SeverityBadge: React.FC<{ severity: ReportSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'critical_hazard':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white animate-pulse">
          <AlertTriangle className="w-3 h-3" /> Critical Life Hazard
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          High Severity
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Medium Severity
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Low Severity
        </span>
      );
  }
};

export const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  switch (status) {
    case 'independently_inspected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Independently Inspected
        </span>
      );
    case 'manager_verified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-300">
          <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
          Manager Verified
        </span>
      );
    case 'unverified':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          Unverified Listing
        </span>
      );
  }
};

export const AvailabilityBadge: React.FC<{ status: AvailabilityStatus }> = ({ status }) => {
  switch (status) {
    case 'available':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Rooms Available
        </span>
      );
    case 'few_rooms_left':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Only Few Rooms Left
        </span>
      );
    case 'full':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
          Fully Occupied
        </span>
      );
  }
};
