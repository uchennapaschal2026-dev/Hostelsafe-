import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { StorageService } from '../lib/storage';
import { Hostel, MaintenanceReport, Inspection } from '../types/database';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const HostelService = {
  validateFile(file: File, allowPdf = false): FileValidationResult {
    const allowed = allowPdf ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowed.includes(file.type)) {
      return {
        valid: false,
        error: allowPdf
          ? 'Unsupported file type. Please upload a PDF, JPG, or PNG file.'
          : 'Unsupported image format. Please upload JPG, PNG, or WebP photos.',
      };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: 'File exceeds the 10 MB size limit. Please compress or choose a smaller file.',
      };
    }
    return { valid: true };
  },

  async uploadFile(
    file: File,
    bucket: 'hostel-photos' | 'defect-reports' | 'inspection-docs',
    folder: string
  ): Promise<{ url?: string; error?: string }> {
    const check = this.validateFile(file, bucket === 'inspection-docs');
    if (!check.valid) {
      return { error: check.error };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${folder}/${Date.now()}_${sanitizedName}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: false });

        if (uploadError) {
          return { error: uploadError.message };
        }

        if (bucket === 'hostel-photos') {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          return { url: data.publicUrl };
        }

        // Private buckets use short-lived signed URLs
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 3600);

        if (signedError || !signedData?.signedUrl) {
          return { error: signedError?.message || 'Failed to generate secure document link.' };
        }
        return { url: signedData.signedUrl };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : 'Unexpected upload error.',
        };
      }
    }

    // Local persistence fallback when Supabase environment variables are not configured
    return { url: URL.createObjectURL(file) };
  },

  async syncHostel(hostel: Hostel): Promise<Hostel> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('hostels').upsert({
          id: hostel.id,
          manager_id: hostel.manager_id,
          name: hostel.name,
          description: hostel.description,
          location: hostel.location,
          university: hostel.university,
          address: hostel.address,
          latitude: hostel.latitude,
          longitude: hostel.longitude,
          rent_amount: hostel.rent_amount,
          rent_period: hostel.rent_period,
          room_type: hostel.room_type,
          facilities: hostel.facilities,
          availability_status: hostel.availability_status,
          verification_status: hostel.verification_status,
          contact_phone: hostel.contact_phone,
        });
      } catch (err) {
        console.warn('Supabase hostel sync skipped/failed:', err);
      }
    }
    return StorageService.saveHostel(hostel);
  },

  async syncReport(report: MaintenanceReport, isNew = false): Promise<MaintenanceReport> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('maintenance_reports').upsert({
          id: report.id,
          hostel_id: report.hostel_id,
          reporter_id: report.reporter_id || null,
          category: report.category,
          description: report.description,
          location_details: report.location_details || null,
          severity: report.severity,
          status: report.status,
          is_anonymous: report.is_anonymous,
          assigned_to: report.assigned_to || null,
          assigned_technician_name: report.assigned_technician_name || null,
          target_date: report.target_date || null,
          progress_notes: report.progress_notes || null,
          resolved_at: report.resolved_at || null,
        });
      } catch (err) {
        console.warn('Supabase report sync skipped/failed:', err);
      }
    }
    return isNew ? StorageService.createReport(report) : StorageService.updateReport(report);
  },

  async syncInspection(inspection: Inspection): Promise<Inspection> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inspections').upsert({
          id: inspection.id,
          hostel_id: inspection.hostel_id,
          inspector_id: inspection.inspector_id,
          report_id: inspection.report_id || null,
          inspection_type: inspection.inspection_type,
          scheduled_at: inspection.scheduled_at || null,
          completed_at: inspection.completed_at || null,
          findings: inspection.findings,
          recommendations: inspection.recommendations,
          hazards_identified: inspection.hazards_identified,
          structural_risk_level: inspection.structural_risk_level,
          report_storage_path: inspection.report_storage_path || null,
          status: inspection.status,
        });
      } catch (err) {
        console.warn('Supabase inspection sync skipped/failed:', err);
      }
    }
    return StorageService.saveInspection(inspection);
  },
};
