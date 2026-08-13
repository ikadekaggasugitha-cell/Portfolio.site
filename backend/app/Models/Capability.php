<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Capability extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['title', 'description'];

    protected $table = 'capabilities';

    protected $fillable = [
        'title',
        'description',
        'icon',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
