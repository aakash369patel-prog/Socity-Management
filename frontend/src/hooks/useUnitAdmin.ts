import { useCallback, useEffect, useState } from 'react';
import {
  attachUnitMember,
  createUnit,
  deleteUnit,
  detachUnitMember,
  fetchSocietyResidents,
  fetchUnitsAdmin,
  updateUnit,
} from '../services/unitAdminService';
import type { AuthUser } from '../types/auth';
import type { AttachMemberPayload, Unit, UnitPayload } from '../types/unit';

export function useUnitAdmin() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [residents, setResidents] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [unitList, residentList] = await Promise.all([
        fetchUnitsAdmin(),
        fetchSocietyResidents(),
      ]);
      setUnits(unitList);
      setResidents(residentList);
    } catch {
      setError('Failed to load units.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addUnit = async (payload: UnitPayload) => {
    const unit = await createUnit(payload);
    setUnits((prev) => [...prev, unit].sort((a, b) => a.label.localeCompare(b.label)));
    return unit;
  };

  const patchUnit = async (id: number, payload: Partial<UnitPayload>) => {
    const unit = await updateUnit(id, payload);
    setUnits((prev) => prev.map((u) => (u.id === id ? unit : u)));
    return unit;
  };

  const removeUnit = async (id: number) => {
    await deleteUnit(id);
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const linkMember = async (unitId: number, payload: AttachMemberPayload) => {
    const unit = await attachUnitMember(unitId, payload);
    setUnits((prev) => prev.map((u) => (u.id === unitId ? unit : u)));
    return unit;
  };

  const unlinkMember = async (unitId: number, userId: number) => {
    const unit = await detachUnitMember(unitId, userId);
    setUnits((prev) => prev.map((u) => (u.id === unitId ? unit : u)));
    return unit;
  };

  return {
    units,
    residents,
    loading,
    error,
    reload: load,
    addUnit,
    patchUnit,
    removeUnit,
    linkMember,
    unlinkMember,
  };
}
