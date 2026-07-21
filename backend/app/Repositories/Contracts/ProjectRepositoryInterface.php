<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Paginate projects with optional server-side search + technology filter,
     * eager-loading images and ordering by featured, then manual sort order.
     *
     * @param array{search?: ?string, technology?: ?string} $filters
     */
    public function paginateFiltered(array $filters, int $perPage = 9): LengthAwarePaginator;
}
