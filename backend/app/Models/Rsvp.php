<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    protected $fillable = ['invitation_id', 'guest_id', 'name', 'attendance', 'guest_count', 'address'];
    public function invitation() { return $this->belongsTo(Invitation::class); }
}
