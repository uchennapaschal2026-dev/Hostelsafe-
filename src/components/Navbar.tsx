import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/database';
import {
  ShieldAlert,
  Search,
  Building2,
  AlertTriangle,
  HelpCircle,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, role, switchRole, logout, unreadCount, isLiveSupabase } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleDropdownOpen(false);
    // Route to the dashboard of that role
    if (newRole === 'student') navigate('/dashboard/student');
    else if (newRole === 'manager') navigate('/dashboard/manager');
    else if (newRole === 'inspector') navigate('/dashboard/inspector');
    else if (newRole === 'admin') navigate('/dashboard/admin');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Hostels', path: '/hostels', icon: Search },
    { label: 'Building Safety', path: '/building-safety', icon: ShieldCheck },
    { label: 'Report a Problem', path: '/report-hazard', icon: AlertTriangle, highlight: true },
    { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  ];

  const getDashboardPath = () => {
    switch (role) {
      case 'manager':
        return '/dashboard/manager';
      case 'inspector':
        return '/dashboard/inspector';
      case 'admin':
        return '/dashboard/admin';
      case 'student':
      default:
        return '/dashboard/student';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top micro-bar: Environment / Launch Hub notice */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 py-1 px-4 text-[11px] text-slate-300 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Launch Hub: Ifite, Awka &bull; Nnamdi Azikiwe University (UNIZIK)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Database:</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  isLiveSupabase
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}
              >
                {isLiveSupabase ? 'Supabase Live' : 'Supabase Ready (Local Persistence)'}
              </span>
            </div>

            {/* Quick Role Tester Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded font-medium text-teal-200 transition-colors"
                title="Switch role to test student, manager, inspector, or admin features"
              >
                <span>Switch Role: <strong>{role.toUpperCase()}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-900 rounded-lg shadow-xl border border-slate-700 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 ${
                      role === 'student' ? 'text-teal-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Student (Chidimma)
                  </button>
                  <button
                    onClick={() => handleRoleChange('manager')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 ${
                      role === 'manager' ? 'text-teal-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Hostel Manager (Chief Emeka)
                  </button>
                  <button
                    onClick={() => handleRoleChange('inspector')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 ${
                      role === 'inspector' ? 'text-teal-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Inspector (Engr. Adeleke)
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 ${
                      role === 'admin' ? 'text-teal-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> System Admin (Paschal)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 font-['Space_Grotesk']">
                Hostel<span className="text-teal-400">Safe</span>
              </span>
              <span className="block text-[10px] text-slate-400 -mt-1 tracking-wider uppercase">
                Accommodation & Building Safety
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  link.highlight
                    ? `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40'
                      }`
                    : `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-teal-300 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* Notification Bell */}
                <Link
                  to={getDashboardPath()}
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Shortcut */}
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {role === 'student' && 'My Student Portal'}
                  {role === 'manager' && 'Manager Dashboard'}
                  {role === 'inspector' && 'Inspector Desk'}
                  {role === 'admin' && 'Admin Console'}
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center font-bold text-xs text-white uppercase">
                      {currentUser.full_name.slice(0, 2)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-bold text-white text-sm line-clamp-1">{currentUser.full_name}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-1">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300">
                          {currentUser.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-200 hover:bg-slate-800"
                      >
                        Dashboard & Activity
                      </Link>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-base font-medium ${
                    link.highlight
                      ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/30'
                      : isActive
                      ? 'bg-slate-800 text-teal-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {currentUser ? (
              <>
                <div className="px-3 py-2 bg-slate-800/60 rounded-lg">
                  <p className="font-bold text-white text-sm">{currentUser.full_name}</p>
                  <p className="text-xs text-teal-400 uppercase font-semibold">{currentUser.role}</p>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white font-semibold text-sm"
                >
                  Go to {currentUser.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg border border-slate-700 text-slate-200 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
