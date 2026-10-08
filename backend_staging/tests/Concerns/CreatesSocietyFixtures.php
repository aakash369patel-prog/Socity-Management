<?php

namespace Tests\Concerns;

use App\Enums\UserRole;
use App\Models\Society;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

trait CreatesSocietyFixtures
{
    protected function createSocietyWithUsers(): array
    {
        $society = Society::query()->create([
            'name' => 'Test Society',
            'address' => 'Test Address',
            'registration_number' => 'TEST-001',
        ]);

        $unit = Unit::query()->create([
            'society_id' => $society->id,
            'block_name' => 'A',
            'flat_number' => '101',
            'floor' => 1,
            'status' => 'occupied',
        ]);

        $guard = User::query()->create([
            'name' => 'Guard',
            'email' => 'guard@test.local',
            'password' => Hash::make('password'),
            'role' => UserRole::Guard,
            'current_society_id' => $society->id,
        ]);

        $admin = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@test.local',
            'password' => Hash::make('password'),
            'role' => UserRole::SocietyAdmin,
            'current_society_id' => $society->id,
        ]);

        $resident = User::query()->create([
            'name' => 'Resident',
            'email' => 'resident@test.local',
            'password' => Hash::make('password'),
            'role' => UserRole::Resident,
            'current_society_id' => $society->id,
        ]);

        $resident->units()->attach($unit->id, ['type' => 'owner']);

        return compact('society', 'unit', 'guard', 'admin', 'resident');
    }
}
