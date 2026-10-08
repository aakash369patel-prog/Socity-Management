<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Resources\LedgerEntryResource;
use App\Models\LedgerEntry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LedgerController extends Controller
{
    use ResolvesSocietyContext;

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = LedgerEntry::query()
            ->with('unit')
            ->where('society_id', $societyId)
            ->orderByDesc('entry_date')
            ->orderByDesc('id');

        if ($user->hasRole(UserRole::Resident)) {
            $unitIds = $user->units()->pluck('units.id');
            $query->whereIn('unit_id', $unitIds);
        }

        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->integer('unit_id'));
        }

        return LedgerEntryResource::collection($query->paginate(30));
    }
}
