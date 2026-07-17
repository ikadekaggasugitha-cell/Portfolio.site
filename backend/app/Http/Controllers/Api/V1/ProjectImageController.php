<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProjectImageResource;
use App\Services\ProjectImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectImageController extends Controller
{
    public function __construct(
        protected ProjectImageService $projectImageService
    ) {}

    public function index(int $projectId): JsonResponse
    {
        $images = $this->projectImageService->findByField('project_id', $projectId);
        return $this->success(ProjectImageResource::collection($images));
    }

    public function store(Request $request, int $projectId): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'caption' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['image'] = $request->file('image')->store('projects', 'public');
        $validated['project_id'] = $projectId;
        $image = $this->projectImageService->create($validated);
        return $this->created(new ProjectImageResource($image), 'Image added');
    }

    public function reorder(Request $request, int $projectId): JsonResponse
    {
        $validated = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer'
        ]);

        $order = $validated['order'];
        $pos = 0;
        foreach ($order as $id) {
            // Ensure the image belongs to the project before updating
            $img = $this->projectImageService->findById((int) $id);
            if ($img && $img->project_id == $projectId) {
                $this->projectImageService->update((int) $id, ['sort_order' => $pos]);
                $pos++;
            }
        }

        return $this->success([], 'Order updated');
    }

    public function attach(Request $request, int $projectId): JsonResponse
    {
        $validated = $request->validate([
            'media_ids' => 'required_without:media_id|array',
            'media_ids.*' => 'integer',
            'media_id' => 'required_without:media_ids|integer',
            'caption' => 'nullable|string|max:255',
        ]);

        $mediaIds = $validated['media_ids'] ?? (isset($validated['media_id']) ? [(int)$validated['media_id']] : []);

        $created = [];
        // find current max sort_order for project
        $existing = $this->projectImageService->findByField('project_id', $projectId);
        $maxOrder = $existing->max('sort_order') ?? 0;
        foreach ($mediaIds as $mid) {
            $media = \App\Models\Media::find($mid);
            if (!$media) continue;
            $maxOrder++;
            $data = [
                'project_id' => $projectId,
                'image' => $media->url,
                'caption' => $validated['caption'] ?? $media->caption ?? null,
                'sort_order' => $maxOrder,
            ];
            $img = $this->projectImageService->create($data);
            $created[] = $img;
        }

        return $this->created(\App\Http\Resources\Api\V1\ProjectImageResource::collection(collect($created)), 'Attached media as project images');
    }

    public function destroy($id): JsonResponse
    {
        $this->projectImageService->delete((int) $id);
        return $this->noContent('Image deleted');
    }
}
