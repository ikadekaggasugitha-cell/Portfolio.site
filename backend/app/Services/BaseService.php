<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseService
{
    public function __construct(
        protected BaseRepositoryInterface $repository
    ) {}

    public function all(array $columns = ['*']): Collection
    {
        return $this->repository->all($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $columns);
    }

    public function findById(int $id): ?Model
    {
        return $this->repository->findById($id);
    }

    public function findByField(string $field, mixed $value, array $columns = ['*']): Collection
    {
        return $this->repository->findByField($field, $value, $columns);
    }

    public function findFirstByField(string $field, mixed $value, array $columns = ['*']): ?Model
    {
        return $this->repository->findFirstByField($field, $value, $columns);
    }

    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            $model = $this->repository->create($data);
            Log::info(class_basename($this) . ': Created', ['id' => $model->id]);
            return $model;
        });
    }

    public function update(int $id, array $data): Model
    {
        return DB::transaction(function () use ($id, $data) {
            $model = $this->repository->update($id, $data);
            Log::info(class_basename($this) . ': Updated', ['id' => $id]);
            return $model;
        });
    }

    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $result = $this->repository->delete($id);
            Log::info(class_basename($this) . ': Deleted', ['id' => $id]);
            return $result;
        });
    }
}
