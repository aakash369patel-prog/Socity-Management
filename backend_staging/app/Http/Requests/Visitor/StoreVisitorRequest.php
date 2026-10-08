<?php

namespace App\Http\Requests\Visitor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVisitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'vehicle_number' => ['nullable', 'string', 'max:50'],
            'purpose' => ['required', 'string', 'max:500'],
            'entry_type' => ['nullable', Rule::in(['guest', 'delivery'])],
            'vendor_name' => ['nullable', 'required_if:entry_type,delivery', 'string', 'max:150'],
        ];
    }
}
