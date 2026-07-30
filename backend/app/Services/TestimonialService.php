<?php

namespace App\Services;

use App\Repositories\Contracts\TestimonialRepositoryInterface;

class TestimonialService extends BaseService
{
    public function __construct(TestimonialRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
