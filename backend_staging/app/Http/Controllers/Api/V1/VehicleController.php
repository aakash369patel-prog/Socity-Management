<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Enums\VehicleType;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Unit;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class VehicleController extends Controller
{
    use ResolvesSocietyContext;

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = Vehicle::query()
            ->with('unit')
            ->where('society_id', $societyId)
            ->orderBy('plate_number');

        if ($user->hasRole(UserRole::Resident)) {
            $unitIds = $user->units()->pluck('units.id');
            $query->whereIn('unit_id', $unitIds);
        }

        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->integer('unit_id'));
        }

        return VehicleResource::collection($query->paginate(30));
    }

    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);
        $validated = $request->validated();

        $unit = Unit::query()->whereKey($validated['unit_id'])->where('society_id', $societyId)->first();
        if (! $unit) {
            return response()->json(['message' => 'Unit not found.'], Response::HTTP_NOT_FOUND);
        }

        if ($user->hasRole(UserRole::Resident) && ! $user->units()->where('units.id', $unit->id)->exists()) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $exists = Vehicle::query()
            ->where('society_id', $societyId)
            ->where('plate_number', $validated['plate_number'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Plate number already registered.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $vehicle = Vehicle::query()->create([
            'society_id' => $societyId,
            'unit_id' => $validated['unit_id'],
            'plate_number' => strtoupper(trim($validated['plate_number'])),
            'type' => VehicleType::from($validated['type']),
            'label' => $validated['label'] ?? null,
        ]);

        $vehicle->load('unit');

        return (new VehicleResource($vehicle))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        if ((int) $vehicle->society_id !== $societyId) {
            return response()->json(['message' => 'Vehicle not found.'], Response::HTTP_NOT_FOUND);
        }

        if ($user->hasRole(UserRole::Resident) && ! $user->units()->where('units.id', $vehicle->unit_id)->exists()) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle removed.']);
    }
}
