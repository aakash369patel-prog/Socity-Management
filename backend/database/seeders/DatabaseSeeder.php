<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Society;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Society::query()->create([
            'name' => 'Lakeview Apartments',
            'address' => '45 Lake Road, Mumbai',
            'registration_number' => 'RWA-LVA-2023',
        ]);

        $society = Society::query()->create([
            'name' => 'Green Valley Residency',
            'address' => '123 Main Road, Pune',
            'registration_number' => 'RWA-GVR-2024',
        ]);

        User::query()->create([
            'name' => 'Platform Super Admin',
            'email' => 'super@demo.local',
            'password' => Hash::make('password'),
            'phone' => '9000000000',
            'role' => UserRole::SuperAdmin,
            'current_society_id' => $society->id,
        ]);

        $unitA = Unit::query()->create([
            'society_id' => $society->id,
            'block_name' => 'A',
            'flat_number' => '101',
            'floor' => 1,
            'status' => 'occupied',
        ]);

        Unit::query()->create([
            'society_id' => $society->id,
            'block_name' => 'A',
            'flat_number' => '102',
            'floor' => 1,
            'status' => 'vacant',
        ]);

        User::query()->create([
            'name' => 'Gate Guard',
            'email' => 'guard@demo.local',
            'password' => Hash::make('password'),
            'phone' => '9000000001',
            'role' => UserRole::Guard,
            'current_society_id' => $society->id,
        ]);

        User::query()->create([
            'name' => 'Society Admin',
            'email' => 'admin@demo.local',
            'password' => Hash::make('password'),
            'phone' => '9000000002',
            'role' => UserRole::SocietyAdmin,
            'current_society_id' => $society->id,
        ]);

        $resident = User::query()->create([
            'name' => 'Flat 101 Resident',
            'email' => 'resident@demo.local',
            'password' => Hash::make('password'),
            'phone' => '9000000003',
            'role' => UserRole::Resident,
            'current_society_id' => $society->id,
        ]);

        $resident->units()->attach($unitA->id, ['type' => 'owner']);
    }
}
