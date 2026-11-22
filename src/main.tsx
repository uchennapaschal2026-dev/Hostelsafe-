import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// AI Studio previews and browser storage can retain an empty hostel list from an
// earlier run. Remove only an empty/invalid cache so storage.ts can reseed its
// built-in demo listings on the next read; preserve all non-empty user data.
try {
  const storedHostels = localStorage.getItem('hostelsafe_hostels');
  if (storedHostels !== null) {
    const parsedHostels: unknown = JSON.parse(storedHostels);
    if (!Array.isArray(parsedHostels) || parsedHostels.length === 0) {
      localStorage.removeItem('hostelsafe_hostels');
    }
  }
} catch {
  try {
    localStorage.removeItem('hostelsafe_hostels');
  } catch {
    // Storage may be disabled in a restricted preview; the app can still start.
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('HostelSafe could not start: the #root element is missing from index.html.');
}

createRoot(rootElement).render(<App />);
