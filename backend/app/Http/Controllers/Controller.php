<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ApiResponse;

    /**
     * Validation rules for a translatable field submitted as a string or a `{ "id": "...", "en": "..." }`
     * map (spatie/laravel-translatable).
     *
     * @return array<string, array<int, string>>
     */
    protected function translatableRules(string $field, bool $required = false, ?int $max = 255): array
    {
        $sub = ['nullable', 'string'];
        if ($max !== null) {
            $sub[] = "max:{$max}";
        }

        return [
            $field => [$required ? 'required' : 'nullable'],
            "{$field}.id" => $sub,
            "{$field}.en" => $sub,
        ];
    }

    /**
     * Auto-translate translatable fields in validated data if one language is missing.
     *
     * @param array<string, mixed> $data
     * @param array<int, string> $translatableFields
     * @return array<string, mixed>
     */
    protected function autoTranslate(array $data, array $translatableFields): array
    {
        /** @var \App\Services\AutoTranslationService $autoTranslator */
        $autoTranslator = app(\App\Services\AutoTranslationService::class);
        return $autoTranslator->processPayload($data, $translatableFields);
    }
}
