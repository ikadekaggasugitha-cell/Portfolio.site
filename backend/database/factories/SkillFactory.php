<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    protected $model = Skill::class;

    public function definition(): array
    {
        return [
            'skill_name' => fake()->unique()->randomElement([
                'Laravel', 'Vue.js', 'React', 'Next.js', 'TypeScript',
                'Tailwind CSS', 'MySQL', 'PostgreSQL', 'Redis', 'Docker',
                'Git', 'PHP', 'JavaScript', 'Python', 'Go',
            ]),
            'level' => fake()->numberBetween(1, 5),
        ];
    }
}
