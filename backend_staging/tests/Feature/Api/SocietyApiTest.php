<?php

namespace Tests\Feature\Api;

use App\Enums\UserRole;
use App\Models\Society;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SocietyApiTest extends TestCase
{
    use RefreshDatabase;

    private function superAdmin(): User
    {
        $society = Society::query()->create([
            'name' => 'Seed Society',
            'address' => 'Addr',
        ]);

        return User::query()->create([
            'name' => 'Super',
            'email' => 'super@test.local',
            'password' => Hash::make('password'),
            'role' => UserRole::SuperAdmin,
            'current_society_id' => $society->id,
        ]);
    }

    public function test_super_admin_can_manage_societies_and_switch_context(): void
    {
        $super = $this->superAdmin();
        Sanctum::actingAs($super);

        $created = $this->postJson('/api/v1/societies', [
            'name' => 'New Enclave',
            'address' => '99 Park Street',
            'registration_number' => 'RWA-NE-2026',
        ]);

        $created->assertCreated()->assertJsonPath('data.name', 'New Enclave');
        $newId = $created->json('data.id');

        $this->putJson('/api/v1/user/current-society', ['society_id' => $newId])
            ->assertOk()
            ->assertJsonPath('data.current_society_id', $newId);

        $this->assertSame($newId, $super->fresh()->current_society_id);
    }

    public function test_society_admin_cannot_list_societies(): void
    {
        $society = Society::query()->create(['name' => 'S', 'address' => 'A']);
        $admin = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@test.local',
            'password' => Hash::make('password'),
            'role' => UserRole::SocietyAdmin,
            'current_society_id' => $society->id,
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/societies')->assertForbidden();
    }
}
