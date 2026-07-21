<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class ProjectResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'github_url' => $this->github_url,
            'demo_url' => $this->demo_url,
            'technology' => $this->technology,
            'is_featured' => (bool) $this->is_featured,
            'sort_order' => (int) $this->sort_order,
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
