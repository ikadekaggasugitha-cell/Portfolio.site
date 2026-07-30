<?php

namespace Database\Seeders;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\Profile;
use App\Models\Stat;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

/**
 * Installs the marketing copy that used to be hardcoded in
 * frontend/src/lib/marketing/content.ts as real, editable rows.
 *
 * Idempotent and non-destructive: each table is only populated when empty, and the profile's
 * About copy is only filled in when blank. Safe to run against an existing database — it will
 * never overwrite something the owner has already edited in the admin panel.
 *
 *   php artisan db:seed --class=MarketingCopySeeder
 */
class MarketingCopySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedStats();
        $this->seedCapabilities();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedAboutCopy();
    }

    private function seedStats(): void
    {
        if (Stat::query()->exists()) {
            $this->command?->info('stats: already populated, skipped');
            return;
        }

        foreach ([
            ['label' => 'Years shipping', 'value' => 5, 'suffix' => '+'],
            ['label' => 'Projects delivered', 'value' => 42, 'suffix' => '+'],
            ['label' => 'Happy clients', 'value' => 18, 'suffix' => '+'],
            ['label' => 'On-time delivery', 'value' => 99, 'suffix' => '%'],
        ] as $index => $row) {
            Stat::create($row + ['sort_order' => $index]);
        }
        $this->command?->info('stats: seeded 4');
    }

    private function seedCapabilities(): void
    {
        if (Capability::query()->exists()) {
            $this->command?->info('capabilities: already populated, skipped');
            return;
        }

        foreach ([
            [
                'title' => 'Web & Applications',
                'description' => 'Responsive web apps, dashboards and internal tools built with React and Next.js.',
                'icon' => 'globe',
            ],
            [
                'title' => 'Backend & APIs',
                'description' => 'REST APIs and backend services with Node.js and Express — the systems that power the frontend.',
                'icon' => 'server',
            ],
            [
                'title' => 'Data & Databases',
                'description' => 'Schema design and data modeling with PostgreSQL and MongoDB, built to stay maintainable as they grow.',
                'icon' => 'database',
            ],
            [
                'title' => 'Automation & DevOps',
                'description' => 'CI/CD pipelines, Docker containers and scripts that keep deployment and maintenance painless.',
                'icon' => 'settings',
            ],
        ] as $index => $row) {
            Capability::create($row + ['sort_order' => $index]);
        }
        $this->command?->info('capabilities: seeded 4');
    }

    private function seedTestimonials(): void
    {
        if (Testimonial::query()->exists()) {
            $this->command?->info('testimonials: already populated, skipped');
            return;
        }

        foreach ([
            [
                'quote' => 'Agga delivered our platform ahead of schedule and the code was spotless. Rare to find someone equally strong on backend architecture and frontend polish.',
                'author_name' => 'Rina Dewanti',
                'author_title' => 'Product Lead',
                'initials' => 'RD',
            ],
            [
                'quote' => 'The dashboard he built is fast, intuitive and still easy for our team to extend a year later. Exactly the kind of engineer you want owning a product.',
                'author_name' => 'Made Surya',
                'author_title' => 'CTO, PropTech Startup',
                'initials' => 'MS',
            ],
            [
                'quote' => 'Communicative, detail-obsessed and genuinely cares about UX. Our conversion improved measurably after his rebuild.',
                'author_name' => 'Anita Kusuma',
                'author_title' => 'Marketing Director',
                'initials' => 'AK',
            ],
        ] as $index => $row) {
            Testimonial::create($row + ['sort_order' => $index]);
        }
        $this->command?->info('testimonials: seeded 3');
    }

    private function seedFaqs(): void
    {
        if (Faq::query()->exists()) {
            $this->command?->info('faqs: already populated, skipped');
            return;
        }

        foreach ([
            [
                'question' => 'What kind of projects do you take on?',
                'answer' => "Web applications, dashboards, REST APIs, database design, and internal tooling or automation — not just websites. I'm happy to own a problem end to end or join an existing team on a specific piece of the stack.",
            ],
            [
                'question' => 'Are you available for full-time roles?',
                'answer' => "Yes — I'm open to full-time positions, contract work and freelance projects. Remote-first, and comfortable across time zones.",
            ],
            [
                'question' => 'How do we get started?',
                'answer' => "Send a message with a rough scope and timeline. I'll reply within a day to set up a quick call and share a plan.",
            ],
        ] as $index => $row) {
            Faq::create($row + ['sort_order' => $index]);
        }
        $this->command?->info('faqs: seeded 3');
    }

    /** Only fills blanks, so an About section already written in the admin is left alone. */
    private function seedAboutCopy(): void
    {
        $profile = Profile::query()->orderBy('id')->first();
        if (!$profile) {
            $this->command?->warn('profile: no row yet, About copy skipped');
            return;
        }

        $updates = [];
        if (blank($profile->about_lead)) {
            $updates['about_lead'] = 'I build software that solves real problems — across web, backend, data and automation.';
        }
        if (blank($profile->about_body)) {
            $updates['about_body'] = implode("\n\n", [
                "I'm an IT programmer who works across the stack: web applications, backend services and APIs, database design, and the automation and tooling that keeps it all running smoothly. I care about the details that make software feel reliable — clean architecture, sensible data models, and interfaces people actually enjoy using.",
                'From designing PostgreSQL schemas and REST APIs to building responsive frontends and scripting deployment pipelines, I like owning a problem end to end rather than staying in one lane. Currently building internal platforms and public-facing products in the property-tech space.',
            ]);
        }

        if ($updates === []) {
            $this->command?->info('profile: About copy already set, skipped');
            return;
        }

        $profile->update($updates);
        $this->command?->info('profile: About copy filled in');
    }
}
