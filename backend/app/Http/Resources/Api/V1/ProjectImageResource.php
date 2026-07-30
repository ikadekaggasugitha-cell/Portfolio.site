<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectImageResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            // `image` may hold a storage-relative path (direct upload) or, for rows written
            // by the older attach-from-media flow, an already-absolute URL. Storage::url()
            // blindly concatenates, so wrapping an absolute URL again produced a dead
            // double-prefixed link. Passing those through repairs existing rows on read.
            'image' => $this->image
                ? (Str::startsWith($this->image, ['http://', 'https://', '//'])
                    ? $this->image
                    : Storage::disk(config('filesystems.media_disk', 'public'))->url($this->image))
                : null,
            'caption' => $this->caption,
            'sort_order' => $this->sort_order,
        ];
    }
}
