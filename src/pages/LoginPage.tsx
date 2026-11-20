import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/database';
import { ShieldAlert, User, Building2, ShieldCheck, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const success = await login(email);
      if (success) {
        navigate('/hostels');
      } else {
        setErrorMsg('Sign in failed. Please verify credentials.');
      }
    } catch {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'student') navigate('/dashboard/student');
    else if (role === 'manager') navigate('/dashboard/manager');
    else if (role === 'inspector') navigate('/dashboard/inspector');
    else if (role === 'admin') navigate('/dashboard/admin');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background Architectural Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2200&q=80"
          alt="Hostel Backdrop"
          className="w-full h-full object-cover opacity-10 filter grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-50/90 to-slate-50" />
      </div>

      <div className="relative max-w-md w-full space-y-8 z-10">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Sign In to HostelSafe
        </h1>
        <p className="text-xs text-slate-500">
          Access your student portal, manage hostel listings, or log structural audits
        </p>
      </div>

      {/* Quick 1-Click Role Switcher Demo Cards */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
            Instant Test Logins (Demo Profiles)
          </span>
          <span className="text-[10px] text-slate-400">No password needed</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemoLogin('student')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-teal-600/30 border border-slate-700 hover:border-teal-500 text-left transition-colors space-y-0.5"
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" /> Student
            </div>
            <p className="text-[10px] text-slate-400">Chidimma (UNIZIK)</p>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('manager')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600/30 border border-slate-700 hover:border-sky-500 text-left transition-colors space-y-0.5"
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" /> Manager
            </div>
            <p className="text-[10px] text-slate-400">Chief Emeka (Ifite)</p>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('inspector')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 text-left transition-colors space-y-0.5"
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Inspector
            </div>
            <p className="text-[10px] text-slate-400">Engr. Adeleke (COREN)</p>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500 text-left transition-colors space-y-0.5"
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Admin
            </div>
            <p className="text-[10px] text-slate-400">Paschal (Compliance)</p>
          </button>
        </div>
      </div>

      {/* Standard Email Login */}
      <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              required
              placeholder="student@hostelsafe.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : 'Sign In with Email'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-[11px] text-slate-500 text-center pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-700 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
};
