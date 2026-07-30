<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\StatResource;
use App\Services\StatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatController extends Controller
{
    public function __construct(
        protected StatService $statService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            StatResource::collection($this->statService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $stat = $this->statService->findById($id);
        if (!$stat) {
            return $this->notFound('Stat not found');
        }
        return $this->success(new StatResource($stat));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|integer|min:0',
            'suffix' => 'nullable|string|max:8',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $stat = $this->statService->create($validated);
        return $this->created(new StatResource($stat), 'Stat created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'sometimes|string|max:255',
            'value' => 'sometimes|integer|min:0',
            'suffix' => 'nullable|string|max:8',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $stat = $this->statService->update($id, $validated);
        return $this->success(new StatResource($stat), 'Stat updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->statService->delete($id);
        return $this->noContent('Stat deleted');
    }
}
