<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Education extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['degree', 'field_of_study', 'description'];

    protected $table = 'educations';

    protected $fillable = [
        'institution',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
