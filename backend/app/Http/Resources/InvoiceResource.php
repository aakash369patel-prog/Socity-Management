<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'invoice_number' => $this->invoice_number,
            'amount' => (string) $this->amount,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'status' => $this->status?->value ?? $this->status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
