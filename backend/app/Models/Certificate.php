<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Certificate extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'issuer',
        'issued_date',
        'file',
        'description',
        'expiry_date',
        'credential_url',
    ];

    protected function casts(): array
    {
        return [
            'issued_date' => 'date',
            'expiry_date' => 'date',
        ];
    }
}
