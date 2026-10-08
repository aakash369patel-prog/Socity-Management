<?php

namespace Tests\Feature\Api;

use App\Models\Complaint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class ComplaintApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_resident_can_create_complaint_and_admin_can_resolve(): void
    {
        ['admin' => $admin, 'resident' => $resident] = $this->createSocietyWithUsers();

        Sanctum::actingAs($resident);

        $created = $this->postJson('/api/v1/complaints', [
            'title' => 'Water leakage',
            'description' => 'Kitchen sink pipe leaking',
            'category' => 'Plumbing',
        ]);

        $created->assertCreated()->assertJsonPath('data.status', 'open');
        $complaintId = $created->json('data.id');

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/complaints/{$complaintId}", [
            'status' => 'in_progress',
            'assigned_to' => $admin->id,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress')
            ->assertJsonPath('data.assigned_to', $admin->id);

        $this->patchJson("/api/v1/complaints/{$complaintId}", [
            'status' => 'resolved',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'resolved');

        $this->assertNotNull(Complaint::query()->find($complaintId)?->resolved_at);
    }
}
