<?php

namespace App\Services;

use App\Repositories\Contracts\MediaRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class MediaService extends BaseService
{
    public function __construct(MediaRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function createFromUploadedFile(array $data): Model
    {
        // $data expected keys: filename, path, url, mime_type, size, collection, caption, alt, meta
        return $this->create($data);
    }
}
