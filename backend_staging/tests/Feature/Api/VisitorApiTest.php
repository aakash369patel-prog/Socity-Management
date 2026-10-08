<?php

namespace Tests\Feature\Api;

use App\Enums\VisitorStatus;
use App\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class VisitorApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_guard_can_check_in_and_check_out_visitor(): void
    {
        ['unit' => $unit, 'guard' => $guard] = $this->createSocietyWithUsers();
        Sanctum::actingAs($guard);

        $checkIn = $this->postJson('/api/v1/visitors/check-in', [
            'unit_id' => $unit->id,
            'name' => 'Ravi Guest',
            'phone' => '9999999999',
            'purpose' => 'Personal visit',
        ]);

        $checkIn->assertCreated()
            ->assertJsonPath('data.status', VisitorStatus::Entered->value);

        $visitorId = $checkIn->json('data.id');

        $this->postJson("/api/v1/visitors/{$visitorId}/check-out")
            ->assertOk()
            ->assertJsonPath('data.status', VisitorStatus::Exited->value);

        $this->assertDatabaseHas('visitors', [
            'id' => $visitorId,
            'status' => VisitorStatus::Exited->value,
        ]);
    }

    public function test_resident_cannot_check_in_visitor(): void
    {
        ['resident' => $resident] = $this->createSocietyWithUsers();
        Sanctum::actingAs($resident);

        $this->postJson('/api/v1/visitors/check-in', [
            'name' => 'Blocked',
            'phone' => '8888888888',
            'purpose' => 'Test',
        ])->assertForbidden();
    }
}
