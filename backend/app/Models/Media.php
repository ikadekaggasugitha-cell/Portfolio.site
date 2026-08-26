<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'path',
        'url',
        'mime_type',
        'size',
        'collection',
        'caption',
        'alt',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * Resolve at read time from the current media disk instead of trusting the
     * absolute snapshot stored at upload time. Rows written before MEDIA_DISK
     * pointed at object storage kept a dead host (e.g. http://localhost:8000)
     * in `url`; deriving from `path` repairs them on read once the disk is
     * switched. External URLs (no path) pass through untouched.
     */
    public function getUrlAttribute(?string $value): ?string
    {
        return $this->path
            ? Storage::disk(config('filesystems.media_disk', 'public'))->url($this->path)
            : $value;
    }
}
