<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // $table->string('stripe_payment_intent_id')->unique();
            $table->string('stripe_id')->unique(); // intent_id or session_id
            $table->string('type'); // payment_intent | checkout_session
            $table->integer('amount');
            $table->string('currency');
            $table->string('status'); // pending, succeeded, failed
            $table->timestamps();
        });
        // Schema::table('payments', function (Blueprint $table) {
        //     $table->string('type')->after('stripe_id');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        // Schema::table('payments', function (Blueprint $table) {
        //     $table->renameColumn('stripe_payment_intent_id', 'stripe_id');
        // });
    }
};
