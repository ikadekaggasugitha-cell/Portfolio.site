<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'photo' => null,
            'name' => fake()->name(),
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraph(),
            'phone' => fake()->phoneNumber(),
            'github' => 'https://github.com/' . fake()->userName(),
            'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
            'cv' => null,
        ];
    }
}
