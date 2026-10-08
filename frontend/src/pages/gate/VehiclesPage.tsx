import { FormEvent, useEffect, useState } from 'react';
import { fetchVehicles, registerVehicle, removeVehicle } from '../../services/gateService';
import { useUnits } from '../../hooks/useUnits';
import type { Vehicle } from '../../types/gate';

export function VehiclesPage() {
  const { unitOptions } = useUnits(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [unitId, setUnitId] = useState<number | ''>('');
  const [plate, setPlate] = useState('');
  const [type, setType] = useState<'car' | 'bike' | 'other'>('car');

  const load = () => fetchVehicles().then(setVehicles).catch(() => setVehicles([]));

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (unitId === '') return;
    await registerVehicle({ unit_id: unitId, plate_number: plate, type });
    setPlate('');
    load();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Registered vehicles</h1>
        <p className="text-slate-600">Link plate numbers to units for gate reference.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border bg-white p-6 sm:grid-cols-2">
        <select
          required
          className="rounded-lg border px-3 py-2"
          value={unitId}
          onChange={(e) => setUnitId(Number(e.target.value))}
        >
          <option value="">Unit</option>
          {unitOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Plate number"
          className="rounded-lg border px-3 py-2"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
        />
        <select
          className="rounded-lg border px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Register
        </button>
      </form>

      <ul className="divide-y rounded-xl border bg-white p-4">
        {vehicles.map((v) => (
          <li key={v.id} className="flex justify-between py-2 text-sm">
            <span>
              {v.plate_number} · {v.type} · unit #{v.unit_id}
            </span>
            <button type="button" className="text-red-600" onClick={() => void removeVehicle(v.id).then(load)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
