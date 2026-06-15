<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wish extends Model
{
    protected $fillable = ['invitation_id', 'guest_id', 'name', 'status', 'message'];
    public function invitation() { return $this->belongsTo(Invitation::class); }
}
