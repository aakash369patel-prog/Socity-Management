<?php

namespace App\Http\Requests\Society;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocietyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'registration_number' => ['nullable', 'string', 'max:100', 'unique:societies,registration_number'],
        ];
    }
}
