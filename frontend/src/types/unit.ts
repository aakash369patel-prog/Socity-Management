export type UnitOccupancy = 'occupied' | 'vacant';
export type MemberType = 'owner' | 'tenant';

export interface UnitMember {
  id: number;
  name: string;
  email: string;
  type: MemberType;
}

export interface Unit {
  id: number;
  society_id: number;
  block_name: string;
  flat_number: string;
  floor: number | null;
  status: UnitOccupancy;
  label: string;
  members?: UnitMember[];
}

export interface UnitPayload {
  block_name: string;
  flat_number: string;
  floor?: number | null;
  status?: UnitOccupancy;
}

export interface AttachMemberPayload {
  user_id: number;
  type: MemberType;
}
