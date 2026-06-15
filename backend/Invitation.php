<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Invitation $invitation)
    {
        $this->own($invitation);
        return $invitation->guests()->orderBy('name')->get();
    }

    public function store(Request $r, Invitation $invitation)
    {
        $this->own($invitation);
        $data = $r->validate([
            'names' => 'required|string', // newline-separated
            'group' => 'nullable|string',
        ]);
        $created = [];
        foreach (preg_split('/\r?\n/', $data['names']) as $name) {
            $name = trim($name);
            if (!$name) continue;
            $created[] = $invitation->guests()->create(['name' => $name, 'group' => $data['group'] ?? null]);
        }
        return ['ok' => true, 'created' => $created];
    }

    public function destroy(Invitation $invitation, Guest $guest)
    {
        $this->own($invitation);
        abort_if($guest->invitation_id !== $invitation->id, 404);
        $guest->delete();
        return ['ok' => true];
    }

    public function rsvps(Invitation $invitation)
    {
        $this->own($invitation);
        return $invitation->rsvps()->latest()->get();
    }

    public function wishes(Invitation $invitation)
    {
        $this->own($invitation);
        return $invitation->wishes()->latest()->get();
    }

    protected function own(Invitation $i)
    {
        if ($i->user_id !== request()->user()->id) abort(403);
    }
}
