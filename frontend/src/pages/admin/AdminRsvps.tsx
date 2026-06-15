import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';

export default function AdminRsvps() {
  const { id } = useParams();
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/admin/invitations/${id}/rsvps`).then((r) => setRsvps(r.data));
    api.get(`/admin/invitations/${id}/wishes`).then((r) => setWishes(r.data));
  }, [id]);

  return (
    <div className="max-w-5xl">
      <Link to="/admin" className="text-sm text-sage">← Kembali</Link>
      <h1 className="font-display text-3xl text-sage mb-6 mt-2">RSVP & Ucapan</h1>

      <h2 className="font-display text-xl mb-3">RSVP ({rsvps.length})</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3 text-left">Nama</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Jumlah</th><th className="p-3 text-left">Alamat</th></tr></thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.attendance}</td>
                <td className="p-3">{r.guest_count}</td>
                <td className="p-3">{r.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl mb-3">Ucapan ({wishes.length})</h2>
      <div className="space-y-3">
        {wishes.map((w) => (
          <div key={w.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between"><strong>{w.name}</strong><span className="text-xs px-2 py-1 rounded-full bg-sage/10">{w.status}</span></div>
            <p className="text-sm text-gray-600 mt-2">{w.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
