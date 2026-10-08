import type { Society } from './society';

export type UserRole = 'super_admin' | 'society_admin' | 'resident' | 'guard';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  current_society_id: number | null;
  current_society?: Society | null;
}
