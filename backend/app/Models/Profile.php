<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['title', 'description', 'about_lead', 'about_body'];

    protected $fillable = [
        'user_id',
        'photo',
        'photo_media_id',
        'name',
        'title',
        'description',
        'about_lead',
        'about_body',
        'phone',
        'email',
        'location',
        'is_available',
        'github',
        'linkedin',
        'cv',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'photo_media_id');
    }
}

