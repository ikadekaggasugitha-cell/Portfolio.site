<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class SkillResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'skill_name' => $this->skill_name,
            'category' => $this->category,
            'level' => $this->level,
        ];
    }
}
