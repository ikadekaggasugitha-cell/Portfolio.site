<?php

namespace App\Services;

use App\Repositories\Contracts\ProjectImageRepositoryInterface;

class ProjectImageService extends BaseService
{
    public function __construct(ProjectImageRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
