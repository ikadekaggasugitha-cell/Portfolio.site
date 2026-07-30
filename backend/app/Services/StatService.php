<?php

namespace App\Services;

use App\Repositories\Contracts\StatRepositoryInterface;

class StatService extends BaseService
{
    public function __construct(StatRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
