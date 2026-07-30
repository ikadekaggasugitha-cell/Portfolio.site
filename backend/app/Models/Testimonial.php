<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

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
