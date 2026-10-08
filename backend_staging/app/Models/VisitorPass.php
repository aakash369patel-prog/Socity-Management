<?php

namespace App\Models;

use App\Enums\VisitorPassStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitorPass extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'society_id',
        'unit_id',
        'created_by',
        'guest_name',
        'guest_phone',
        'pass_code',
        'valid_from',
        'valid_until',
        'max_entries',
        'entries_used',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
            'status' => VisitorPassStatus::class,
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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function visitors(): HasMany
    {
        return $this->hasMany(Visitor::class);
    }

    public function isRedeemable(): bool
    {
        if ($this->status !== VisitorPassStatus::Active) {
            return false;
        }

        $now = now();

        return $now->between($this->valid_from, $this->valid_until)
            && $this->entries_used < $this->max_entries;
    }
}
