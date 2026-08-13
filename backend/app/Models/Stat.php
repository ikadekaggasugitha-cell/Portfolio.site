<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Stat extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['label'];

    protected $table = 'stats';

    protected $fillable = [
        'label',
        'value',
        'suffix',
        'sort_order',
    ];

    protected $casts = [
        'value' => 'integer',
        'sort_order' => 'integer',
    ];
}
