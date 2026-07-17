<?php

namespace Database\Factories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        $expiryDate = fake()->optional(0.3)->dateTimeBetween('now', '+3 years');

        return [
            'title' => fake()->randomElement([
                'AWS Certified Solutions Architect',
                'Google Cloud Professional Developer',
                'Certified Kubernetes Administrator',
                'Laravel Certification',
                'React Developer Certificate',
                'Docker Certified Associate',
                'Microsoft Azure Fundamentals',
                'CompTIA Security+',
            ]),
            'issuer' => fake()->randomElement([
                'AWS', 'Google Cloud', 'CNCF', 'Laravel LLC',
                'Meta', 'Docker Inc', 'Microsoft', 'CompTIA',
            ]),
            'issued_date' => fake()->dateTimeBetween('-5 years', '-1 month')->format('Y-m-d'),
            'file' => null,
            'description' => fake()->optional(0.7)->paragraph(),
            'expiry_date' => $expiryDate?->format('Y-m-d'),
            'credential_url' => fake()->optional(0.6)->url(),
        ];
    }
}
