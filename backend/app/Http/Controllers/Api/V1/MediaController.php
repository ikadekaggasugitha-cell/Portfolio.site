<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MediaResource;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,svg,pdf,doc,docx|max:5120',
            'collection' => 'nullable|string|max:100',
            'caption' => 'nullable|string|max:255',
            'alt' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $disk = config('filesystems.media_disk', 'public');

        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filenameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
        $safeName = \Illuminate\Support\Str::slug($filenameWithoutExt);
        if (empty($safeName)) {
            $safeName = 'file';
        }
        $filenameToStore = $safeName . '-' . \Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(6)) . ($extension ? '.' . $extension : '');

        $path = $file->storeAs('media', $filenameToStore, $disk);
        $url = Storage::disk($disk)->url($path);

        $meta = [
            'original_name' => $originalName,
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
