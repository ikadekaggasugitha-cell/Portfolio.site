<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Content i18n: turn admin-authored text columns into per-locale JSON maps
 * (`{"id": "...", "en": "..."}`), read/written through spatie/laravel-translatable.
 *
 * Strategy (per column): first wrap the existing scalar into the primary locale
 * (`{"id": <value>}`) so every row is valid JSON, THEN change the column type to JSON.
 * Doing it in that order lets MySQL validate the type change against data that is
 * already well-formed. English fills in later from the admin; until then the frontend
 * (and the app fallback_locale) resolve a missing `en` back to `id`, so nothing is blank.
 *
 * `page_blocks.data` is already JSON and holds a structured block payload rather than a
 * scalar, so it is handled as a whole-payload-per-locale map (`{"id": {...}}`) — the
 * public renderer and the admin editor pick `data[locale]`. It is not a spatie attribute.
 *
 * Raw SQL is used for the type change so no doctrine/dbal dependency is needed.
 */
return new class extends Migration
{
    /**
     * table => [ column => [originalType, nullable] ].
     * `originalType` is only needed to restore the column on rollback.
     */
    private array $columns = [
        'profiles' => [
            'title' => ['string', true],
            'description' => ['text', true],
            'about_lead' => ['string', true],
            'about_body' => ['text', true],
        ],
        'projects' => [
            'title' => ['string', false],
            'description' => ['text', true],
        ],
        'project_images' => [
            'caption' => ['string', true],
        ],
        'experiences' => [
            'position' => ['string', false],
            'description' => ['text', true],
        ],
        'educations' => [
            'degree' => ['string', true],
            'field_of_study' => ['string', true],
            'description' => ['text', true],
        ],
        'certificates' => [
            'title' => ['string', false],
            'description' => ['text', true],
        ],
        'capabilities' => [
            'title' => ['string', false],
            'description' => ['text', true],
        ],
        'testimonials' => [
            'quote' => ['text', false],
            'author_title' => ['string', true],
        ],
        'faqs' => [
            'question' => ['string', false],
            'answer' => ['text', false],
        ],
        'stats' => [
            'label' => ['string', false],
        ],
        'pages' => [
            'title' => ['string', false],
            'content' => ['text', true],
        ],
    ];

    public function up(): void
    {
        // Only MySQL distinguishes a JSON column type. Elsewhere (the SQLite test DB) the
        // existing text columns already hold JSON strings fine, so the type change is a no-op.
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        foreach ($this->columns as $table => $cols) {
            foreach ($cols as $col => [$type, $nullable]) {
                // Wrap the scalar into the primary locale bucket. NULLs stay NULL.
                // Ignore rows that are already valid JSON objects containing an 'id' key.
                DB::statement("UPDATE `{$table}` SET `{$col}` = JSON_OBJECT('id', `{$col}`) WHERE `{$col}` IS NOT NULL AND (JSON_VALID(`{$col}`) = 0 OR JSON_EXTRACT(`{$col}`, '$.id') IS NULL)");
                $null = $nullable ? 'NULL' : 'NOT NULL';
                DB::statement("ALTER TABLE `{$table}` MODIFY `{$col}` JSON {$null}");
            }
        }

        // page_blocks.data is already JSON — nest the whole payload under the primary locale.
        DB::statement("UPDATE `page_blocks` SET `data` = JSON_OBJECT('id', `data`) WHERE `data` IS NOT NULL AND (JSON_VALID(`data`) = 0 OR JSON_EXTRACT(`data`, '$.id') IS NULL)");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        foreach ($this->columns as $table => $cols) {
            foreach ($cols as $col => [$type, $nullable]) {
                $null = $nullable ? 'NULL' : 'NOT NULL';
                // Go via TEXT first: a JSON column serialises to its text form, so the
                // subsequent unwrap writes a bare scalar into a non-JSON column (writing a
                // scalar back into a JSON column would fail as "Invalid JSON text").
                DB::statement("ALTER TABLE `{$table}` MODIFY `{$col}` TEXT {$null}");
                DB::statement("UPDATE `{$table}` SET `{$col}` = JSON_UNQUOTE(JSON_EXTRACT(`{$col}`, '$.id')) WHERE `{$col}` IS NOT NULL");
                if ($type !== 'text') {
                    DB::statement("ALTER TABLE `{$table}` MODIFY `{$col}` VARCHAR(255) {$null}");
                }
            }
        }

        // Unwrap the block payload back to a bare object.
        DB::statement("UPDATE `page_blocks` SET `data` = JSON_EXTRACT(`data`, '$.id') WHERE `data` IS NOT NULL");
    }
};
