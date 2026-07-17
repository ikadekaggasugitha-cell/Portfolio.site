<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PageResource;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function __construct(protected PageService $pageService) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->pageService->paginate(50);
        return $this->success(PageResource::collection($items));
    }

    public function show(int $id): JsonResponse
    {
        $page = $this->pageService->findById($id);
        if (!$page) return $this->notFound('Page not found');
        return $this->success(new PageResource($page->load('blocks')));
    }

    // Public endpoint to fetch published page by slug
    public function publicShow(string $slug): JsonResponse
    {
        $page = $this->pageService->findBySlug($slug);
        if (!$page || !$page->is_published) return $this->notFound('Page not found');
        return $this->success(new PageResource($page->load('blocks')));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:255|unique:pages,slug',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'template' => 'nullable|string',
            'meta' => 'nullable|array',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'blocks' => 'nullable|array',
            'blocks.*.id' => 'nullable|integer',
            'blocks.*.type' => 'required_with:blocks|string',
            'blocks.*.data' => 'nullable|array',
            'blocks.*.sort_order' => 'nullable|integer',
            'blocks.*.is_active' => 'nullable|boolean',
        ]);

        $blocks = $request->input('blocks', []);

        $page = $this->pageService->create($validated);

        if (!empty($blocks)) {
            $page = $this->pageService->syncBlocks($page, $blocks);
        } else {
            $page->load('blocks');
        }

        return $this->created(new PageResource($page), 'Page created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'slug' => "required|string|max:255|unique:pages,slug,{$id}",
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'template' => 'nullable|string',
            'meta' => 'nullable|array',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'blocks' => 'nullable|array',
            'blocks.*.id' => 'nullable|integer',
            'blocks.*.type' => 'required_with:blocks|string',
            'blocks.*.data' => 'nullable|array',
            'blocks.*.sort_order' => 'nullable|integer',
            'blocks.*.is_active' => 'nullable|boolean',
        ]);

        $blocks = $request->input('blocks', []);

        $page = $this->pageService->update($id, $validated);

        if (!empty($blocks)) {
            $page = $this->pageService->syncBlocks($page, $blocks);
        } else {
            $page->load('blocks');
        }

        return $this->success(new PageResource($page), 'Page updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->pageService->delete($id);
        return $this->noContent('Page deleted');
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'is_published' => 'required|boolean',
            'published_at' => 'nullable|date',
        ]);

        $page = $this->pageService->update($id, $validated);
        return $this->success(new PageResource($page), 'Page publish updated');
    }
}
