<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class ProfileResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // keep photo for backward compatibility; prefer media when available
            'photo' => $this->when($this->media, fn() => $this->media->url, $this->photo),
            'photo_media_id' => $this->photo_media_id,
            'media' => $this->when($this->relationLoaded('media') && $this->media, fn() => new \App\Http\Resources\Api\V1\MediaResource($this->media)),
            'name' => $this->name,
            'title' => $this->title,
            'description' => $this->description,
            'phone' => $this->phone,
            'github' => $this->github,
            'linkedin' => $this->linkedin,
            'cv' => $this->cv,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
