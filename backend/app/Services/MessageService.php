<?php

namespace App\Services;

use App\Models\Message;
use App\Repositories\Contracts\MessageRepositoryInterface;

class MessageService extends BaseService
{
    public function __construct(MessageRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function markAsRead(int $id): Message
    {
        return $this->update($id, ['is_read' => true, 'read_at' => now()]);
    }

    public function unreadCount(): int
    {
        return $this->repository->findByField('is_read', false)->count();
    }
}
