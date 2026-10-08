<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Enums\VisitorPassStatus;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\VisitorPass\RedeemVisitorPassRequest;
use App\Http\Requests\VisitorPass\StoreVisitorPassRequest;
use App\Http\Resources\VisitorPassResource;
use App\Http\Resources\VisitorResource;
use App\Models\Unit;
use App\Models\VisitorPass;
use App\Services\GatePassService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

class VisitorPassController extends Controller
{
    use ResolvesSocietyContext;

    public function __construct(private readonly GatePassService $gatePassService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = VisitorPass::query()
            ->with('unit')
            ->where('society_id', $societyId)
            ->orderByDesc('created_at');

        if ($user->hasRole(UserRole::Resident)) {
            $query->where('created_by', $user->id);
        }

        return VisitorPassResource::collection($query->paginate(20));
    }

    public function store(StoreVisitorPassRequest $request): JsonResponse
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

        $pass = VisitorPass::query()->create([
            'society_id' => $societyId,
            'unit_id' => $unit->id,
            'created_by' => $user->id,
            'guest_name' => $validated['guest_name'],
            'guest_phone' => $validated['guest_phone'],
            'pass_code' => $this->gatePassService->generatePassCode(),
            'valid_from' => $validated['valid_from'],
            'valid_until' => $validated['valid_until'],
            'max_entries' => $validated['max_entries'] ?? 1,
            'status' => VisitorPassStatus::Active,
        ]);

        $pass->load('unit');

        return (new VisitorPassResource($pass))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function revoke(Request $request, VisitorPass $visitorPass): JsonResponse|VisitorPassResource
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        if ((int) $visitorPass->society_id !== $societyId) {
            return response()->json(['message' => 'Pass not found.'], Response::HTTP_NOT_FOUND);
        }

        if ($user->hasRole(UserRole::Resident) && (int) $visitorPass->created_by !== (int) $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $visitorPass->update(['status' => VisitorPassStatus::Revoked]);

        return new VisitorPassResource($visitorPass->load('unit'));
    }

    public function redeem(RedeemVisitorPassRequest $request): JsonResponse|VisitorResource
    {
        $user = $request->user();

        try {
            $visitor = $this->gatePassService->redeemPass($request->string('pass_code'), $user);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return (new VisitorResource($visitor))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
