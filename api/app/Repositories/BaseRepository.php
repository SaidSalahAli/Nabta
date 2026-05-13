<?php

namespace Nabta\Repositories;

use Nabta\Models\BaseModel;

/**
 * Base Repository - Data access layer
 */
abstract class BaseRepository
{
    protected BaseModel $model;

    public function __construct(BaseModel $model)
    {
        $this->model = $model;
    }

    /**
     * Get by ID
     */
    public function getById(int $id)
    {
        return $this->model->find($id);
    }

    /**
     * Get by slug
     */
    public function getBySlug(string $slug)
    {
        return $this->model->findBySlug($slug);
    }

    /**
     * Get all
     */
    public function getAll(?int $limit = null, int $offset = 0): array
    {
        return $this->model->all($limit, $offset);
    }

    /**
     * Get paginated
     */
    public function getPaginated(int $page = 1, int $perPage = 15): array
    {
        return $this->model->paginate($page, $perPage);
    }

    /**
     * Create
     */
    public function create(array $data): int|bool
    {
        return $this->model->create($data);
    }

    /**
     * Update
     */
    public function update(int $id, array $data): bool
    {
        return $this->model->update($id, $data);
    }

    /**
     * Delete
     */
    public function delete(int $id): bool
    {
        return $this->model->delete($id);
    }

    /**
     * Check exists
     */
    public function exists(int $id): bool
    {
        return $this->model->exists($id);
    }

    /**
     * Get count
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Search
     */
    public function search(string $query, array $fields): array
    {
        return $this->model->search($query, $fields);
    }

    /**
     * Get model
     */
    public function getModel(): BaseModel
    {
        return $this->model;
    }
}
