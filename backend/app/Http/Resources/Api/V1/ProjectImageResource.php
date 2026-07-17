<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class ProjectImageResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'caption' => $this->caption,
            'sort_order' => $this->sort_order,
        ];
    }
}
