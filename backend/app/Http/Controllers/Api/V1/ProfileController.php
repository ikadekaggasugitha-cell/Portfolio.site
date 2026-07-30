<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProfileResource;
use App\Models\Profile;
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

    /** Shared by store() and update() — keep the two in step. */
    private function rules(): array
    {
        return [
            'photo' => 'nullable|string|max:255',
            'photo_media_id' => 'nullable|integer|exists:media,id',
            'name' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'about_lead' => 'nullable|string|max:255',
            'about_body' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
            'is_available' => 'sometimes|boolean',
            'github' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'cv' => 'nullable|string|max:255',
        ];
    }

    /** Mirrors `photo_media_id` into `photo` so consumers reading only `photo` still work. */
    private function syncPhotoFromMedia(array $validated): array
    {
        if (!empty($validated['photo_media_id'])) {
            $media = \App\Models\Media::find($validated['photo_media_id']);
            if ($media) {
                $validated['photo'] = $media->url;
            }
        }
        return $validated;
    }

    /**
     * Creates the single profile row. Previously there was no create route at all, so an
     * empty `profiles` table left the admin panel stuck on "No profile exists yet" and the
     * public site permanently on placeholder copy.
     *
     * `firstOrCreate` on user_id because that column is unique — a second POST must return
     * the existing row rather than a constraint violation.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->syncPhotoFromMedia($request->validate($this->rules()));

        $profile = Profile::firstOrCreate(
            ['user_id' => $request->user()->id],
            $validated,
        );
        $profile->loadMissing('media');

        return $profile->wasRecentlyCreated
            ? $this->created(new ProfileResource($profile), 'Profile created')
            : $this->success(new ProfileResource($profile), 'Profile already exists');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $this->syncPhotoFromMedia($request->validate($this->rules()));

        $profile = $this->profileService->update($id, $validated);
        // eager load media relation for response
        $profile->loadMissing('media');
        return $this->success(new ProfileResource($profile), 'Profile updated');
    }
}
