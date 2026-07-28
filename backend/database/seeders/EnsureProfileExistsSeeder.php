<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Creates a minimal, editable profile row if none exists yet, so the admin
 * Profile page has something to load and update instead of showing
 * "No profile exists yet." Safe to run multiple times (no-ops if a profile
 * is already present). Run with:
 * php artisan db:seed --class=EnsureProfileExistsSeeder
 */
class EnsureProfileExistsSeeder extends Seeder
{
    public function run(): void
    {
        if (Profile::query()->exists()) {
            $this->command->info('A profile already exists, nothing to do.');
            return;
        }

        $user = User::where('is_admin', true)->first() ?? User::first();

        if (!$user) {
            $this->command->error('No user found to attach a profile to. Create an admin user first.');
            return;
        }

        Profile::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'is_available' => true,
        ]);

        $this->command->info("Profile created for user #{$user->id} ({$user->email}). Fill in the rest from the admin panel.");
    }
}
