<?php

namespace App\Http\Requests\VisitorPass;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitorPassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'guest_phone' => ['required', 'string', 'max:20'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['required', 'date', 'after:valid_from'],
            'max_entries' => ['nullable', 'integer', 'min:1', 'max:10'],
        ];
    }
}
