<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'plate_number' => ['required', 'string', 'max:50'],
            'type' => ['required', Rule::in(['car', 'bike', 'other'])],
            'label' => ['nullable', 'string', 'max:100'],
        ];
    }
}
