<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::factory()->create([
            'user_id' => 1,
            'name' => 'I Kadek Agga Sugitha',
            'title' => 'Fullstack Software Engineer',
        ]);
    }
}
