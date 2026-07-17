<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectImageFactory extends Factory
{
    protected $model = ProjectImage::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'image' => 'projects/' . fake()->uuid() . '.jpg',
            'caption' => fake()->optional(0.5)->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
