<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Development fixtures. Everything below is Faker-generated demo data.
 *
 * DO NOT run this against production. It creates two accounts with the well-known
 * password from the seeder, then inserts ~24 rows of lorem-ipsum skills, projects,
 * experiences, educations and certificates — all of which publish straight to the live
 * site, mixed in with real content and hard to tell apart afterwards. That is exactly
 * what happened once already.
 *
 * To install the editable marketing copy on a real environment, call the one safe seeder
 * directly — it only fills empty tables and never overwrites edited content:
 *
 *     php artisan db:seed --class=MarketingCopySeeder --force
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->guardAgainstProduction();

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            ProfileSeeder::class,
            SkillSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            ProjectSeeder::class,
            CertificateSeeder::class,
            MessageSeeder::class,
            MarketingCopySeeder::class,
        ]);
    }

    /**
     * `--force` is not enough of a signal: it only means "yes, I know this is production",
     * which is routine in a CI or Vercel shell. Demo data reaching the public site needs a
     * deliberate, separate opt-in.
     */
    private function guardAgainstProduction(): void
    {
        // filter_var, not `=== 'true'`: Laravel's env() already casts the string "true"
        // to a real boolean, so a string comparison never matches and the escape hatch
        // would be dead code.
        if (! app()->isProduction() || filter_var(env('ALLOW_DEMO_SEED'), FILTER_VALIDATE_BOOLEAN)) {
            return;
        }

        throw new RuntimeException(
            'Refusing to seed demo data: APP_ENV=production.'.PHP_EOL.PHP_EOL
            .'  DatabaseSeeder inserts Faker skills, projects, experiences, educations and'.PHP_EOL
            .'  certificates that publish straight to the live site.'.PHP_EOL.PHP_EOL
            .'  For the editable marketing copy, run the safe seeder instead:'.PHP_EOL
            .'      php artisan db:seed --class=MarketingCopySeeder --force'.PHP_EOL.PHP_EOL
            .'  If you genuinely want demo data in production, set ALLOW_DEMO_SEED=true.'.PHP_EOL
        );
    }
}
