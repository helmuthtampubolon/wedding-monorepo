<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $r, Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        $q = $invitation->guests();

        if ($r->search) {
            $q->where('name', 'like', '%' . $r->search . '%');
        }
        if ($r->group) {
            $q->where('group', $r->group);
        }

        return $q->orderBy('name')->get();
    }

    public function store(Request $r, Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        
        // Handle single or bulk creation via JSON array if provided
        if ($r->has('guests') && is_array($r->guests)) {
            $created = [];
            foreach ($r->guests as $gData) {
                if (empty($gData['name'])) continue;
                $created[] = $invitation->guests()->create([
                    'name' => $gData['name'],
                    'group' => $gData['group'] ?? null,
                    'phone' => $gData['phone'] ?? null,
                    'notes' => $gData['notes'] ?? null,
                ]);
            }
            return ['ok' => true, 'created' => $created];
        }

        // Fallback to legacy bulk textarea
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

    public function update(Request $r, Invitation $invitation, Guest $guest)
    {
        $this->authorizeOwn($invitation);
        abort_if($guest->invitation_id !== $invitation->id, 404);

        $data = $r->validate([
            'name' => 'required|string',
            'group' => 'nullable|string',
            'phone' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $guest->update($data);
        return $guest;
    }

    public function markSent(Request $r, Invitation $invitation, Guest $guest)
    {
        $this->authorizeOwn($invitation);
        abort_if($guest->invitation_id !== $invitation->id, 404);

        $data = $r->validate(['is_sent' => 'required|boolean']);
        $guest->update(['is_sent' => $data['is_sent']]);
        
        return $guest;
    }

    public function exportCsv(Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        $guests = $invitation->guests()->orderBy('name')->get();

        $csv = "Nama,Group,No HP,Catatan,Status Kirim,Link\n";
        foreach ($guests as $g) {
            $link = url("/i/{$invitation->slug}?to=" . urlencode($g->name) . "&t={$g->token}");
            $csv .= sprintf('"%s","%s","%s","%s","%s","%s"'."\n",
                str_replace('"', '""', $g->name),
                str_replace('"', '""', $g->group ?? ''),
                str_replace('"', '""', $g->phone ?? ''),
                str_replace('"', '""', $g->notes ?? ''),
                $g->is_sent ? 'Sudah' : 'Belum',
                $link
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="Tamu-' . $invitation->slug . '.csv"');
    }

    public function destroy(Invitation $invitation, Guest $guest)
    {
        $this->authorizeOwn($invitation);
        abort_if($guest->invitation_id !== $invitation->id, 404);
        $guest->delete();
        return ['ok' => true];
    }

    public function rsvps(Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        return $invitation->rsvps()->latest()->get();
    }

    public function wishes(Invitation $invitation)
    {
        $this->authorizeOwn($invitation);
        return $invitation->wishes()->latest()->get();
    }

    protected function authorizeOwn(Invitation $i)
    {
        if ($i->user_id !== request()->user()->id) abort(403);
    }
}
