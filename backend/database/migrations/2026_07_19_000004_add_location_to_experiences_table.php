<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a nullable `location` to experiences (e.g. "Bali, Indonesia" / "Remote").
     */
    public function up(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->string('location')->nullable()->after('position');
        });
    }

    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
