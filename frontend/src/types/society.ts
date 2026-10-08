export interface Society {
  id: number;
  name: string;
  address: string;
  registration_number: string | null;
  units_count?: number;
  users_count?: number;
  created_at?: string;
}

export interface SocietyPayload {
  name: string;
  address: string;
  registration_number?: string | null;
}
