<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CapabilityResource;
use App\Services\CapabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CapabilityController extends Controller
{
    public function __construct(
        protected CapabilityService $capabilityService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            CapabilityResource::collection($this->capabilityService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $capability = $this->capabilityService->findById($id);
        if (!$capability) {
            return $this->notFound('Capability not found');
        }
        return $this->success(new CapabilityResource($capability));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->autoTranslate(
            $request->validate([
                ...$this->translatableRules('title', required: true),
                ...$this->translatableRules('description', max: null),
                'icon' => 'nullable|string|max:50',
                'sort_order' => 'nullable|integer|min:0',
            ]),
            ['title', 'description']
        );

        $capability = $this->capabilityService->create($validated);
        return $this->created(new CapabilityResource($capability), 'Capability created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $this->autoTranslate(
            $request->validate([
                ...$this->translatableRules('title'),
                ...$this->translatableRules('description', max: null),
                'icon' => 'nullable|string|max:50',
                'sort_order' => 'nullable|integer|min:0',
            ]),
            ['title', 'description']
        );

        $capability = $this->capabilityService->update($id, $validated);
        return $this->success(new CapabilityResource($capability), 'Capability updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->capabilityService->delete($id);
        return $this->noContent('Capability deleted');
    }
}
