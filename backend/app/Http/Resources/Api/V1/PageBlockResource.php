<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;

class PageBlockResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'page_id' => $this->page_id,
            'type' => $this->type,
            'data' => $this->data,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
