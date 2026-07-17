<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'HRIS System', 'E-Commerce Platform', 'Portfolio Website',
            'Task Management App', 'Real-time Chat Application',
            'Inventory Management', 'Learning Management System',
            'Point of Sale System', 'Blog Platform', 'Social Media Dashboard',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(3),
            'description' => fake()->paragraphs(3, true),
            'github_url' => 'https://github.com/user/' . Str::slug($title),
            'demo_url' => fake()->optional(0.6)->url(),
            'technology' => fake()->randomElement([
                'Laravel,Vue.js,MySQL',
                'React,Next.js,TypeScript,PostgreSQL',
                'PHP,Laravel,Livewire,Tailwind',
                'Python,Django,React,Redis',
                'Go,Vue.js,MongoDB,Docker',
            ]),
        ];
    }
}
