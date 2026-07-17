<?php

namespace App\Services;

use App\Repositories\Contracts\ProfileRepositoryInterface;

class ProfileService extends BaseService
{
    public function __construct(ProfileRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
