<?php

namespace App\Repositories;

use App\Models\Profile;
use App\Repositories\Contracts\ProfileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProfileRepository extends BaseRepository implements ProfileRepositoryInterface
{
    public function __construct(Profile $model)
    {
        parent::__construct($model);
    }

    /**
     * Oldest first. Consumers all take the first row as "the" profile, and an unordered
     * all() leaves that to MySQL's discretion — if a second, emptier profile row ever
     * exists, the public site can silently start rendering that one instead.
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->orderBy('id')->get($columns);
    }
}
