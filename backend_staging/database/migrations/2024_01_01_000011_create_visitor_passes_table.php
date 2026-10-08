<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_passes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('guest_name');
            $table->string('guest_phone', 20);
            $table->string('pass_code', 16)->unique();
            $table->dateTime('valid_from');
            $table->dateTime('valid_until');
            $table->unsignedTinyInteger('max_entries')->default(1);
            $table->unsignedTinyInteger('entries_used')->default(0);
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['society_id', 'status']);
            $table->index(['pass_code', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_passes');
    }
};
