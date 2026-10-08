<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'name' => $this->name,
            'phone' => $this->phone,
            'vehicle_number' => $this->vehicle_number,
            'purpose' => $this->purpose,
            'entry_type' => $this->entry_type instanceof \BackedEnum ? $this->entry_type->value : $this->entry_type,
            'vendor_name' => $this->vendor_name,
            'visitor_pass_id' => $this->visitor_pass_id,
            'status' => $this->status?->value ?? $this->status,
            'check_in' => $this->check_in?->toIso8601String(),
            'check_out' => $this->check_out?->toIso8601String(),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'checked_in_by' => new UserResource($this->whenLoaded('checkedInBy')),
            'checked_out_by' => new UserResource($this->whenLoaded('checkedOutBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
