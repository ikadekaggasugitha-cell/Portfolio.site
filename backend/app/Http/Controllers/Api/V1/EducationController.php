<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\EducationResource;
use App\Services\EducationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function __construct(
        protected EducationService $educationService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            EducationResource::collection($this->educationService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $education = $this->educationService->findById($id);
        if (!$education) {
            return $this->notFound('Education not found');
        }
        return $this->success(new EducationResource($education));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        $education = $this->educationService->create($validated);
        return $this->created(new EducationResource($education), 'Education created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'institution' => 'sometimes|string|max:255',
            'degree' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        $education = $this->educationService->update($id, $validated);
        return $this->success(new EducationResource($education), 'Education updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->educationService->delete($id);
        return $this->noContent('Education deleted');
    }
}
