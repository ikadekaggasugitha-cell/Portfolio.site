<?php

namespace App\Repositories;

use App\Models\Capability;
use App\Repositories\Concerns\OrdersBySortOrder;
use App\Repositories\Contracts\CapabilityRepositoryInterface;

class CapabilityRepository extends BaseRepository implements CapabilityRepositoryInterface
{
    use OrdersBySortOrder;

    public function __construct(Capability $model)
    {
        parent::__construct($model);
    }
}
