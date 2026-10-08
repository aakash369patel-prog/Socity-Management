<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitorPassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'guest_name' => $this->guest_name,
            'guest_phone' => $this->guest_phone,
            'pass_code' => $this->pass_code,
            'valid_from' => $this->valid_from?->toIso8601String(),
            'valid_until' => $this->valid_until?->toIso8601String(),
            'max_entries' => $this->max_entries,
            'entries_used' => $this->entries_used,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'unit' => new UnitResource($this->whenLoaded('unit')),
        ];
    }
}
