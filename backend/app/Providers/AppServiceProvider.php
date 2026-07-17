<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\ProfileRepositoryInterface::class,
            \App\Repositories\ProfileRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\SkillRepositoryInterface::class,
            \App\Repositories\SkillRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\ExperienceRepositoryInterface::class,
            \App\Repositories\ExperienceRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\EducationRepositoryInterface::class,
            \App\Repositories\EducationRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\ProjectRepositoryInterface::class,
            \App\Repositories\ProjectRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\PageRepositoryInterface::class,
            \App\Repositories\PageRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\ProjectImageRepositoryInterface::class,
            \App\Repositories\ProjectImageRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\MediaRepositoryInterface::class,
            \App\Repositories\MediaRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\CertificateRepositoryInterface::class,
            \App\Repositories\CertificateRepository::class,
        );
        $this->app->bind(
            \App\Repositories\Contracts\MessageRepositoryInterface::class,
            \App\Repositories\MessageRepository::class,
        );
    }

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(200)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->input('email') ?: $request->ip());
        });

        RateLimiter::for('contact', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
