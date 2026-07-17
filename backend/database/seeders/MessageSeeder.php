<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        Message::factory()->count(5)->create();
        Message::factory()->unread()->count(3)->create();
        Message::factory()->read()->count(2)->create();
    }
}
