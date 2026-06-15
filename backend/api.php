<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Guest extends Model
{
    protected $fillable = ['invitation_id', 'name', 'token', 'group'];

    protected static function booted()
    {
        static::creating(function ($g) {
            if (!$g->token) $g->token = Str::random(10);
        });
    }

    public function invitation() { return $this->belongsTo(Invitation::class); }
}
