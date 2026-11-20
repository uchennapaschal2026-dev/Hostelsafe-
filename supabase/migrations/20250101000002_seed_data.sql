-- HostelSafe Seed Data
-- Migration 03: Seed data for Ifite, Awka (UNIZIK student community)

-- Demo users profiles (Notice: in Supabase, profiles link to auth.users)
-- This file provides reference seed inserts for development and testing

-- Seed hostels in Ifite, Awka:
INSERT INTO hostels (
    id, manager_id, name, description, location, university, address,
    latitude, longitude, rent_amount, rent_period, room_type, facilities,
    availability_status, verification_status, contact_phone
) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'm1111111-1111-1111-1111-111111111111',
    'Crown Villa Royal Lodge',
    'Modern self-contain apartments located just 3 minutes walk from UNIZIK First Gate. Features 24/7 borehole clean water, dedicated transformer with pre-paid meter, solar powered hallway illumination, gated security guard, and well-paved premises.',
    'First Gate, Ifite, Awka',
    'Nnamdi Azikiwe University (UNIZIK)',
    '14 Chief Ekwueme Street, Off First Gate, Ifite-Awka, Anambra State',
    6.2458, 7.1215,
    320000, 'per year', 'Self-contain',
    '["Borehole Water", "Prepaid Meter", "Solar Security Lighting", "24/7 Security Guard", "Tiled Floors", "Water Heater", "Kitchen Cabinets", "Waste Disposal Bin"]'::jsonb,
    'few_rooms_left', 'manager_verified', '+234 803 456 7890'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'm1111111-1111-1111-1111-111111111111',
    'Peace Heights Lodge',
    'Clean, spacious single rooms with shared modern tiled restrooms (2 students per restroom). Located at Book Foundation junction. Regular water supply pumped twice daily and soundproof standby generator.',
    'Book Foundation, Ifite, Awka',
    'Nnamdi Azikiwe University (UNIZIK)',
    '8 Seminary Road, Near Miracle Junction, Ifite-Awka, Anambra State',
    6.2492, 7.1189,
    180000, 'per year', 'Single Room',
    '["Borehole Water", "Standby Generator", "Fenced & Gated", "Modern Drainage", "Reading Desks", "Refuse Disposal Service"]'::jsonb,
    'available', 'independently_inspected', '+234 803 456 7890'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'm2222222-2222-2222-2222-222222222222',
    'Grace Haven Executive Suites',
    'Premium two-bedroom flat suitable for flatmates, located near UNIZIK Second Gate. Constant water pressure, installed inverter battery backup system, POP ceilings, paved compound, and security CCTV monitoring.',
    'Second Gate, Ifite, Awka',
    'Nnamdi Azikiwe University (UNIZIK)',
    '22 University Way, Behind UNIZIK Second Gate, Awka',
    6.2520, 7.1250,
    450000, 'per year', 'Two-bedroom Flat',
    '["Borehole Water", "Solar Inverter System", "CCTV Cameras", "Perimeter Fence", "POP Ceiling", "Balcony", "Dedicated Parking"]'::jsonb,
    'available', 'manager_verified', '+234 806 112 3344'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'm2222222-2222-2222-2222-222222222222',
    'St. Jude Scholars Lodge',
    'Affordable self-contain units in a quiet study environment near Aroma Junction link road. Regular water distribution, clean compound, active caretakers on site.',
    'Temp Site / Aroma Link, Awka',
    'Nnamdi Azikiwe University (UNIZIK)',
    '5 Okpuno Road, Near Aroma Junction, Awka',
    6.2375, 7.0850,
    240000, 'per year', 'Self-contain',
    '["Borehole Water", "Prepaid Meter", "Day & Night Caretaker", "Iron Security Doors", "Balcony Clothesline"]'::jsonb,
    'few_rooms_left', 'unverified', '+234 802 998 7766'
);
