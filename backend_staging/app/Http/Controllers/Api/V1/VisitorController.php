<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\VisitorEntryType;
use App\Enums\VisitorStatus;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Visitor\CheckOutVisitorRequest;
use App\Http\Requests\Visitor\StoreVisitorRequest;
use App\Http\Resources\VisitorResource;
use App\Models\Unit;
use App\Models\Visitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class VisitorController extends Controller
{
    use ResolvesSocietyContext;

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = Visitor::query()
            ->with(['unit', 'checkedInBy', 'checkedOutBy'])
            ->where('society_id', $societyId)
            ->orderByDesc('check_in');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->boolean('inside_only')) {
            $query->where('status', VisitorStatus::Entered);
        }

        if ($request->filled('entry_type')) {
            $query->where('entry_type', $request->string('entry_type'));
        }

        return VisitorResource::collection($query->paginate(20));
    }

    public function store(StoreVisitorRequest $request): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $unitId = $request->input('unit_id');
        if ($unitId !== null) {
            $unit = Unit::query()->whereKey($unitId)->where('society_id', $societyId)->first();
            if (! $unit) {
                return response()->json([
                    'message' => 'The selected unit does not belong to this society.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $validated = $request->validated();

        $entryType = VisitorEntryType::from($validated['entry_type'] ?? VisitorEntryType::Guest->value);

        $visitor = Visitor::query()->create([
            'society_id' => $societyId,
            'unit_id' => $unitId,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'vehicle_number' => $validated['vehicle_number'] ?? null,
            'purpose' => $validated['purpose'],
            'entry_type' => $entryType,
            'vendor_name' => $entryType === VisitorEntryType::Delivery
                ? ($validated['vendor_name'] ?? null)
                : null,
            'status' => VisitorStatus::Entered,
            'check_in' => now(),
            'checked_in_by' => $user->id,
        ]);

        $visitor->load(['unit', 'checkedInBy']);

        return (new VisitorResource($visitor))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function checkOut(CheckOutVisitorRequest $request, Visitor $visitor): JsonResponse|VisitorResource
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        if ((int) $visitor->society_id !== (int) $societyId) {
            return response()->json(['message' => 'Visitor not found in your society.'], 404);
        }

        if ($visitor->status === VisitorStatus::Exited) {
            return response()->json(['message' => 'Visitor has already checked out.'], 422);
        }

        $visitor->forceFill([
            'status' => VisitorStatus::Exited,
            'check_out' => now(),
            'checked_out_by' => $user->id,
        ])->save();

        $visitor->load(['unit', 'checkedInBy', 'checkedOutBy']);

        return new VisitorResource($visitor);
    }
}
