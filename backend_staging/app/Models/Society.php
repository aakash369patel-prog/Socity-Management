<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Society extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'registration_number',
    ];

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function visitors(): HasMany
    {
        return $this->hasMany(Visitor::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'current_society_id');
    }
}
