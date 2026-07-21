<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProfileResource;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            ProfileResource::collection($this->profileService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $profile = $this->profileService->findById($id);
        if (!$profile) {
            return $this->notFound('Profile not found');
        }
        return $this->success(new ProfileResource($profile));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'photo' => 'nullable|string|max:255',
            'photo_media_id' => 'nullable|integer|exists:media,id',
            'name' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
            'is_available' => 'sometimes|boolean',
            'github' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'cv' => 'nullable|string|max:255',
        ]);

        // If a media id was provided, fetch the media to keep photo (url) in sync for backward compatibility
        if (!empty($validated['photo_media_id'])) {
            // load media directly to avoid changing service layer here
            $media = \App\Models\Media::find($validated['photo_media_id']);
            if ($media) {
                $validated['photo'] = $media->url;
            }
        }

        $profile = $this->profileService->update($id, $validated);
        // eager load media relation for response
        $profile->loadMissing('media');
        return $this->success(new ProfileResource($profile), 'Profile updated');
    }
}
