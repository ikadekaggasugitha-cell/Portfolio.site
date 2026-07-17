<?php

namespace App\Services;

use App\Repositories\Contracts\ExperienceRepositoryInterface;

class ExperienceService extends BaseService
{
    public function __construct(ExperienceRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
