<?php

namespace App\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'block_name' => ['sometimes', 'string', 'max:100'],
            'flat_number' => ['sometimes', 'string', 'max:50'],
            'floor' => ['nullable', 'integer', 'min:0', 'max:200'],
            'status' => ['sometimes', Rule::in(['occupied', 'vacant'])],
        ];
    }
}
