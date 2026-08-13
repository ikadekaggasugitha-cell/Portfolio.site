<?php

namespace Tests\Feature;

use App\Services\AutoTranslationService;
use Tests\TestCase;

class AutoTranslationTest extends TestCase
{
    public function test_auto_translation_service_translates_id_to_en(): void
    {
        $service = new AutoTranslationService();
        $input = [
            'title' => 'Pengembang Web',
            'company' => 'PT Teknologi Indonesia',
        ];

        $translated = $service->processPayload($input, ['title']);

        $this->assertIsArray($translated['title']);
        $this->assertEquals('Pengembang Web', $translated['title']['id']);
        $this->assertNotEmpty($translated['title']['en']);
        // Verify company remains scalar string since it's not in translatable fields
        $this->assertEquals('PT Teknologi Indonesia', $translated['company']);
    }

    public function test_auto_translation_service_preserves_existing_en(): void
    {
        $service = new AutoTranslationService();
        $input = [
            'title' => [
                'id' => 'Pengembang Web',
                'en' => 'Full Stack Developer',
            ],
        ];

        $translated = $service->processPayload($input, ['title']);

        $this->assertEquals('Pengembang Web', $translated['title']['id']);
        $this->assertEquals('Full Stack Developer', $translated['title']['en']);
    }
}
