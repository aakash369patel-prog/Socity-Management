<?php

namespace Tests\Feature\Api;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\LedgerEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesSocietyFixtures;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    use CreatesSocietyFixtures, RefreshDatabase;

    public function test_admin_payment_marks_invoice_paid_and_posts_ledger_credit(): void
    {
        ['unit' => $unit, 'admin' => $admin, 'society' => $society] = $this->createSocietyWithUsers();

        $invoice = Invoice::query()->create([
            'society_id' => $society->id,
            'unit_id' => $unit->id,
            'invoice_number' => 'INV-PAY-001',
            'amount' => 1500.00,
            'due_date' => now()->addDays(10),
            'status' => InvoiceStatus::Unpaid,
        ]);

        LedgerEntry::query()->create([
            'society_id' => $society->id,
            'unit_id' => $unit->id,
            'entry_date' => now()->toDateString(),
            'description' => 'Charge',
            'debit' => 1500,
            'credit' => 0,
            'reference_type' => 'invoice',
            'reference_id' => $invoice->id,
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/v1/payments', [
            'invoice_id' => $invoice->id,
            'amount' => 1500,
            'method' => 'upi',
            'notes' => 'Test UPI',
        ])->assertCreated();

        $this->assertSame(InvoiceStatus::Paid, $invoice->fresh()->status);

        $this->assertDatabaseHas('ledger_entries', [
            'reference_type' => 'payment',
            'credit' => 1500.00,
            'unit_id' => $unit->id,
        ]);
    }

    public function test_resident_can_view_ledger_for_own_unit(): void
    {
        ['unit' => $unit, 'resident' => $resident, 'society' => $society] = $this->createSocietyWithUsers();

        LedgerEntry::query()->create([
            'society_id' => $society->id,
            'unit_id' => $unit->id,
            'entry_date' => now()->toDateString(),
            'description' => 'Maintenance',
            'debit' => 500,
            'credit' => 0,
            'reference_type' => 'invoice',
            'reference_id' => 1,
        ]);

        Sanctum::actingAs($resident);

        $this->getJson('/api/v1/ledger')
            ->assertOk()
            ->assertJsonPath('data.0.unit_id', $unit->id);
    }
}
