<?php

namespace App\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'block_name' => ['required', 'string', 'max:100'],
            'flat_number' => ['required', 'string', 'max:50'],
            'floor' => ['nullable', 'integer', 'min:0', 'max:200'],
            'status' => ['nullable', Rule::in(['occupied', 'vacant'])],
        ];
    }
}
