export type VisitorEntryType = 'guest' | 'delivery';

export interface VisitorPass {
  id: number;
  unit_id: number;
  guest_name: string;
  guest_phone: string;
  pass_code: string;
  valid_from: string;
  valid_until: string;
  max_entries: number;
  entries_used: number;
  status: string;
}

export interface VisitorPassPayload {
  unit_id: number;
  guest_name: string;
  guest_phone: string;
  valid_from: string;
  valid_until: string;
  max_entries?: number;
}

export interface Vehicle {
  id: number;
  unit_id: number;
  plate_number: string;
  type: 'car' | 'bike' | 'other';
  label: string | null;
}

export interface VehiclePayload {
  unit_id: number;
  plate_number: string;
  type: 'car' | 'bike' | 'other';
  label?: string;
}
