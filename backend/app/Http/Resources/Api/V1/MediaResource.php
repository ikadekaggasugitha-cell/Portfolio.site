<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;

class MediaResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'filename' => $this->filename,
            'path' => $this->path,
            'url' => $this->url,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'collection' => $this->collection,
            'caption' => $this->caption,
            'alt' => $this->alt,
            'meta' => $this->meta,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
