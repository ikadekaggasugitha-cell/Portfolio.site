<?php

namespace Database\Factories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceFactory extends Factory
{
    protected $model = Experience::class;

    public function definition(): array
    {
        $endDate = fake()->optional(0.7)->dateTimeBetween('-5 years', '-1 month');

        return [
            'company' => fake()->company(),
            'position' => fake()->jobTitle(),
            'start_date' => fake()->dateTimeBetween('-10 years', '-6 months')->format('Y-m-d'),
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            'description' => fake()->paragraphs(2, true),
        ];
    }

    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => null,
        ]);
    }
}
