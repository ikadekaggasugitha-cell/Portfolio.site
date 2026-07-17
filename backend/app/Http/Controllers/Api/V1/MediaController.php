<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MediaResource;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(protected MediaService $mediaService) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 24);
        $page = (int) $request->get('page', 1);

        $items = $this->mediaService->paginate($perPage);
        return $this->success(MediaResource::collection($items));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
            'collection' => 'nullable|string|max:100',
            'caption' => 'nullable|string|max:255',
            'alt' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');
        $url = asset('storage/' . $path);

        $meta = [
            'original_name' => $file->getClientOriginalName(),
        ];

        $media = $this->mediaService->createFromUploadedFile([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => $url,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'collection' => $validated['collection'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'alt' => $validated['alt'] ?? null,
            'meta' => $meta,
        ]);

        return $this->created(new MediaResource($media), 'Media uploaded');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'caption' => 'nullable|string|max:255',
            'alt' => 'nullable|string|max:255',
            'collection' => 'nullable|string|max:100',
            'meta' => 'nullable|array',
        ]);

        $media = $this->mediaService->update($id, $validated);
        return $this->success(new MediaResource($media), 'Media updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->mediaService->delete($id);
        return $this->noContent('Media deleted');
    }
}
