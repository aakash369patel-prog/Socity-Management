export type VisitorStatus = 'entered' | 'exited';

export interface UnitSummary {
  id: number;
  block_name: string;
  flat_number: string;
  label?: string;
}

export type VisitorEntryType = 'guest' | 'delivery';

export interface Visitor {
  id: number;
  society_id: number;
  unit_id: number | null;
  name: string;
  phone: string;
  vehicle_number: string | null;
  purpose: string;
  entry_type?: VisitorEntryType;
  vendor_name?: string | null;
  visitor_pass_id?: number | null;
  status: VisitorStatus;
  check_in: string;
  check_out: string | null;
  unit?: UnitSummary;
}

export interface VisitorCheckInPayload {
  unit_id?: number | null;
  name: string;
  phone: string;
  vehicle_number?: string;
  purpose: string;
  entry_type?: VisitorEntryType;
  vendor_name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  links?: Record<string, string | null>;
}
