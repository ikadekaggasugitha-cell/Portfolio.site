<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MediaProxyController extends Controller
{
    /**
     * Serve a media object from the configured media disk (Cloudflare R2) through this
     * backend's own domain.
     *
     * R2's public `r2.dev` URL is DNS-blocked by Indonesian ISPs (Internet Positif), so
     * images can't be linked directly. This route re-serves each object from the R2 S3
     * endpoint (which is reachable) over `*.vercel.app` (which is not blocked). The long,
     * immutable Cache-Control lets Vercel's CDN cache each object at the edge, so the
     * function runs at most once per object.
     */
    public function show(string $path): Response
    {
        if (str_contains($path, '..')) {
            abort(404);
        }

        $disk = Storage::disk(config('filesystems.media_disk', 'public'));

        if (! $disk->exists($path)) {
            abort(404);
        }

        $mime = $disk->mimeType($path) ?: $this->guessMimeFromPath($path);

        return response($disk->get($path), 200, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    private function guessMimeFromPath(string $path): string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
            default => 'application/octet-stream',
        };
    }
}
