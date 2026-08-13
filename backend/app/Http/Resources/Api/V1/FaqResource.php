<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class FaqResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->getTranslations('question'),
            'answer' => $this->getTranslations('answer'),
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
