<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Unit\AttachUnitMemberRequest;
use App\Http\Requests\Unit\StoreUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
use App\Http\Resources\UnitResource;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class UnitController extends Controller
{
    use ResolvesSocietyContext;

    public function index(Request $request): AnonymousResourceCollection
    {
        $societyId = $this->resolveSocietyId($request->user(), $request);

        $query = Unit::query()
            ->with('users')
            ->where('society_id', $societyId)
            ->orderBy('block_name')
            ->orderBy('flat_number');

        if ($request->user()->hasRole(UserRole::Resident)) {
            $unitIds = $request->user()->units()->pluck('units.id');
            $query->whereIn('id', $unitIds);
        }

        $units = $query->get();

        return UnitResource::collection($units);
    }

    public function store(StoreUnitRequest $request): JsonResponse
    {
        $societyId = $this->resolveSocietyId($request->user(), $request);
        $validated = $request->validated();

        $exists = Unit::query()
            ->where('society_id', $societyId)
            ->where('block_name', $validated['block_name'])
            ->where('flat_number', $validated['flat_number'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This block and flat number already exists.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $unit = Unit::query()->create([
            'society_id' => $societyId,
            'block_name' => $validated['block_name'],
            'flat_number' => $validated['flat_number'],
            'floor' => $validated['floor'] ?? null,
            'status' => $validated['status'] ?? 'vacant',
        ]);

        $unit->load('users');

        return (new UnitResource($unit))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Request $request, Unit $unit): JsonResponse|UnitResource
    {
        if (! $this->unitInSociety($request, $unit)) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        $unit->load('users');

        return new UnitResource($unit);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): JsonResponse|UnitResource
    {
        if (! $this->unitInSociety($request, $unit)) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        $unit->fill($request->validated())->save();
        $unit->load('users');

        return new UnitResource($unit);
    }

    public function destroy(Request $request, Unit $unit): JsonResponse
    {
        if (! $this->unitInSociety($request, $unit)) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        $unit->delete();

        return response()->json(['message' => 'Unit removed.']);
    }

    public function attachMember(AttachUnitMemberRequest $request, Unit $unit): JsonResponse|UnitResource
    {
        if (! $this->unitInSociety($request, $unit)) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        $societyId = $this->resolveSocietyId($request->user(), $request);
        $validated = $request->validated();

        $resident = User::query()
            ->whereKey($validated['user_id'])
            ->where('current_society_id', $societyId)
            ->first();

        if (! $resident) {
            return response()->json([
                'message' => 'User must belong to this society.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $unit->users()->syncWithoutDetaching([
            $validated['user_id'] => ['type' => $validated['type']],
        ]);

        if ($unit->status === 'vacant') {
            $unit->update(['status' => 'occupied']);
        }

        $unit->load('users');

        return new UnitResource($unit);
    }

    public function detachMember(Request $request, Unit $unit, User $user): JsonResponse|UnitResource
    {
        if (! $this->unitInSociety($request, $unit)) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        $unit->users()->detach($user->id);

        if (! $unit->users()->exists()) {
            $unit->update(['status' => 'vacant']);
        }

        $unit->load('users');

        return new UnitResource($unit);
    }

    private function unitInSociety(Request $request, Unit $unit): bool
    {
        $societyId = $this->resolveSocietyId($request->user(), $request);

        return (int) $unit->society_id === $societyId;
    }
}
