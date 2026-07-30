<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class StatResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'value' => (int) $this->value,
            'suffix' => $this->suffix,
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
