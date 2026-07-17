<?php

namespace App\Repositories;

use App\Models\ProjectImage;
use App\Repositories\Contracts\ProjectImageRepositoryInterface;

class ProjectImageRepository extends BaseRepository implements ProjectImageRepositoryInterface
{
    public function __construct(ProjectImage $model)
    {
        parent::__construct($model);
    }
}
