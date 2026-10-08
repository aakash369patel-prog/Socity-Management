<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
class ResetDemoUsersCommand extends Command
{
    protected $signature = 'demo:reset-passwords';

    protected $description = 'Reset all @demo.local user passwords to "password"';

    public function handle(): int
    {
        $users = User::query()->where('email', 'like', '%@demo.local')->get();

        foreach ($users as $user) {
            $user->forceFill(['password' => 'password'])->save();
        }

        $this->info("Updated {$users->count()} demo user(s). Password: password");

        return self::SUCCESS;
    }
}
