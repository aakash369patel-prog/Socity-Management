<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
            $table->string('plate_number', 50);
            $table->enum('type', ['car', 'bike', 'other'])->default('car');
            $table->string('label', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['society_id', 'plate_number']);
            $table->index(['unit_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
