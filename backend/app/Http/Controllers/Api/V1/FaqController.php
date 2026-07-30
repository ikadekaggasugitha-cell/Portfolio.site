<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\FaqResource;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function __construct(
        protected FaqService $faqService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            FaqResource::collection($this->faqService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $faq = $this->faqService->findById($id);
        if (!$faq) {
            return $this->notFound('FAQ not found');
        }
        return $this->success(new FaqResource($faq));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $faq = $this->faqService->create($validated);
        return $this->created(new FaqResource($faq), 'FAQ created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'sometimes|string|max:255',
            'answer' => 'sometimes|string',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $faq = $this->faqService->update($id, $validated);
        return $this->success(new FaqResource($faq), 'FAQ updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->faqService->delete($id);
        return $this->noContent('FAQ deleted');
    }
}
