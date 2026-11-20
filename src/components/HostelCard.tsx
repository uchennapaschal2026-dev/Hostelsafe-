import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hostel } from '../types/database';
import { VerificationBadge, AvailabilityBadge } from './StatusBadge';
import { Bookmark, MapPin, Droplets, Zap, Shield, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

interface HostelCardProps {
  hostel: Hostel;
  isSaved?: boolean;
  onBookmarkChange?: () => void;
}

export const HostelCard: React.FC<HostelCardProps> = ({ hostel, isSaved: initialSaved, onBookmarkChange }) => {
  const { currentUser } = useAuth();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(() => {
    if (initialSaved !== undefined) return initialSaved;
    if (!currentUser) return false;
    return StorageService.getSavedHostelIds(currentUser.id).includes(hostel.id);
  });

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % hostel.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + hostel.photos.length) % hostel.photos.length);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    const newState = StorageService.toggleSavedHostel(currentUser.id, hostel.id);
    setIsSaved(newState);
    if (onBookmarkChange) onBookmarkChange();
  };

  // Extract facility highlights
  const hasBorehole = hostel.facilities.some((f) => f.toLowerCase().includes('water') || f.toLowerCase().includes('borehole'));
  const hasSolarOrGen = hostel.facilities.some((f) => f.toLowerCase().includes('solar') || f.toLowerCase().includes('generator') || f.toLowerCase().includes('prepaid'));
  const hasSecurity = hostel.facilities.some((f) => f.toLowerCase().includes('security') || f.toLowerCase().includes('fence') || f.toLowerCase().includes('gate'));

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-teal-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Carousel / Preview */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={hostel.photos[photoIndex] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'}
          alt={`${hostel.name} view ${photoIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <VerificationBadge status={hostel.verification_status} />
          </div>

          <button
            onClick={handleBookmark}
            title={isSaved ? 'Remove bookmark' : 'Save hostel'}
            aria-label="Bookmark hostel"
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all shadow ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Photo Navigation dots & arrows */}
        {hostel.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
              {hostel.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === photoIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Rent & Room Type Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-teal-300 block">
              {hostel.room_type}
            </span>
            <span className="text-2xl font-bold tracking-tight">
              ₦{hostel.rent_amount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-300 ml-1">/{hostel.rent_period.replace('per ', '')}</span>
          </div>

          <AvailabilityBadge status={hostel.availability_status} />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-700 transition-colors line-clamp-1">
              {hostel.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="line-clamp-1">{hostel.location}</span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {hostel.description}
          </p>
        </div>

        {/* Key Amenities row */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
            {hasBorehole && (
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium" title="Clean Borehole Water">
                <Droplets className="w-3.5 h-3.5 text-sky-600" /> Water
              </span>
            )}
            {hasSolarOrGen && (
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium" title="Dedicated Power / Solar / Gen">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Power
              </span>
            )}
            {hasSecurity && (
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium" title="Security Gate / Fence">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Security
              </span>
            )}
            <span className="text-slate-400 ml-auto text-[11px]">
              +{hostel.facilities.length - 2} more features
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Link
            to={`/hostels/${hostel.id}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            View Hostel Details
          </Link>
        </div>
      </div>
    </div>
  );
};
