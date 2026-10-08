<?php

namespace App\Http\Requests\VisitorPass;

use Illuminate\Foundation\Http\FormRequest;

class RedeemVisitorPassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pass_code' => ['required', 'string', 'max:16'],
        ];
    }
}
