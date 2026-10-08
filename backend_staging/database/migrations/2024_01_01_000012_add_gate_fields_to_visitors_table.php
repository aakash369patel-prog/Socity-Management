<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->enum('entry_type', ['guest', 'delivery'])->default('guest')->after('purpose');
            $table->string('vendor_name', 150)->nullable()->after('entry_type');
            $table->foreignId('visitor_pass_id')->nullable()->after('unit_id')->constrained('visitor_passes')->nullOnDelete();
            $table->index(['society_id', 'entry_type']);
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->dropForeign(['visitor_pass_id']);
            $table->dropColumn(['entry_type', 'vendor_name', 'visitor_pass_id']);
        });
    }
};
