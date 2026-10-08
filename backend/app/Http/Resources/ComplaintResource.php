<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'society_id' => $this->society_id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'assigned_to' => $this->assigned_to,
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'reporter' => new UserResource($this->whenLoaded('user')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
