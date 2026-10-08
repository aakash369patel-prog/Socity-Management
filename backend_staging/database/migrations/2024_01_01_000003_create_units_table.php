<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->constrained()->cascadeOnDelete();
            $table->string('block_name', 100);
            $table->string('flat_number', 50);
            $table->unsignedTinyInteger('floor')->nullable();
            $table->enum('status', ['occupied', 'vacant'])->default('vacant');
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['society_id', 'block_name', 'flat_number']);
            $table->index(['society_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
