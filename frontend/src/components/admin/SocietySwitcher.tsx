import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchSocieties } from '../../services/societyService';
import type { Society } from '../../types/society';

export function SocietySwitcher() {
  const { user, setCurrentSociety } = useAuth();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      return;
    }
    fetchSocieties()
      .then(setSocieties)
      .catch(() => setSocieties([]));
  }, [user?.role]);

  if (user?.role !== 'super_admin' || societies.length === 0) {
    return null;
  }

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      Society
      <select
        disabled={saving}
        className="rounded-lg border border-slate-300 px-2 py-1"
        value={user.current_society_id ?? ''}
        onChange={(e) => {
          const id = Number(e.target.value);
          if (!id) return;
          setSaving(true);
          void setCurrentSociety(id).finally(() => setSaving(false));
        }}
      >
        {societies.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
