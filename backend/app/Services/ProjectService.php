<?php

namespace App\Services;

use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectService extends BaseService
{
    public function __construct(ProjectRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * @param array{search?: ?string, technology?: ?string} $filters
     */
    public function paginateFiltered(array $filters, int $perPage = 9): LengthAwarePaginator
    {
        /** @var ProjectRepositoryInterface $repository */
        $repository = $this->repository;
        return $repository->paginateFiltered($filters, $perPage);
    }
}
