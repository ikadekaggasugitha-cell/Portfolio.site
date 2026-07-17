<?php

namespace App\Repositories;

use App\Models\Education;
use App\Repositories\Contracts\EducationRepositoryInterface;

class EducationRepository extends BaseRepository implements EducationRepositoryInterface
{
    public function __construct(Education $model)
    {
        parent::__construct($model);
    }
}
