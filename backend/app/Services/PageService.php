<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PageBlock;
use App\Repositories\Contracts\PageRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PageService extends BaseService
{
    public function __construct(PageRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function findBySlug(string $slug)
    {
        return $this->repository->findFirstByField('slug', $slug);
    }

    /**
     * Sync provided blocks array with PageBlock records for the page.
     * Each block item may include id (existing), type, data (array), sort_order, is_active
     */
    public function syncBlocks(int|Page $pageOrId, array $blocks): Page
    {
        if ($pageOrId instanceof Page) {
            $page = $pageOrId;
        } else {
            $page = $this->findById($pageOrId);
            if (!$page) throw new ModelNotFoundException('Page not found');
        }

        $existing = $page->blocks()->get()->keyBy('id');
        $keep = [];

        foreach ($blocks as $index => $b) {
            if (!isset($b['type'])) continue;

            $data = $b['data'] ?? [];
            $sort = $b['sort_order'] ?? $index;
            $isActive = $b['is_active'] ?? true;

            if (!empty($b['id']) && isset($existing[$b['id']])) {
                $blk = $existing[$b['id']];
                $blk->update([
                    'type' => $b['type'],
                    'data' => $data,
                    'sort_order' => $sort,
                    'is_active' => $isActive,
                ]);
                $keep[] = $blk->id;
            } else {
                $new = $page->blocks()->create([
                    'type' => $b['type'],
                    'data' => $data,
                    'sort_order' => $sort,
                    'is_active' => $isActive,
                ]);
                $keep[] = $new->id;
            }
        }

        // delete blocks that were removed
        if (count($keep) > 0) {
            $page->blocks()->whereNotIn('id', $keep)->delete();
        } else {
            // if no blocks provided - remove all
            $page->blocks()->delete();
        }

        return $page->load('blocks');
    }
}
