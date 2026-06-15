<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;

class PublicInvitationController extends Controller
{
    public function show(string $slug, Request $r)
    {
        $inv = Invitation::with('template')->where('slug', $slug)->where('is_published', true)->firstOrFail();

        $guestName = null;
        if ($token = $r->query('t')) {
            $g = Guest::where('invitation_id', $inv->id)->where('token', $token)->first();
            if ($g) $guestName = $g->name;
        }
        if (!$guestName && $r->query('to')) $guestName = $r->query('to');

        return ['invitation' => $inv, 'guest_name' => $guestName];
    }

    public function rsvp(string $slug, Request $r)
    {
        $inv = Invitation::where('slug', $slug)->firstOrFail();
        $data = $r->validate([
            'name' => 'required|string|max:120',
            'attendance' => 'required|in:Hadir,Tidak Hadir,Masih Ragu',
            'guest_count' => 'nullable|integer|min:1|max:10',
            'address' => 'nullable|string',
        ]);
        $rsvp = $inv->rsvps()->create($data);
        return ['ok' => true, 'rsvp' => $rsvp];
    }

    public function wish(string $slug, Request $r)
    {
        $inv = Invitation::where('slug', $slug)->firstOrFail();
        $data = $r->validate([
            'name' => 'required|string|max:120',
            'status' => 'required|in:Hadir,Tidak Hadir,Masih Ragu',
            'message' => 'required|string|max:1000',
        ]);
        $wish = $inv->wishes()->create($data);
        return ['ok' => true, 'wish' => $wish];
    }

    public function wishes(string $slug)
    {
        $inv = Invitation::where('slug', $slug)->firstOrFail();
        return $inv->wishes()->latest()->take(100)->get();
    }
}
