<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ComplaintStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Complaint\StoreComplaintRequest;
use App\Http\Requests\Complaint\UpdateComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ComplaintController extends Controller
{
    use ResolvesSocietyContext;

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = Complaint::query()
            ->with(['user', 'assignee'])
            ->where('society_id', $societyId)
            ->orderByDesc('created_at');

        if ($user->hasRole(UserRole::Resident)) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return ComplaintResource::collection($query->paginate(20));
    }

    public function store(StoreComplaintRequest $request): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $validated = $request->validated();

        $complaint = Complaint::query()->create([
            'society_id' => $societyId,
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'status' => ComplaintStatus::Open->value,
        ]);

        $complaint->load(['user', 'assignee']);

        return (new ComplaintResource($complaint))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Request $request, Complaint $complaint): JsonResponse|ComplaintResource
    {
        if (! $this->canAccessComplaint($request, $complaint)) {
            return response()->json(['message' => 'Complaint not found.'], Response::HTTP_NOT_FOUND);
        }

        $complaint->load(['user', 'assignee']);

        return new ComplaintResource($complaint);
    }

    public function update(UpdateComplaintRequest $request, Complaint $complaint): JsonResponse|ComplaintResource
    {
        $user = $request->user();

        if (! $user->hasRole(UserRole::SocietyAdmin, UserRole::SuperAdmin)) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! $this->canAccessComplaint($request, $complaint)) {
            return response()->json(['message' => 'Complaint not found.'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validated();
        $societyId = $this->resolveSocietyId($user, $request);

        if (array_key_exists('assigned_to', $validated) && $validated['assigned_to'] !== null) {
            $assignee = User::query()
                ->whereKey($validated['assigned_to'])
                ->where('current_society_id', $societyId)
                ->whereIn('role', [UserRole::SocietyAdmin, UserRole::SuperAdmin])
                ->first();

            if (! $assignee) {
                return response()->json([
                    'message' => 'Assignee must be a society admin in this society.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        if (isset($validated['status']) && $validated['status'] === ComplaintStatus::Resolved->value) {
            $validated['resolved_at'] = now();
        }

        if (isset($validated['status']) && $validated['status'] !== ComplaintStatus::Resolved->value) {
            $validated['resolved_at'] = null;
        }

        $complaint->fill($validated)->save();
        $complaint->load(['user', 'assignee']);

        return new ComplaintResource($complaint);
    }

    private function canAccessComplaint(Request $request, Complaint $complaint): bool
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        if ((int) $complaint->society_id !== $societyId) {
            return false;
        }

        if ($user->hasRole(UserRole::Resident)) {
            return (int) $complaint->user_id === (int) $user->id;
        }

        return true;
    }
}
