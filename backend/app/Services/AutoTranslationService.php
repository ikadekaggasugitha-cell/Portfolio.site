<?php

namespace App\Services;

use Stichoza\GoogleTranslate\GoogleTranslate;
use Throwable;

class AutoTranslationService
{
    protected ?GoogleTranslate $translatorIdToEn = null;
    protected ?GoogleTranslate $translatorEnToId = null;

    protected function getTranslator(string $targetLocale, string $sourceLocale): GoogleTranslate
    {
        $translator = new GoogleTranslate($targetLocale);
        $translator->setSource($sourceLocale);
        return $translator;
    }

    /**
     * Normalize and auto-translate a single translatable field value into `['id' => '...', 'en' => '...']`.
     *
     * @param mixed $value String, array `['id' => '...', 'en' => '...']`, or null.
     * @return array{id: string|null, en: string|null}|null
     */
    public function processField(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        // If scalar string passed, treat as 'id' locale primary.
        if (is_string($value)) {
            $value = ['id' => trim($value), 'en' => null];
        }

        if (!is_array($value)) {
            return null;
        }

        $id = isset($value['id']) && is_string($value['id']) ? trim($value['id']) : null;
        $en = isset($value['en']) && is_string($value['en']) ? trim($value['en']) : null;

        // If both empty, return empty values
        if (empty($id) && empty($en)) {
            return ['id' => $id ?: null, 'en' => $en ?: null];
        }

        // Auto-translate ID -> EN if EN is empty
        if (!empty($id) && empty($en)) {
            try {
                if (!$this->translatorIdToEn) {
                    $this->translatorIdToEn = $this->getTranslator('en', 'id');
                }
                $en = $this->translatorIdToEn->translate($id);
            } catch (Throwable $e) {
                // If translation fails (e.g. offline/quota), fall back to ID
                $en = $id;
            }
        }

        // Auto-translate EN -> ID if ID is empty
        if (!empty($en) && empty($id)) {
            try {
                if (!$this->translatorEnToId) {
                    $this->translatorEnToId = $this->getTranslator('id', 'en');
                }
                $id = $this->translatorEnToId->translate($en);
            } catch (Throwable $e) {
                $id = $en;
            }
        }

        return [
            'id' => $id,
            'en' => $en,
        ];
    }

    /**
     * Process an array of validated fields, auto-translating any specified translatable keys.
     *
     * @param array<string, mixed> $data
     * @param array<int, string> $translatableFields
     * @return array<string, mixed>
     */
    public function processPayload(array $data, array $translatableFields): array
    {
        foreach ($translatableFields as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->processField($data[$field]);
            }
        }
        return $data;
    }
}
