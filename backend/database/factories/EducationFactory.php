<?php

namespace Database\Factories;

use App\Models\Education;
use Illuminate\Database\Eloquent\Factories\Factory;

class EducationFactory extends Factory
{
    protected $model = Education::class;

    public function definition(): array
    {
        return [
            'institution' => fake()->company(),
            'degree' => fake()->randomElement(['Bachelor', 'Master', 'PhD', 'Associate']),
            'field_of_study' => fake()->randomElement([
                'Computer Science', 'Information Technology', 'Software Engineering',
                'Data Science', 'Business Administration',
            ]),
            'start_date' => fake()->dateTimeBetween('-10 years', '-2 years')->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'description' => fake()->paragraph(),
        ];
    }
}
