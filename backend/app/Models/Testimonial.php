<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Testimonial extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['quote', 'author_title'];

    protected $table = 'testimonials';

    protected $fillable = [
        'quote',
        'author_name',
        'author_title',
        'initials',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
