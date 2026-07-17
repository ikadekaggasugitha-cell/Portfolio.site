<?php

namespace App\Services;

use App\Repositories\Contracts\EducationRepositoryInterface;

class EducationService extends BaseService
{
    public function __construct(EducationRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
