<?php

namespace Tests\Feature\Api;

use App\Enums\VisitorPassStatus;
use App\Models\VisitorPass;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class GateApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_resident_creates_pass_and_guard_redeems(): void
    {
        ['unit' => $unit, 'guard' => $guard, 'resident' => $resident, 'society' => $society] =
            $this->createSocietyWithUsers();

        Sanctum::actingAs($resident);

        $created = $this->postJson('/api/v1/visitor-passes', [
            'unit_id' => $unit->id,
            'guest_name' => 'Amit Guest',
            'guest_phone' => '9111111111',
            'valid_from' => now()->subHour()->toIso8601String(),
            'valid_until' => now()->addDay()->toIso8601String(),
            'max_entries' => 1,
        ]);

        $created->assertCreated();
        $passCode = $created->json('data.pass_code');

        Sanctum::actingAs($guard);

        $this->postJson('/api/v1/visitor-passes/redeem', ['pass_code' => $passCode])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Amit Guest');

        $this->assertDatabaseHas('visitor_passes', [
            'pass_code' => $passCode,
            'entries_used' => 1,
            'status' => VisitorPassStatus::Expired->value,
        ]);
    }

    public function test_guard_can_log_delivery_with_vendor(): void
    {
        ['unit' => $unit, 'guard' => $guard] = $this->createSocietyWithUsers();
        Sanctum::actingAs($guard);

        $this->postJson('/api/v1/visitors/check-in', [
            'unit_id' => $unit->id,
            'name' => 'Delivery Person',
            'phone' => '9222222222',
            'purpose' => 'Parcel drop',
            'entry_type' => 'delivery',
            'vendor_name' => 'Amazon',
        ])
            ->assertCreated()
            ->assertJsonPath('data.entry_type', 'delivery')
            ->assertJsonPath('data.vendor_name', 'Amazon');
    }

    public function test_resident_registers_vehicle_for_unit(): void
    {
        ['unit' => $unit, 'resident' => $resident] = $this->createSocietyWithUsers();
        Sanctum::actingAs($resident);

        $this->postJson('/api/v1/vehicles', [
            'unit_id' => $unit->id,
            'plate_number' => 'mh12ab1234',
            'type' => 'car',
            'label' => 'Family SUV',
        ])->assertCreated();

        $this->getJson('/api/v1/vehicles')
            ->assertOk()
            ->assertJsonPath('data.0.plate_number', 'MH12AB1234');
    }
}
