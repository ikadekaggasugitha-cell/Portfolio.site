<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function paginateFiltered(array $filters, int $perPage = 9): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('images');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('technology', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['technology'])) {
            $technology = $filters['technology'];
            $query->where('technology', 'like', "%{$technology}%");
        }

        return $query
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }
}
