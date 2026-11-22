import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

// Lazy-loaded pages for optimal Netlify production bundle splitting
const HostelsPage = lazy(() => import('./pages/HostelsPage').then((m) => ({ default: m.HostelsPage })));
const HostelDetailPage = lazy(() => import('./pages/HostelDetailPage').then((m) => ({ default: m.HostelDetailPage })));
const ReportHazardPage = lazy(() => import('./pages/ReportHazardPage').then((m) => ({ default: m.ReportHazardPage })));
const BuildingSafetyPage = lazy(() => import('./pages/BuildingSafetyPage').then((m) => ({ default: m.BuildingSafetyPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard })));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard').then((m) => ({ default: m.ManagerDashboard })));
const InspectorDashboard = lazy(() => import('./pages/InspectorDashboard').then((m) => ({ default: m.InspectorDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AboutPage = lazy(() => import('./pages/LegalAndInfoPages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/LegalAndInfoPages').then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/LegalAndInfoPages').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/LegalAndInfoPages').then((m) => ({ default: m.TermsPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
      <span className="text-xs font-medium tracking-wide">Loading HostelSafe...</span>
    </div>
  </div>
);

interface AppErrorBoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HostelSafe failed to render:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900">
          <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold">HostelSafe couldn’t load</h1>
            <p className="mt-3 text-slate-600">A browser error stopped the page from rendering. Reload to try again. If it keeps happening, open your browser console and share the error below.</p>
            <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-red-700">{this.state.error.message}</pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
            >
              Reload HostelSafe
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hostels" element={<HostelsPage />} />
                <Route path="/hostels/:id" element={<HostelDetailPage />} />
                <Route path="/report-hazard" element={<ReportHazardPage />} />
                <Route path="/building-safety" element={<BuildingSafetyPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                <Route path="/dashboard/inspector" element={<InspectorDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
