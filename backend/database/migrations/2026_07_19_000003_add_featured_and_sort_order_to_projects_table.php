<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add `is_featured` + `sort_order` to projects, with a composite index to
     * back the default listing order (featured first, then manual sort order).
     * Defaults keep existing rows valid.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('technology');
            $table->integer('sort_order')->default(0)->after('is_featured');
            $table->index(['is_featured', 'sort_order'], 'projects_featured_sort_index');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_featured_sort_index');
            $table->dropColumn(['is_featured', 'sort_order']);
        });
    }
};
