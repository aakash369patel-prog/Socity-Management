<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class UnitApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_admin_can_create_unit_and_attach_resident(): void
    {
        ['admin' => $admin, 'resident' => $resident] = $this->createSocietyWithUsers();
        Sanctum::actingAs($admin);

        $created = $this->postJson('/api/v1/units', [
            'block_name' => 'B',
            'flat_number' => '202',
            'floor' => 2,
            'status' => 'vacant',
        ]);

        $created->assertCreated()->assertJsonPath('data.label', 'B - 202');
        $unitId = $created->json('data.id');

        $this->postJson("/api/v1/units/{$unitId}/members", [
            'user_id' => $resident->id,
            'type' => 'tenant',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'occupied');

        $this->assertDatabaseHas('unit_user', [
            'unit_id' => $unitId,
            'user_id' => $resident->id,
            'type' => 'tenant',
        ]);
    }
}
