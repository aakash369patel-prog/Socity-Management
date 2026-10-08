<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    use ResolvesSocietyContext;

    /** Staff list for complaint assignment. */
    public function assignable(Request $request): AnonymousResourceCollection
    {
        $societyId = $this->resolveSocietyId($request->user(), $request);

        $users = User::query()
            ->where('current_society_id', $societyId)
            ->whereIn('role', [UserRole::SocietyAdmin, UserRole::SuperAdmin])
            ->orderBy('name')
            ->get();

        return UserResource::collection($users);
    }

    /** Residents in society for linking to units. */
    public function residents(Request $request): AnonymousResourceCollection
    {
        $societyId = $this->resolveSocietyId($request->user(), $request);

        $users = User::query()
            ->where('current_society_id', $societyId)
            ->where('role', UserRole::Resident)
            ->orderBy('name')
            ->get();

        return UserResource::collection($users);
    }
}
