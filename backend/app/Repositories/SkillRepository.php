<?php

namespace App\Repositories;

use App\Models\Skill;
use App\Repositories\Contracts\SkillRepositoryInterface;

class SkillRepository extends BaseRepository implements SkillRepositoryInterface
{
    public function __construct(Skill $model)
    {
        parent::__construct($model);
    }
}
