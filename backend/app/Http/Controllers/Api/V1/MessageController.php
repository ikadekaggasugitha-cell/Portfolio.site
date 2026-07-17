<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MessageResource;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(
        protected MessageService $messageService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            MessageResource::collection($this->messageService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $message = $this->messageService->markAsRead($id);
        return $this->success(new MessageResource($message));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = $this->messageService->create($validated);
        return $this->created(new MessageResource($message), 'Message sent');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->messageService->delete($id);
        return $this->noContent('Message deleted');
    }
}
