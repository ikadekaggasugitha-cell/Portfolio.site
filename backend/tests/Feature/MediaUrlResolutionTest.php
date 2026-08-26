<?php

namespace Tests\Feature;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUrlResolutionTest extends TestCase
{
    public function test_url_is_resolved_from_current_disk_not_the_stored_snapshot(): void
    {
        Storage::fake('public');
        config()->set('filesystems.media_disk', 'public');

        // Simulates rows written in production before MEDIA_DISK pointed at
        // object storage: the snapshot holds a dead localhost host.
        $media = new Media([
            'path' => 'media/photo.jpg',
            'url' => 'http://localhost:8000/storage/media/photo.jpg',
        ]);

        $this->assertSame(
            Storage::disk('public')->url('media/photo.jpg'),
            $media->url,
        );
        $this->assertStringNotContainsString('localhost', (string) $media->url);
    }

    public function test_url_follows_a_media_disk_switch(): void
    {
        Storage::fake('s3');
        config()->set('filesystems.media_disk', 's3');

        $media = new Media([
            'path' => 'media/photo.jpg',
            'url' => 'http://localhost:8000/storage/media/photo.jpg',
        ]);

        $this->assertSame(
            Storage::disk('s3')->url('media/photo.jpg'),
            $media->url,
        );
    }

    public function test_external_urls_without_path_pass_through(): void
    {
        $media = new Media([
            'url' => 'https://cdn.example.com/avatar.png',
        ]);

        $this->assertSame('https://cdn.example.com/avatar.png', $media->url);
    }
}
