import { useCallback, useEffect, useState } from 'react';
import { redeemVisitorPass } from '../services/gateService';
import { checkInVisitor, checkOutVisitor, fetchVisitors } from '../services/visitorService';
import type { Visitor, VisitorCheckInPayload } from '../types/visitor';

export function useVisitors(insideOnly = true) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVisitors({ inside_only: insideOnly });
      setVisitors(result.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  }, [insideOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  const checkIn = async (payload: VisitorCheckInPayload) => {
    const visitor = await checkInVisitor(payload);
    setVisitors((prev) => [visitor, ...prev]);
    return visitor;
  };

  const checkOut = async (visitorId: number) => {
    const updated = await checkOutVisitor(visitorId);
    setVisitors((prev) => prev.filter((v) => v.id !== visitorId));
    return updated;
  };

  const redeemPass = async (passCode: string) => {
    const visitor = await redeemVisitorPass(passCode);
    setVisitors((prev) => [visitor, ...prev]);
    return visitor;
  };

  return { visitors, loading, error, reload: load, checkIn, checkOut, redeemPass };
}
