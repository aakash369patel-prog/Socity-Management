<?php

namespace App\Http\Requests\Society;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSocietyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $societyId = $this->route('society')?->id;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'address' => ['sometimes', 'string'],
            'registration_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('societies', 'registration_number')->ignore($societyId),
            ],
        ];
    }
}
