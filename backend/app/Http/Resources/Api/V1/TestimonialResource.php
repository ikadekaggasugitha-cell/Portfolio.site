<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class TestimonialResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote' => $this->getTranslations('quote'),
            'author_name' => $this->author_name,
            'author_title' => $this->getTranslations('author_title'),
            'initials' => $this->initials,
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
