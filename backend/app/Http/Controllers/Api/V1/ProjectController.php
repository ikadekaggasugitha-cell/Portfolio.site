<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectService $projectService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 9), 1), 50);

        $search = trim((string) $request->query('search', ''));
        $technology = trim((string) $request->query('technology', ''));

        $projects = $this->projectService->paginateFiltered([
            'search' => $search !== '' ? $search : null,
            'technology' => $technology !== '' ? $technology : null,
        ], $perPage);

        return $this->paginated($projects, ProjectResource::collection($projects));
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->findById($id);
        if (!$project) {
            return $this->notFound('Project not found');
        }
        $project->load('images');
        return $this->success(new ProjectResource($project));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'technology' => 'nullable|string|max:255',
            'is_featured' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $project = $this->projectService->create($validated);
        return $this->created(new ProjectResource($project), 'Project created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'technology' => 'nullable|string|max:255',
            'is_featured' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $project = $this->projectService->update($id, $validated);
        return $this->success(new ProjectResource($project), 'Project updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->projectService->delete($id);
        return $this->noContent('Project deleted');
    }
}
