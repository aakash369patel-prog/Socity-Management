<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $this->createSocietyWithUsers();

        $response = $this->postJson('/api/v1/login', [
            'email' => 'guard@test.local',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'email', 'role']]);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->createSocietyWithUsers();

        $this->postJson('/api/v1/login', [
            'email' => 'guard@test.local',
            'password' => 'wrong',
        ])->assertUnauthorized();
    }

    public function test_authenticated_user_endpoint_returns_profile(): void
    {
        ['guard' => $guard] = $this->createSocietyWithUsers();
        Sanctum::actingAs($guard);

        $this->getJson('/api/v1/user')
            ->assertOk()
            ->assertJsonPath('data.email', 'guard@test.local');
    }
}
