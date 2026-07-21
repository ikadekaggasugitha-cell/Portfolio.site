<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add public contact fields to profiles. All nullable / defaulted so
     * existing rows remain valid (backward compatible).
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('email')->nullable()->after('phone');
            $table->string('location')->nullable()->after('email');
            $table->boolean('is_available')->default(true)->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['email', 'location', 'is_available']);
        });
    }
};
