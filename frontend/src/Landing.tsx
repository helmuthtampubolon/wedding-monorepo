import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminGuests() {
  const { id } = useParams();
  const [guests, setGuests] = useState<any[]>([]);
  const [inv, setInv] = useState<any>(null);
  const [names, setNames] = useState('');
  const [group, setGroup] = useState('');

  const load = () => {
    api.get(`/admin/invitations/${id}/guests`).then((r) => setGuests(r.data));
    api.get(`/admin/invitations/${id}`).then((r) => setInv(r.data));
  };
  useEffect(load, [id]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/admin/invitations/${id}/guests`, { names, group });
    setNames(''); setGroup(''); load();
    toast.success('Tamu ditambahkan');
  };

  const remove = async (gid: number) => {
    if (!confirm('Hapus?')) return;
    await api.delete(`/admin/invitations/${id}/guests/${gid}`);
    load();
  };

  const link = (g: any) => `${window.location.origin}/i/${inv?.slug}?to=${encodeURIComponent(g.name)}&t=${g.token}`;

  return (
    <div className="max-w-4xl">
      <Link to="/admin" className="text-sm text-sage">← Kembali</Link>
      <h1 className="font-display text-3xl text-sage mb-6 mt-2">Manajemen Tamu</h1>

      <form onSubmit={add} className="bg-white p-5 rounded-xl shadow space-y-3 mb-6">
        <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Satu nama per baris" value={names} onChange={(e) => setNames(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Group (opsional, mis: Keluarga)" value={group} onChange={(e) => setGroup(e.target.value)} />
        <button className="px-4 py-2 rounded-full bg-sage text-white">Tambah Tamu</button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3 text-left">Nama</th><th className="p-3 text-left">Group</th><th className="p-3 text-left">Link</th><th></th></tr></thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="p-3">{g.name}</td>
                <td className="p-3">{g.group}</td>
                <td className="p-3"><button onClick={() => { navigator.clipboard.writeText(link(g)); toast.success('Link disalin'); }} className="text-sage underline">Salin Link</button></td>
                <td className="p-3"><button onClick={() => remove(g.id)} className="text-red-600">Hapus</button></td>
              </tr>
            ))}
            {guests.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">Belum ada tamu</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
