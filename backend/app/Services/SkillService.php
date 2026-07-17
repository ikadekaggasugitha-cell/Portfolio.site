<?php

namespace App\Services;

use App\Repositories\Contracts\SkillRepositoryInterface;

class SkillService extends BaseService
{
    public function __construct(SkillRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
