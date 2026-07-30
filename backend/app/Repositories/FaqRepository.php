<?php

namespace App\Repositories;

use App\Models\Faq;
use App\Repositories\Concerns\OrdersBySortOrder;
use App\Repositories\Contracts\FaqRepositoryInterface;

class FaqRepository extends BaseRepository implements FaqRepositoryInterface
{
    use OrdersBySortOrder;

    public function __construct(Faq $model)
    {
        parent::__construct($model);
    }
}
