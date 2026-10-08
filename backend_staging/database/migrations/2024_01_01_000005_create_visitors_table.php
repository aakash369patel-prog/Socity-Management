<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('phone', 20);
            $table->string('vehicle_number', 50)->nullable();
            $table->string('purpose', 500);
            $table->enum('status', ['entered', 'exited'])->default('entered');
            $table->timestamp('check_in');
            $table->timestamp('check_out')->nullable();
            $table->foreignId('checked_in_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('checked_out_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['society_id', 'status']);
            $table->index(['society_id', 'check_in']);
            $table->index('phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
