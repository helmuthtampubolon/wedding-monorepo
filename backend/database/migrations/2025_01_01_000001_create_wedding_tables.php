<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->boolean('is_admin')->default(false)->after('password');
        });

        Schema::create('templates', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('name');
            $t->text('description')->nullable();
            $t->string('preview_image')->nullable();
            $t->json('config')->nullable();
            $t->timestamps();
        });

        Schema::create('invitations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('template_id')->nullable()->constrained()->nullOnDelete();
            $t->string('slug')->unique();
            $t->string('groom_name'); $t->string('bride_name');
            $t->string('groom_full')->nullable(); $t->string('bride_full')->nullable();
            $t->string('groom_parents')->nullable(); $t->string('bride_parents')->nullable();
            $t->string('groom_ig')->nullable(); $t->string('bride_ig')->nullable();
            $t->dateTime('wedding_date')->nullable();
            $t->text('cover_quote')->nullable();
            $t->json('love_story')->nullable();
            $t->json('gallery')->nullable();
            $t->json('banks')->nullable();
            $t->json('events')->nullable();
            $t->boolean('is_published')->default(true);
            $t->timestamps();
        });

        Schema::create('guests', function (Blueprint $t) {
            $t->id();
            $t->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('token')->unique();
            $t->string('group')->nullable();
            $t->timestamps();
        });

        Schema::create('rsvps', function (Blueprint $t) {
            $t->id();
            $t->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $t->foreignId('guest_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('attendance');
            $t->unsignedInteger('guest_count')->default(1);
            $t->text('address')->nullable();
            $t->timestamps();
        });

        Schema::create('wishes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $t->foreignId('guest_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('status')->default('Hadir');
            $t->text('message');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishes');
        Schema::dropIfExists('rsvps');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('invitations');
        Schema::dropIfExists('templates');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('is_admin'));
    }
};
