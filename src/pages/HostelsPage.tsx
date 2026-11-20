import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { StorageService } from '../lib/storage';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { HostelCard } from '../components/HostelCard';
import { LeafletMap } from '../components/LeafletMap';
import { SafetyWarningBanner } from '../components/SafetyWarningBanner';
import { Hostel } from '../types/database';
import {
  Search,
  Filter,
  Map,
  Grid,
  Building,
  RotateCcw,
  PlusCircle,
  Droplets,
  Zap,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';

export const HostelsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allHostels = StorageService.getHostels();
  const { addSearch } = useRecentSearches();

  // Filters from query params or state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [maxRentFilter, setMaxRentFilter] = useState(searchParams.get('maxRent') || '');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');

  // Facility checkboxes
  const [waterFilter, setWaterFilter] = useState(searchParams.get('facility') === 'Borehole');
  const [powerFilter, setPowerFilter] = useState(
    searchParams.get('facility') === 'Solar' || searchParams.get('facility') === 'Generator'
  );
  const [securityFilter, setSecurityFilter] = useState(searchParams.get('facility') === 'Security');
  const [prepaidFilter, setPrepaidFilter] = useState(searchParams.get('facility') === 'Prepaid');

  useEffect(() => {
    const parts: string[] = [];
    const params = new URLSearchParams();
    if (locationFilter) {
      parts.push(locationFilter);
      params.set('location', locationFilter);
    }
    if (maxRentFilter) {
      parts.push(`Max ₦${Number(maxRentFilter).toLocaleString()}`);
      params.set('maxRent', maxRentFilter);
    }
    if (roomTypeFilter) parts.push(roomTypeFilter);
    if (searchTerm.trim()) parts.push(`"${searchTerm.trim()}"`);
    if (waterFilter) {
      parts.push('Borehole Water');
      params.set('facility', 'Borehole');
    }
    if (parts.length > 0) {
      const timer = setTimeout(() => {
        addSearch(parts.join(' • '), params.toString());
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [locationFilter, maxRentFilter, roomTypeFilter, searchTerm, waterFilter, addSearch]);

  const filteredHostels = useMemo(() => {
    return allHostels.filter((hostel) => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = hostel.name.toLowerCase().includes(term);
        const matchesDesc = hostel.description.toLowerCase().includes(term);
        const matchesAddress = hostel.address.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesAddress) return false;
      }

      // Location
      if (locationFilter && !hostel.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // Room Type
      if (roomTypeFilter && hostel.room_type !== roomTypeFilter) {
        return false;
      }

      // Max Rent
      if (maxRentFilter && hostel.rent_amount > Number(maxRentFilter)) {
        return false;
      }

      // Verification
      if (verificationFilter && hostel.verification_status !== verificationFilter) {
        return false;
      }

      // Amenities
      if (waterFilter) {
        const hasWater = hostel.facilities.some(
          (f) => f.toLowerCase().includes('water') || f.toLowerCase().includes('borehole')
        );
        if (!hasWater) return false;
      }

      if (powerFilter) {
        const hasPower = hostel.facilities.some(
          (f) => f.toLowerCase().includes('solar') || f.toLowerCase().includes('generator')
        );
        if (!hasPower) return false;
      }

      if (securityFilter) {
        const hasSec = hostel.facilities.some(
          (f) => f.toLowerCase().includes('security') || f.toLowerCase().includes('gate') || f.toLowerCase().includes('fence')
        );
        if (!hasSec) return false;
      }

      if (prepaidFilter) {
        const hasPrep = hostel.facilities.some((f) => f.toLowerCase().includes('prepaid') || f.toLowerCase().includes('meter'));
        if (!hasPrep) return false;
      }

      return true;
    });
  }, [
    allHostels,
    searchTerm,
    locationFilter,
    roomTypeFilter,
    maxRentFilter,
    verificationFilter,
    waterFilter,
    powerFilter,
    securityFilter,
    prepaidFilter,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setRoomTypeFilter('');
    setMaxRentFilter('');
    setVerificationFilter('');
    setWaterFilter(false);
    setPowerFilter(false);
    setSecurityFilter(false);
    setPrepaidFilter(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner with Architectural Background Image */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80"
            alt="Ifite Awka Student Hostels"
            className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-teal-950/80" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
              <Building className="w-3.5 h-3.5" />
              <span>Accommodation Search &bull; Awka, Anambra</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Student Hostels in Ifite
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Compare transparent rents, verified borehole water, power configurations, and structural inspection records.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm p-1 rounded-xl self-start md:self-auto border border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'split' ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Split
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Row 1: Search and Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Hostel name or street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Location Area */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Locations in Ifite</option>
            <option value="First Gate">UNIZIK First Gate</option>
            <option value="Second Gate">UNIZIK Second Gate</option>
            <option value="Book Foundation">Book Foundation / Miracle</option>
            <option value="Temp Site">Temp Site / Aroma Link</option>
            <option value="Seminary">Seminary Road</option>
          </select>

          {/* Room Type */}
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Room Types</option>
            <option value="Self-contain">Self-contain</option>
            <option value="Single Room">Single Room</option>
            <option value="Two-bedroom Flat">Two-bedroom Flat</option>
          </select>

          {/* Max Rent */}
          <select
            value={maxRentFilter}
            onChange={(e) => setMaxRentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">Any Rent Budget</option>
            <option value="200000">Max ₦200,000 / year</option>
            <option value="300000">Max ₦300,000 / year</option>
            <option value="400000">Max ₦400,000 / year</option>
            <option value="500000">Max ₦500,000 / year</option>
          </select>

          {/* Verification Status */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Verification Statuses</option>
            <option value="independently_inspected">Independently Inspected Only</option>
            <option value="manager_verified">Manager Verified</option>
            <option value="unverified">Unverified Claims</option>
          </select>
        </div>

        {/* Row 2: Facility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Facilities:
            </span>

            <button
              onClick={() => setWaterFilter(!waterFilter)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1 font-medium transition-colors ${
                waterFilter
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Droplets className="w-3 h-3" /> Borehole Water
            </button>

            <button
              onClick={() => setPowerFilter(!powerFilter)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1 font-medium transition-colors ${
                powerFilter
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3" /> Solar / Generator Backup
            </button>

            <button
              onClick={() => setSecurityFilter(!securityFilter)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1 font-medium transition-colors ${
                securityFilter
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3 h-3" /> Security Gate & Guard
            </button>

            <button
              onClick={() => setPrepaidFilter(!prepaidFilter)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1 font-medium transition-colors ${
                prepaidFilter
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3" /> Pre-paid Meter
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
            <span className="text-slate-400 font-bold">
              {filteredHostels.length} {filteredHostels.length === 1 ? 'hostel' : 'hostels'} found
            </span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <LeafletMap hostels={filteredHostels} heightClass="h-[600px]" />
          <p className="text-xs text-slate-500 text-center">
            Click any pin marker to view rent, photo, and details.
          </p>
        </div>
      ) : viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {filteredHostels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredHostels.map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
          <div className="lg:col-span-5 sticky top-24">
            <LeafletMap hostels={filteredHostels} heightClass="h-[550px]" />
          </div>
        </div>
      ) : (
        <div>
          {filteredHostels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </div>
      )}

      {/* Verification Notice */}
      <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3 border border-slate-200">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Verification Integrity:</strong> Listings marked as{' '}
          <span className="font-semibold text-emerald-800">Independently Inspected</span> have undergone a documented site visit by a registered building engineer. Listings marked as{' '}
          <span className="font-semibold text-sky-800">Manager Verified</span> contain claims submitted by registered hostel managers. Always inspect the premises personally or review safety reports before paying rent.
        </p>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Building className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-lg">No Hostels Match Your Filters</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          We strictly do not invent fake property listings. If your search criteria yielded zero results, consider adjusting the rent budget or area filters.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          Clear All Filters
        </button>
        <Link
          to="/register"
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 inline-flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Are you a Manager? Register Your Hostel
        </Link>
      </div>
    </div>
  );
};
