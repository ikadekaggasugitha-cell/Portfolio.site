<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The homepage About section had no API source at all — `mapAbout()` ignored the profile
 * and always returned the hardcoded copy. `description` was already taken by the hero
 * intro, so About needs its own two fields.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Short emphasised opening line of the About section.
            $table->string('about_lead')->nullable()->after('description');
            // Long-form body. Blank lines separate paragraphs.
            $table->text('about_body')->nullable()->after('about_lead');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['about_lead', 'about_body']);
        });
    }
};
