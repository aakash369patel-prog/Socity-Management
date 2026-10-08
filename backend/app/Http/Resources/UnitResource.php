<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'block_name' => $this->block_name,
            'flat_number' => $this->flat_number,
            'floor' => $this->floor,
            'status' => $this->status,
            'label' => "{$this->block_name} - {$this->flat_number}",
            'members' => $this->whenLoaded('users', function () {
                return $this->users->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'type' => $user->pivot->type,
                ]);
            }),
        ];
    }
}
