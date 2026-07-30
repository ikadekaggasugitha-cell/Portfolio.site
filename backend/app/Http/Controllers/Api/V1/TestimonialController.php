<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\TestimonialResource;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct(
        protected TestimonialService $testimonialService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            TestimonialResource::collection($this->testimonialService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->findById($id);
        if (!$testimonial) {
            return $this->notFound('Testimonial not found');
        }
        return $this->success(new TestimonialResource($testimonial));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quote' => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_title' => 'nullable|string|max:255',
            'initials' => 'nullable|string|max:4',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $testimonial = $this->testimonialService->create($validated);
        return $this->created(new TestimonialResource($testimonial), 'Testimonial created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quote' => 'sometimes|string',
            'author_name' => 'sometimes|string|max:255',
            'author_title' => 'nullable|string|max:255',
            'initials' => 'nullable|string|max:4',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $testimonial = $this->testimonialService->update($id, $validated);
        return $this->success(new TestimonialResource($testimonial), 'Testimonial updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->testimonialService->delete($id);
        return $this->noContent('Testimonial deleted');
    }
}
