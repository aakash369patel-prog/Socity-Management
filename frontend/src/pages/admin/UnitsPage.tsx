import { UnitCreateForm } from '../../components/units/UnitCreateForm';
import { UnitList } from '../../components/units/UnitList';
import { useUnitAdmin } from '../../hooks/useUnitAdmin';
import type { UnitOccupancy } from '../../types/unit';

export function UnitsPage() {
  const {
    units,
    residents,
    loading,
    error,
    reload,
    addUnit,
    patchUnit,
    removeUnit,
    linkMember,
    unlinkMember,
  } = useUnitAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Unit management</h1>
        <p className="text-slate-600">Blocks, flats, and owner/tenant assignments.</p>
      </header>

      <UnitCreateForm onSubmit={addUnit} />

      <UnitList
        units={units}
        residents={residents}
        loading={loading}
        error={error}
        onStatusChange={(id, status) => patchUnit(id, { status })}
        onRemove={removeUnit}
        onLinkMember={(unitId, userId, type) => linkMember(unitId, { user_id: userId, type })}
        onUnlinkMember={unlinkMember}
        onRefresh={() => void reload()}
      />
    </div>
  );
}
