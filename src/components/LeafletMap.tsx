import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Hostel } from '../types/database';
import { Link } from 'react-router-dom';

interface LeafletMapProps {
  hostels: Hostel[];
  selectedHostelId?: string;
  onSelectHostel?: (hostel: Hostel) => void;
  heightClass?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  hostels,
  selectedHostelId,
  onSelectHostel,
  heightClass = 'h-[400px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Ifite Awka, Anambra State near UNIZIK
      const map = L.map(mapContainerRef.current).setView([6.248, 7.121], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const hostelIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: #0f766e; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold; font-size: 14px;">
          ₦
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -20],
    });

    const activeIcon = L.divIcon({
      className: 'custom-map-marker active',
      html: `
        <div style="background-color: #0284c7; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 12px -2px rgba(0,0,0,0.4); border: 3px solid white; font-weight: 800; font-size: 16px;">
          ★
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -24],
    });

    hostels.forEach((hostel) => {
      if (hostel.latitude && hostel.longitude) {
        const isSelected = hostel.id === selectedHostelId;
        const marker = L.marker([hostel.latitude, hostel.longitude], {
          icon: isSelected ? activeIcon : hostelIcon,
        }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.className = 'text-left p-1 max-w-[220px]';
        popupContent.innerHTML = `
          <div style="font-family: inherit;">
            <img src="${hostel.photos[0] || ''}" alt="${hostel.name}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
            <h5 style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${hostel.name}</h5>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">${hostel.location}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 800; color: #0f766e; font-size: 13px;">₦${hostel.rent_amount.toLocaleString()}</span>
              <a href="/hostels/${hostel.id}" style="color: #0284c7; font-size: 11px; font-weight: 600; text-decoration: underline;">View &rarr;</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectHostel) onSelectHostel(hostel);
        });

        markersRef.current[hostel.id] = marker;

        if (isSelected) {
          map.panTo([hostel.latitude, hostel.longitude], { animate: true });
          marker.openPopup();
        }
      }
    });

    return () => {
      // Cleanup on unmount handled on map container
    };
  }, [hostels, selectedHostelId, onSelectHostel]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow text-xs font-semibold text-slate-700 z-[1000] border border-slate-200 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block animate-ping" />
        Awka & Ifite Student Residential Cluster
      </div>
    </div>
  );
};
