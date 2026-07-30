<?php

namespace App\Repositories;

use App\Models\Testimonial;
use App\Repositories\Concerns\OrdersBySortOrder;
use App\Repositories\Contracts\TestimonialRepositoryInterface;

class TestimonialRepository extends BaseRepository implements TestimonialRepositoryInterface
{
    use OrdersBySortOrder;

    public function __construct(Testimonial $model)
    {
        parent::__construct($model);
    }
}
