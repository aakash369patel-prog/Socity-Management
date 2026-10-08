<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'invoice_id' => $this->invoice_id,
            'amount' => (string) $this->amount,
            'method' => $this->method instanceof \BackedEnum ? $this->method->value : $this->method,
            'gateway_ref' => $this->gateway_ref,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'notes' => $this->notes,
            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
        ];
    }
}
