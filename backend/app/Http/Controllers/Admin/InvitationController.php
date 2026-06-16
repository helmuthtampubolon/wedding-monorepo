<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function index(Request $r)
    {
        return Invitation::with('template')->where('user_id', $r->user()->id)->latest()->get();
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'template_id'   => 'nullable|exists:templates,id',
            'slug'          => 'nullable|string|unique:invitations,slug',
            'groom_name'    => 'required|string',
            'bride_name'    => 'required|string',
            'groom_full'    => 'nullable|string',
            'bride_full'    => 'nullable|string',
            'groom_parents' => 'nullable|string',
            'bride_parents' => 'nullable|string',
            'groom_ig'      => 'nullable|string',
            'bride_ig'      => 'nullable|string',
            'wedding_date'  => 'nullable|date',
            'cover_quote'   => 'nullable|string',
            'music_url'     => 'nullable|string|max:500',
            'love_story'    => 'nullable|array',
            'gallery'       => 'nullable|array',
            'banks'         => 'nullable|array',
            'events'        => 'nullable|array',
            'is_published'  => 'nullable|boolean',
        ]);
        $data['user_id'] = $r->user()->id;
        $data['slug'] = $data['slug'] ?? Str::slug($data['groom_name'].'-'.$data['bride_name'].'-'.Str::random(4));
        return Invitation::create($data);
    }

    public function show(Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        // Return only the invitation itself (no nested relations) to keep the
        // PUT payload clean — template & guests cause validation issues.
        return $invitation->load('template');
    }

    public function update(Request $r, Invitation $invitation)
    {
        $this->authorizeOwn($invitation);

        // Only pick known safe fields — ignore any extra fields the FE sends
        // (e.g. nested `template` object, `guests`, timestamps, etc.)
        $data = $r->validate([
            'template_id'   => 'nullable|exists:templates,id',
            'slug'          => 'nullable|string|unique:invitations,slug,'.$invitation->id,
            'groom_name'    => 'sometimes|required|string',
            'bride_name'    => 'sometimes|required|string',
            'groom_full'    => 'nullable|string',
            'bride_full'    => 'nullable|string',
            'groom_parents' => 'nullable|string',
            'bride_parents' => 'nullable|string',
            'groom_ig'      => 'nullable|string',
            'bride_ig'      => 'nullable|string',
            'wedding_date'  => 'nullable|date',
            'cover_quote'   => 'nullable|string',
            'music_url'     => 'nullable|string|max:500',
            'love_story'    => 'nullable|array',
            'gallery'       => 'nullable|array',
            'banks'         => 'nullable|array',
            'events'        => 'nullable|array',
            'is_published'  => 'nullable|boolean',
        ]);

        $invitation->update($data);

        // Return fresh model so the FE sees the actual saved state
        return $invitation->fresh()->load('template');
    }

    public function destroy(Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        $invitation->delete();
        return ['ok' => true];
    }

    protected function authorizeOwn(Invitation $i)
    {
        if ($i->user_id !== request()->user()->id) abort(403);
    }
}
