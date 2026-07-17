<?php

namespace App\Repositories;

use App\Models\Experience;
use App\Repositories\Contracts\ExperienceRepositoryInterface;

class ExperienceRepository extends BaseRepository implements ExperienceRepositoryInterface
{
    public function __construct(Experience $model)
    {
        parent::__construct($model);
    }
}
