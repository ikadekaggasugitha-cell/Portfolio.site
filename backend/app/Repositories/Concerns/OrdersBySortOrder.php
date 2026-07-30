<?php

namespace App\Repositories\Concerns;

use Illuminate\Database\Eloquent\Collection;

/**
 * Hand-arranged content lists (stats, capabilities, testimonials, FAQs) must come back in
 * the order the owner set in the admin panel. `id` breaks ties so rows that share the
 * default sort_order of 0 still have a stable order.
 */
trait OrdersBySortOrder
{
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->orderBy('sort_order')->orderBy('id')->get($columns);
    }
}
