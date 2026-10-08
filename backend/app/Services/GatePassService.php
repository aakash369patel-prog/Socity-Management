<?php

namespace App\Services;

use App\Enums\VisitorEntryType;
use App\Enums\VisitorPassStatus;
use App\Enums\VisitorStatus;
use App\Models\User;
use App\Models\Visitor;
use App\Models\VisitorPass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class GatePassService
{
    public function generatePassCode(): string
    {
        do {
            $code = Str::upper(Str::random(8));
        } while (VisitorPass::query()->where('pass_code', $code)->exists());

        return $code;
    }

    public function redeemPass(string $passCode, User $guard): Visitor
    {
        $pass = VisitorPass::query()->where('pass_code', Str::upper(trim($passCode)))->first();

        if (! $pass) {
            throw new InvalidArgumentException('Invalid pass code.');
        }

        $societyId = $guard->current_society_id;
        if (! $societyId || (int) $pass->society_id !== (int) $societyId) {
            throw new InvalidArgumentException('Pass is not valid for this society.');
        }

        if (! $pass->isRedeemable()) {
            throw new InvalidArgumentException('Pass is expired, revoked, or fully used.');
        }

        return DB::transaction(function () use ($pass, $guard) {
            $pass->increment('entries_used');
            $pass->refresh();

            if ($pass->entries_used >= $pass->max_entries) {
                $pass->update(['status' => VisitorPassStatus::Expired]);
            }

            $visitor = Visitor::query()->create([
                'society_id' => $pass->society_id,
                'unit_id' => $pass->unit_id,
                'visitor_pass_id' => $pass->id,
                'name' => $pass->guest_name,
                'phone' => $pass->guest_phone,
                'purpose' => 'Pre-approved guest visit',
                'entry_type' => VisitorEntryType::Guest,
                'vendor_name' => null,
                'status' => VisitorStatus::Entered,
                'check_in' => now(),
                'checked_in_by' => $guard->id,
            ]);

            return $visitor->load(['unit', 'checkedInBy', 'visitorPass']);
        });
    }
}
