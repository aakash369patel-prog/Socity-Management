import { useCallback, useEffect, useState } from 'react';
import {
  createSociety,
  deleteSociety,
  fetchSocieties,
  updateSociety,
} from '../services/societyService';
import type { Society, SocietyPayload } from '../types/society';

export function useSocietiesAdmin() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSocieties(await fetchSocieties());
    } catch {
      setError('Failed to load societies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async (payload: SocietyPayload) => {
    const society = await createSociety(payload);
    setSocieties((prev) => [...prev, society].sort((a, b) => a.name.localeCompare(b.name)));
    return society;
  };

  const patch = async (id: number, payload: Partial<SocietyPayload>) => {
    const society = await updateSociety(id, payload);
    setSocieties((prev) => prev.map((s) => (s.id === id ? society : s)));
    return society;
  };

  const remove = async (id: number) => {
    await deleteSociety(id);
    setSocieties((prev) => prev.filter((s) => s.id !== id));
  };

  return { societies, loading, error, reload: load, add, patch, remove };
}
