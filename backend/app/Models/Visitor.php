<?php

namespace App\Models;

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
        'name',
        'phone',
        'vehicle_number',
        'purpose',
        'status',
        'check_in',
        'check_out',
        'checked_in_by',
        'checked_out_by',
    ];

    protected function casts(): array
    {
        return [
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
