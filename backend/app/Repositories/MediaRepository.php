<?php

namespace App\Repositories;

use App\Models\Media;
use App\Repositories\Contracts\MediaRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class MediaRepository extends BaseRepository implements MediaRepositoryInterface
{
    public function __construct(Media $model)
    {
        parent::__construct($model);
    }

    /**
     * Newest first. The library and the media picker only ever show the first page, so
     * an unordered paginate() left a freshly uploaded file unreachable — it could not be
     * attached to a project, re-captioned or deleted.
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->orderByDesc('id')->paginate($perPage, $columns);
    }
}
