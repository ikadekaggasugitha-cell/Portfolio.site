<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ExperienceResource;
use App\Services\ExperienceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function __construct(
        protected ExperienceService $experienceService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            ExperienceResource::collection($this->experienceService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $experience = $this->experienceService->findById($id);
        if (!$experience) {
            return $this->notFound('Experience not found');
        }
        return $this->success(new ExperienceResource($experience));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->autoTranslate(
            $request->validate([
                'company' => 'required|string|max:255',
                ...$this->translatableRules('position', required: true),
                'location' => 'nullable|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                ...$this->translatableRules('description', max: null),
            ]),
            ['position', 'description']
        );

        $experience = $this->experienceService->create($validated);
        return $this->created(new ExperienceResource($experience), 'Experience created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $this->autoTranslate(
            $request->validate([
                'company' => 'sometimes|string|max:255',
                ...$this->translatableRules('position'),
                'location' => 'nullable|string|max:255',
                'start_date' => 'sometimes|date',
                'end_date' => 'nullable|date|after:start_date',
                ...$this->translatableRules('description', max: null),
            ]),
            ['position', 'description']
        );

        $experience = $this->experienceService->update($id, $validated);
        return $this->success(new ExperienceResource($experience), 'Experience updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->experienceService->delete($id);
        return $this->noContent('Experience deleted');
    }
}
