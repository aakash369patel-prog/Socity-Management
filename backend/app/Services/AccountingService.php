<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Invoice;
use App\Models\LedgerEntry;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class AccountingService
{
    public function postInvoiceCharge(Invoice $invoice): LedgerEntry
    {
        return LedgerEntry::query()->create([
            'society_id' => $invoice->society_id,
            'unit_id' => $invoice->unit_id,
            'entry_date' => $invoice->due_date,
            'description' => "Maintenance invoice {$invoice->invoice_number}",
            'debit' => $invoice->amount,
            'credit' => 0,
            'reference_type' => 'invoice',
            'reference_id' => $invoice->id,
        ]);
    }

    public function recordPayment(
        Invoice $invoice,
        User $recordedBy,
        float $amount,
        PaymentMethod $method,
        ?string $gatewayRef = null,
        ?string $notes = null,
        PaymentStatus $status = PaymentStatus::Completed,
    ): Payment {
        if ($invoice->status === InvoiceStatus::Paid) {
            throw new InvalidArgumentException('Invoice is already paid.');
        }

        if (round($amount, 2) !== round((float) $invoice->amount, 2)) {
            throw new InvalidArgumentException('Payment amount must match invoice total.');
        }

        return DB::transaction(function () use ($invoice, $recordedBy, $amount, $method, $gatewayRef, $notes, $status) {
            $payment = Payment::query()->create([
                'society_id' => $invoice->society_id,
                'unit_id' => $invoice->unit_id,
                'invoice_id' => $invoice->id,
                'amount' => $amount,
                'method' => $method,
                'gateway_ref' => $gatewayRef,
                'status' => $status,
                'paid_at' => $status === PaymentStatus::Completed ? now() : null,
                'recorded_by' => $recordedBy->id,
                'notes' => $notes,
            ]);

            if ($status === PaymentStatus::Completed) {
                $invoice->markPaid();

                LedgerEntry::query()->create([
                    'society_id' => $invoice->society_id,
                    'unit_id' => $invoice->unit_id,
                    'entry_date' => now()->toDateString(),
                    'description' => "Payment for {$invoice->invoice_number}",
                    'debit' => 0,
                    'credit' => $amount,
                    'reference_type' => 'payment',
                    'reference_id' => $payment->id,
                ]);
            }

            return $payment->fresh(['invoice', 'unit']);
        });
    }

    public function completeRazorpayPayment(Payment $payment): Payment
    {
        if ($payment->status === PaymentStatus::Completed) {
            return $payment;
        }

        $invoice = $payment->invoice;

        return DB::transaction(function () use ($payment, $invoice) {
            $payment->forceFill([
                'status' => PaymentStatus::Completed,
                'paid_at' => now(),
            ])->save();

            $invoice?->markPaid();

            if ($invoice) {
                LedgerEntry::query()->firstOrCreate(
                    [
                        'reference_type' => 'payment',
                        'reference_id' => $payment->id,
                    ],
                    [
                        'society_id' => $payment->society_id,
                        'unit_id' => $payment->unit_id,
                        'entry_date' => now()->toDateString(),
                        'description' => "Payment for {$invoice->invoice_number}",
                        'debit' => 0,
                        'credit' => $payment->amount,
                    ]
                );
            }

            return $payment->fresh(['invoice', 'unit']);
        });
    }
}
