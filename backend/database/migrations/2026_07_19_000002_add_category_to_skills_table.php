<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a nullable string `category` to skills (indexed for grouping).
     * A string — not a DB enum — so new categories never require a migration;
     * the allowed set is validated in the application layer.
     */
    public function up(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->string('category', 50)->nullable()->after('skill_name');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropColumn('category');
        });
    }
};
