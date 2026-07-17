<?php

use App\Models\Media;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Map existing profiles.photo (URL) into media records and set profiles.photo_media_id
        $profiles = DB::table('profiles')
            ->whereNotNull('photo')
            ->whereNull('photo_media_id')
            ->get();

        foreach ($profiles as $p) {
            $photo = trim($p->photo);
            if (empty($photo)) {
                continue;
            }

            // Try find media by exact URL
            $media = Media::where('url', $photo)->first();

            // If not found, try matching by filename or path fragment
            if (!$media) {
                $basename = basename(parse_url($photo, PHP_URL_PATH) ?: $photo);
                if (!empty($basename)) {
                    $media = Media::where('filename', $basename)
                        ->orWhere('path', 'like', "%{$basename}%")
                        ->first();
                }
            }

            // If still not found, create a lightweight media record so we can reference it
            if (!$media) {
                $basename = isset($basename) && $basename ? $basename : $photo;
                $media = Media::create([
                    'filename' => $basename,
                    'path' => null,
                    'url' => $photo,
                    'mime_type' => null,
                    'size' => null,
                    'collection' => null,
                    'caption' => null,
                    'alt' => null,
                    'meta' => ['imported_from_profile' => true],
                ]);
            }

            // Update profile to reference media id
            if ($media && $media->id) {
                DB::table('profiles')->where('id', $p->id)->update(['photo_media_id' => $media->id]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Find media records that were created by this import (meta.imported_from_profile = true)
        $ids = Media::where('meta->imported_from_profile', true)->pluck('id')->toArray();

        if (!empty($ids)) {
            // Clear profile references
            DB::table('profiles')->whereIn('photo_media_id', $ids)->update(['photo_media_id' => null]);

            // Remove the imported media rows
            Media::whereIn('id', $ids)->delete();
        }
    }
};
