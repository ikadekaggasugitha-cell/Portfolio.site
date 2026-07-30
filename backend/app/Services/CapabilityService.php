<?php

namespace App\Services;

use App\Repositories\Contracts\CapabilityRepositoryInterface;

class CapabilityService extends BaseService
{
    public function __construct(CapabilityRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
