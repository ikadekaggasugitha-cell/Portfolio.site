<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
    use HasFactory;

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
