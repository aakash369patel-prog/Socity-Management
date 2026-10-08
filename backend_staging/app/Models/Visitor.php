<?php

namespace App\Models;

use App\Enums\VisitorEntryType;
use App\Enums\VisitorStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Visitor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'society_id',
        'unit_id',
        'visitor_pass_id',
        'name',
        'phone',
        'vehicle_number',
        'purpose',
        'entry_type',
        'vendor_name',
        'status',
        'check_in',
        'check_out',
        'checked_in_by',
        'checked_out_by',
    ];

    protected function casts(): array
    {
        return [
            'entry_type' => VisitorEntryType::class,
            'status' => VisitorStatus::class,
            'check_in' => 'datetime',
            'check_out' => 'datetime',
        ];
    }

    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function visitorPass(): BelongsTo
    {
        return $this->belongsTo(VisitorPass::class);
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    public function checkedOutBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_out_by');
    }

    public function isInside(): bool
    {
        return $this->status === VisitorStatus::Entered;
    }
}
