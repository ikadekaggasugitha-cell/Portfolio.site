<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Gives the admin panel a home for the marketing copy that used to be hardcoded in the
 * frontend (frontend/src/lib/marketing/content.ts): the About stat tiles, the "What I do"
 * capability cards, the testimonials and the contact FAQ. Until now none of these could be
 * changed without a code deploy, which is why the admin panel did not behave like a CMS.
 *
 * All four share `sort_order` because all four are ordered lists the owner arranges by hand.
 */
return new class extends Migration
{
    public function up(): void
    {
        // About section stat tiles, e.g. value 5, suffix "+", label "Years shipping".
        Schema::create('stats', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedInteger('value');
            // "+", "%", "k" — rendered straight after the counted-up number.
            $table->string('suffix', 8)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // "What I do" cards.
        Schema::create('capabilities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            // Icon key resolved to a Lucide icon on the frontend; unknown keys fall back.
            $table->string('icon', 50)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author_name');
            $table->string('author_title')->nullable();
            // Optional monogram; the frontend derives it from author_name when blank.
            $table->string('initials', 4)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('stats');
    }
};
