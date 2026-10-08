<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LedgerEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'entry_date' => $this->entry_date?->format('Y-m-d'),
            'description' => $this->description,
            'debit' => (string) $this->debit,
            'credit' => (string) $this->credit,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'unit' => new UnitResource($this->whenLoaded('unit')),
        ];
    }
}
