<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;

class PageResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'content' => $this->content,
            'template' => $this->template,
            'meta' => $this->meta,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at,
            'blocks' => \App\Http\Resources\Api\V1\PageBlockResource::collection($this->whenLoaded('blocks')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
