<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'github_url',
        'demo_url',
        'technology',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                // `slug` is unique and not settable from the admin form, so two projects
                // with titles that slugify alike used to fail with an opaque 500.
                $base = Str::slug($project->title) ?: 'project';
                $slug = $base;
                $suffix = 2;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $suffix++;
                }
                $project->slug = $slug;
            }
        });
    }

    public function images(): HasMany
    {
        // Ordered here, not just in the admin UI: the public site takes images[0] as the
        // cover, so without this the admin's drag-to-reorder had no visible effect.
        // `id` breaks ties for legacy rows that all share sort_order 0.
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order')->orderBy('id');
    }
}
