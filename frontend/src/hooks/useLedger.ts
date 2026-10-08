import { useCallback, useEffect, useState } from 'react';
import { fetchLedger } from '../services/paymentService';
import type { LedgerEntry } from '../types/ledger';

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLedger();
      setEntries(result.data ?? []);
    } catch {
      setError('Failed to load ledger.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const balance = entries.reduce(
    (sum, e) => sum + Number(e.debit) - Number(e.credit),
    0
  );

  return { entries, loading, error, balance, reload: load };
}
