<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SkillResource;
use App\Services\SkillService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function __construct(
        protected SkillService $skillService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            SkillResource::collection($this->skillService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $skill = $this->skillService->findById($id);
        if (!$skill) {
            return $this->notFound('Skill not found');
        }
        return $this->success(new SkillResource($skill));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'skill_name' => 'required|string|max:255',
            'level' => 'required|integer|min:1|max:5',
        ]);

        $skill = $this->skillService->create($validated);
        return $this->created(new SkillResource($skill), 'Skill created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'skill_name' => 'sometimes|string|max:255',
            'level' => 'sometimes|integer|min:1|max:5',
        ]);

        $skill = $this->skillService->update($id, $validated);
        return $this->success(new SkillResource($skill), 'Skill updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->skillService->delete($id);
        return $this->noContent('Skill deleted');
    }
}
