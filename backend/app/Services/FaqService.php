<?php

namespace App\Services;

use App\Repositories\Contracts\FaqRepositoryInterface;

class FaqService extends BaseService
{
    public function __construct(FaqRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
