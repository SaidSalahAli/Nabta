<?php

namespace Nabta\Repositories;

use Nabta\Models\BaseModel;

/**
 * Base Repository - Data access layer
 *
 * @template TModel of BaseModel
 */
abstract class BaseRepository
{
    /** @var TModel */
    protected BaseModel $model;

    /** @param TModel $model */
    public function __construct(BaseModel $model)
    {
        $this->model = $model;
    }

    public function getById(int $id): mixed
    {
        return $this->model->find($id);
    }

    public function getBySlug(string $slug): mixed
    {
        return $this->model->findBySlug($slug);
    }

    public function getAll(?int $limit = null, int $offset = 0): array
    {
        return $this->model->all($limit, $offset);
    }

    public function getPaginated(int $page = 1, int $perPage = 15): array
    {
        return $this->model->paginate($page, $perPage);
    }

    public function create(array $data): int|bool
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->model->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->model->delete($id);
    }

    public function exists(int $id): bool
    {
        return $this->model->exists($id);
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function search(string $query, array $fields): array
    {
        return $this->model->search($query, $fields);
    }

    public function getModel(): BaseModel
    {
        return $this->model;
    }
}