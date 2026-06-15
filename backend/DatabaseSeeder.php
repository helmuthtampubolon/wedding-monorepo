<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $fillable = [
        'user_id', 'template_id', 'slug', 'groom_name', 'bride_name',
        'groom_full', 'bride_full', 'groom_parents', 'bride_parents',
        'groom_ig', 'bride_ig', 'wedding_date', 'cover_quote',
        'love_story', 'gallery', 'banks', 'events', 'is_published',
    ];

    protected $casts = [
        'love_story' => 'array',
        'gallery' => 'array',
        'banks' => 'array',
        'events' => 'array',
        'is_published' => 'boolean',
        'wedding_date' => 'datetime',
    ];

    public function template() { return $this->belongsTo(Template::class); }
    public function guests() { return $this->hasMany(Guest::class); }
    public function rsvps() { return $this->hasMany(Rsvp::class); }
    public function wishes() { return $this->hasMany(Wish::class); }
}
