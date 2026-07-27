<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Resets (or creates) an admin user's password, optionally changing the
 * email too. Run with: php artisan db:seed --class=ResetAdminPasswordSeeder
 *
 * Env overrides (all optional):
 * ADMIN_RESET_EMAIL=admin@example.com   the account to find (default admin@example.com)
 * ADMIN_NEW_EMAIL=new@example.com       change the email to this
 * ADMIN_RESET_PASSWORD=SomeP4ss         set this exact password (default: random)
 */
class ResetAdminPasswordSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_RESET_EMAIL', 'admin@example.com');
        $newEmail = env('ADMIN_NEW_EMAIL');
        $password = env('ADMIN_RESET_PASSWORD') ?: Str::random(18);

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $user->name ?: 'Super Admin';
        $user->is_admin = true;
        $user->password = $password; // hashed automatically via User::$casts

        if ($newEmail) {
            $user->email = $newEmail;
        }

        $user->save();

        $this->command->info("Admin account: {$user->email}");
        $this->command->info("New password: {$password}");
    }
}
