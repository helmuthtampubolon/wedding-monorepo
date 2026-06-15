import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ groom_name: '', bride_name: '', template_id: '', wedding_date: '' });

  const load = () => api.get('/admin/invitations').then((r) => setItems(r.data));
  useEffect(() => { load(); api.get('/admin/templates').then((r) => setTemplates(r.data)); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/invitations', { ...form, template_id: form.template_id || null });
      setShow(false);
      setForm({ groom_name: '', bride_name: '', template_id: '', wedding_date: '' });
      load();
      toast.success('Undangan dibuat');
    } catch { toast.error('Gagal membuat'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Hapus undangan ini?')) return;
    await api.delete(`/admin/invitations/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-sage">Undangan</h1>
        <button onClick={() => setShow(true)} className="px-4 py-2 rounded-full bg-sage text-white">+ Buat Undangan</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.id} className="bg-white p-5 rounded-xl shadow">
            <p className="font-display text-xl text-sage">{i.groom_name} & {i.bride_name}</p>
            <p className="text-sm text-gray-500">/{i.slug}</p>
            <p className="text-xs text-gray-400 mt-1">{i.template?.name || 'Tanpa template'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Link to={`/admin/invitations/${i.id}`} className="px-3 py-1 rounded border">Edit</Link>
              <Link to={`/admin/invitations/${i.id}/guests`} className="px-3 py-1 rounded border">Tamu</Link>
              <Link to={`/admin/invitations/${i.id}/rsvps`} className="px-3 py-1 rounded border">RSVP</Link>
              <a href={`/i/${i.slug}`} target="_blank" className="px-3 py-1 rounded border">Preview</a>
              <button onClick={() => remove(i.id)} className="px-3 py-1 rounded border text-red-600">Hapus</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500">Belum ada undangan.</p>}
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={create} className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
            <h2 className="font-display text-xl">Undangan Baru</h2>
            <input className="w-full border rounded px-3 py-2" placeholder="Nama Mempelai Pria" value={form.groom_name} onChange={(e) => setForm({ ...form, groom_name: e.target.value })} required />
            <input className="w-full border rounded px-3 py-2" placeholder="Nama Mempelai Wanita" value={form.bride_name} onChange={(e) => setForm({ ...form, bride_name: e.target.value })} required />
            <select className="w-full border rounded px-3 py-2" value={form.template_id} onChange={(e) => setForm({ ...form, template_id: e.target.value })}>
              <option value="">— Pilih Template —</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.wedding_date} onChange={(e) => setForm({ ...form, wedding_date: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 rounded border">Batal</button>
              <button className="px-4 py-2 rounded bg-sage text-white">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
