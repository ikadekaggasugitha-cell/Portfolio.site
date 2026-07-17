<?php

namespace App\Services;

use App\Repositories\Contracts\CertificateRepositoryInterface;

class CertificateService extends BaseService
{
    public function __construct(CertificateRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
