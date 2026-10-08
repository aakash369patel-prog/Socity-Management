import { useEffect, useState } from 'react';
import { fetchUnits } from '../services/unitService';
import type { UnitSummary } from '../types/visitor';

/** @param enabled When false, skips fetch (e.g. admin-only contexts). */
export function useUnits(enabled = true) {
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchUnits()
      .then(setUnits)
      .catch(() => setUnits([]))
      .finally(() => setLoading(false));
  }, [enabled]);

  const unitOptions = units.map((u) => ({
    id: u.id,
    label: u.label ?? `${u.block_name} - ${u.flat_number}`,
  }));

  return { units, unitOptions, loading };
}
