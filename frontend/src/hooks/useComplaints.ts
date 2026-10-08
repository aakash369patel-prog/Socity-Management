import { useCallback, useEffect, useState } from 'react';
import {
  createComplaint,
  fetchAssignableUsers,
  fetchComplaints,
  updateComplaint,
} from '../services/complaintService';
import type { AuthUser } from '../types/auth';
import type { Complaint, ComplaintPayload, ComplaintUpdatePayload } from '../types/complaint';

export function useComplaints(statusFilter?: string) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [assignable, setAssignable] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchComplaints(statusFilter ? { status: statusFilter } : undefined);
      setComplaints(result.data ?? []);
    } catch {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadAssignable = useCallback(async () => {
    try {
      setAssignable(await fetchAssignableUsers());
    } catch {
      setAssignable([]);
    }
  }, []);

  const addComplaint = async (payload: ComplaintPayload) => {
    const item = await createComplaint(payload);
    setComplaints((prev) => [item, ...prev]);
    return item;
  };

  const patchComplaint = async (id: number, payload: ComplaintUpdatePayload) => {
    const item = await updateComplaint(id, payload);
    setComplaints((prev) => prev.map((c) => (c.id === id ? item : c)));
    return item;
  };

  return {
    complaints,
    assignable,
    loading,
    error,
    reload: load,
    loadAssignable,
    addComplaint,
    patchComplaint,
  };
}
