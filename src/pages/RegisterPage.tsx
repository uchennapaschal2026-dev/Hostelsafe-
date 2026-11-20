import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/database';
import {
  ShieldAlert,
  User,
  Building2,
  ShieldCheck,
  CheckCircle,
  Mail,
  Lock,
  Phone,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [credentials, setCredentials] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const success = await register(fullName, email, role, phone, credentials);
      if (success) {
        if (role === 'manager') navigate('/dashboard/manager');
        else if (role === 'inspector') navigate('/dashboard/inspector');
        else navigate('/dashboard/student');
      } else {
        setErrorMsg('Registration failed. Please check your information.');
      }
    } catch {
      setErrorMsg('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background Architectural Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2200&q=80"
          alt="Hostel Backdrop"
          className="w-full h-full object-cover opacity-10 filter grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-50/90 to-slate-50" />
      </div>

      <div className="relative max-w-lg w-full space-y-8 z-10">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Create Your HostelSafe Account
        </h1>
        <p className="text-xs text-slate-500">
          Join the Ifite Awka student accommodation and building safety network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
            Choose Your Account Role *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'student'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1 text-teal-600" />
              Student
            </button>

            <button
              type="button"
              onClick={() => setRole('manager')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'manager'
                  ? 'border-sky-600 bg-sky-50/70 text-sky-900 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-sky-600" />
              Hostel Manager
            </button>

            <button
              type="button"
              onClick={() => setRole('inspector')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'inspector'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              Inspector (COREN)
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            {role === 'student' && 'Browse verified hostels, bookmark properties, and submit safety reports.'}
            {role === 'manager' && 'List accommodations in Ifite, receive maintenance tickets, and assign repairs.'}
            {role === 'inspector' && 'Conduct physical building safety audits. Requires COREN/MNSE verification.'}
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
          <input
            type="text"
            required
            placeholder="e.g., Emeka Paschal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="you@domain.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Inspector Credentials (conditional) */}
        {role === 'inspector' && (
          <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <label className="font-bold text-emerald-950 block">
              Professional Engineering Credentials (COREN / MNSE) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., COREN Reg. R12345 | MNSE Civil Engineering"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-emerald-800">
              Note: Full audit permissions are activated after administrator manual credential verification.
            </p>
          </div>
        )}

        {/* Manager Organization (conditional) */}
        {role === 'manager' && (
          <div>
            <label className="font-bold text-slate-700 block mb-1">Property Firm / Estate Name</label>
            <input
              type="text"
              placeholder="e.g., Nwankwo Estates & Lodges Awka"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        )}

        {/* Password */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Password *</label>
          <input
            type="password"
            required
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-[11px] text-slate-500 text-center pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-teal-700 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
};
