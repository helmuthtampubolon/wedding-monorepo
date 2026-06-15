import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ groom_name: '', bride_name: '', template_id: '', wedding_date: '' });
  const [creating, setCreating] = useState(false);

  const load = () => api.get('/admin/invitations').then((r) => setItems(r.data));

  useEffect(() => {
    load();
    api.get('/admin/templates').then((r) => setTemplates(r.data));
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/invitations', { ...form, template_id: form.template_id || null });
      setShow(false);
      setForm({ groom_name: '', bride_name: '', template_id: '', wedding_date: '' });
      load();
      toast.success('Undangan berhasil dibuat');
    } catch {
      toast.error('Gagal membuat undangan');
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Hapus undangan ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      await api.delete(`/admin/invitations/${id}`);
      load();
      toast.success('Undangan dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--primary)]">Undangan</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{items.length} undangan aktif</p>
        </div>
        <button
          onClick={() => setShow(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition shadow-card"
        >
          <span className="text-lg leading-none">+</span> Buat Undangan
        </button>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted-foreground)]">
          <p className="text-5xl mb-4">💌</p>
          <p className="font-display text-2xl text-[var(--primary)]">Belum ada undangan</p>
          <p className="text-sm mt-2">Mulai dengan membuat undangan pertama Anda.</p>
          <button
            onClick={() => setShow(true)}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm hover:opacity-90 transition"
          >
            + Buat Undangan
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((i) => (
            <div
              key={i.id}
              className="bg-white rounded-2xl border border-[var(--border)] shadow-card overflow-hidden hover:shadow-soft transition-shadow"
            >
              {/* Card header */}
              <div className="bg-[var(--muted)] px-5 pt-5 pb-4 border-b border-[var(--border)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-xl text-[var(--primary)] leading-tight">
                      {i.groom_name} & {i.bride_name}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">/{i.slug}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium mt-0.5 ${
                      i.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'
                    }`}
                  >
                    {i.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {i.wedding_date && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">
                    📅{' '}
                    {new Date(i.wedding_date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                )}
              </div>

              {/* Card body */}
              <div className="px-5 py-4">
                <p className="text-xs text-[var(--muted-foreground)] mb-3">
                  {i.template?.name || 'Tanpa template'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    to={`/admin/invitations/${i.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition"
                  >
                    ✏️ Edit
                  </Link>
                  <Link
                    to={`/admin/invitations/${i.id}/guests`}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition"
                  >
                    👥 Tamu
                  </Link>
                  <Link
                    to={`/admin/invitations/${i.id}/rsvps`}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition"
                  >
                    📋 RSVP
                  </Link>
                  <a
                    href={`/i/${i.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition"
                  >
                    🔗 Preview
                  </a>
                  <button
                    onClick={() => remove(i.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition ml-auto"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create */}
      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={create}
            className="bg-white rounded-2xl w-full max-w-md shadow-soft overflow-hidden"
          >
            <div className="bg-[var(--muted)] px-6 py-5 border-b border-[var(--border)]">
              <h2 className="font-display text-2xl text-[var(--primary)]">Undangan Baru</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Isi data dasar undangan</p>
            </div>

            <div className="p-6 space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Mempelai Pria</label>
                  <input
                    className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Nama pria"
                    value={form.groom_name}
                    onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Mempelai Wanita</label>
                  <input
                    className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Nama wanita"
                    value={form.bride_name}
                    onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Template</label>
                <select
                  className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] bg-white"
                  value={form.template_id}
                  onChange={(e) => setForm({ ...form, template_id: e.target.value })}
                >
                  <option value="">— Pilih Template (opsional) —</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Tanggal Pernikahan</label>
                <input
                  type="datetime-local"
                  className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  value={form.wedding_date}
                  onChange={(e) => setForm({ ...form, wedding_date: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)] transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
                >
                  {creating ? 'Membuat...' : 'Buat Undangan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
