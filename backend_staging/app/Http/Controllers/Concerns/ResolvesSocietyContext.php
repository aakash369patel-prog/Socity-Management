<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

trait ResolvesSocietyContext
{
    protected function resolveSocietyId(User $user, Request $request): int
    {
        if ($user->hasRole(UserRole::SuperAdmin)) {
            if ($request->filled('society_id')) {
                return (int) $request->input('society_id');
            }

            if ($user->current_society_id) {
                return (int) $user->current_society_id;
            }

            abort(
                Response::HTTP_UNPROCESSABLE_ENTITY,
                'Super admin must set a current society context.'
            );
        }

        if (! $user->current_society_id) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'No society context assigned to user.');
        }

        return (int) $user->current_society_id;
    }
}
