<?php

namespace App\Repositories;

use App\Models\Stat;
use App\Repositories\Concerns\OrdersBySortOrder;
use App\Repositories\Contracts\StatRepositoryInterface;

class StatRepository extends BaseRepository implements StatRepositoryInterface
{
    use OrdersBySortOrder;

    public function __construct(Stat $model)
    {
        parent::__construct($model);
    }
}
