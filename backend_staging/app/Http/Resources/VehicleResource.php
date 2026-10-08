<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'unit_id' => $this->unit_id,
            'plate_number' => $this->plate_number,
            'type' => $this->type instanceof \BackedEnum ? $this->type->value : $this->type,
            'label' => $this->label,
            'unit' => new UnitResource($this->whenLoaded('unit')),
        ];
    }
}
