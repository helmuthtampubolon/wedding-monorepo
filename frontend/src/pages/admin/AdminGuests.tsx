import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Search, Plus, Upload, Download, Copy, Edit2, Trash2, CheckCircle2, MessageCircle, X } from 'lucide-react';

export default function AdminGuests() {
  const { id } = useParams();
  const [guests, setGuests] = useState<any[]>([]);
  const [inv, setInv] = useState<any>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  
  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [showImport, setShowImport] = useState(false);

  // Forms
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [form, setForm] = useState({ name: '', group: '', phone: '', notes: '' });
  const [bulkNames, setBulkNames] = useState('');
  
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterGroup) params.append('group', filterGroup);
    
    api.get(`/admin/invitations/${id}/guests?${params.toString()}`).then((r) => setGuests(r.data));
    api.get(`/admin/invitations/${id}`).then((r) => setInv(r.data));
  };

  useEffect(() => { load(); }, [id, search, filterGroup]);

  // Derived state
  const groups = Array.from(new Set(guests.map(g => g.group).filter(Boolean)));
  const totalSent = guests.filter(g => g.is_sent).length;

  const addSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/admin/invitations/${id}/guests`, { guests: [form] });
    setForm({ name: '', group: '', phone: '', notes: '' });
    setShowAdd(false);
    load();
    toast.success('Tamu ditambahkan');
  };

  const addBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/admin/invitations/${id}/guests`, { names: bulkNames, group: form.group });
    setBulkNames('');
    setForm({ ...form, group: '' });
    setShowAdd(false);
    load();
    toast.success('Tamu ditambahkan');
  };

  const updateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/admin/invitations/${id}/guests/${showEdit.id}`, showEdit);
    setShowEdit(null);
    load();
    toast.success('Data tamu diperbarui');
  };

  const remove = async (gid: number) => {
    if (!confirm('Hapus tamu ini?')) return;
    await api.delete(`/admin/invitations/${id}/guests/${gid}`);
    load();
    toast.success('Tamu dihapus');
  };

  const toggleSent = async (g: any) => {
    await api.patch(`/admin/invitations/${id}/guests/${g.id}/sent`, { is_sent: !g.is_sent });
    load();
    toast.success(g.is_sent ? 'Status diubah ke belum dikirim' : 'Ditandai sudah dikirim');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].toLowerCase().split(',');
      
      const newGuests = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        const guest: any = {};
        headers.forEach((h, idx) => {
          const key = h.replace(/^"|"$/g, '').trim();
          if (['name', 'nama'].includes(key)) guest.name = values[idx];
          if (['group', 'grup'].includes(key)) guest.group = values[idx];
          if (['phone', 'hp', 'no hp'].includes(key)) guest.phone = values[idx];
          if (['notes', 'catatan'].includes(key)) guest.notes = values[idx];
        });
        if (guest.name) newGuests.push(guest);
      }

      if (newGuests.length > 0) {
        await api.post(`/admin/invitations/${id}/guests`, { guests: newGuests });
        load();
        setShowImport(false);
        toast.success(`${newGuests.length} tamu berhasil diimport`);
      }
    };
    reader.readAsText(file);
  };

  const link = (g: any) => `${window.location.origin}/i/${inv?.slug}?to=${encodeURIComponent(g.name)}&t=${g.token}`;

  const openWhatsApp = (g: any) => {
    const url = link(g);
    const msg = `Halo ${g.name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBerikut adalah link undangan Anda:\n${url}\n\nTerima kasih.`;
    const phone = g.phone.replace(/[^0-9]/g, '');
    const waUrl = phone.startsWith('0') 
      ? `https://wa.me/62${phone.substring(1)}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="font-sans pb-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link to="/admin" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-2 inline-block">← Kembali ke Dashboard</Link>
          <h1 className="font-display text-3xl text-[var(--primary)]">Manajemen Tamu</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Kelola daftar tamu, sebar undangan, dan pantau status RSVP.</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`${api.defaults.baseURL?.replace('/api', '')}/api/admin/invitations/${id}/guests/export`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition bg-white"
          >
            <Download size={16} /> Export CSV
          </a>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition bg-white"
          >
            <Upload size={16} /> Import
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            <Plus size={16} /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold mb-1">Total Tamu</p>
          <p className="text-2xl font-bold text-[var(--primary)]">{guests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold mb-1">Sudah Dikirim</p>
          <p className="text-2xl font-bold text-green-600">{totalSent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold mb-1">Belum Dikirim</p>
          <p className="text-2xl font-bold text-orange-600">{guests.length - totalSent}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--input)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Cari nama tamu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-[var(--input)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
        >
          <option value="">Semua Group</option>
          {groups.map(g => <option key={g as string} value={g as string}>{g as string}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Tamu</th>
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Kontak & Catatan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {guests.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                <td className="px-4 py-3">
                  {g.group ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {g.group}
                    </span>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">{g.phone || '-'}</div>
                  {g.notes && <div className="text-xs text-gray-500 mt-0.5">{g.notes}</div>}
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => toggleSent(g)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      g.is_sent ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {g.is_sent ? <><CheckCircle2 size={14} /> Terkirim</> : 'Belum Dikirim'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(link(g)); toast.success('Link disalin'); }} className="p-1.5 text-gray-500 hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded" title="Salin Link">
                      <Copy size={16} />
                    </button>
                    {g.phone && (
                      <button onClick={() => openWhatsApp(g)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Kirim via WA">
                        <MessageCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => setShowEdit(g)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => remove(g.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Belum ada tamu atau tidak ada yang cocok dengan pencarian.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--primary)]">Tambah Tamu</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <div className="flex border-b border-[var(--border)]">
              <button 
                className={`flex-1 py-3 text-sm font-medium ${addMode === 'single' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                onClick={() => setAddMode('single')}
              >Satu per Satu</button>
              <button 
                className={`flex-1 py-3 text-sm font-medium ${addMode === 'bulk' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                onClick={() => setAddMode('bulk')}
              >Input Massal</button>
            </div>

            <div className="p-5">
              {addMode === 'single' ? (
                <form onSubmit={addSingle} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group (Opsional)</label>
                    <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" placeholder="Mis: Keluarga, Teman Kantor" value={form.group} onChange={e => setForm({...form, group: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                    <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" placeholder="Mis: 08123456789" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                    <textarea className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg text-sm">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm">Simpan</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={addBulk} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Nama *</label>
                    <textarea 
                      className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" 
                      rows={6} 
                      placeholder="Tulis satu nama per baris..."
                      required value={bulkNames} onChange={e => setBulkNames(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group (Diterapkan ke semua)</label>
                    <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--ring)]" placeholder="Mis: Teman Sekolah" value={form.group} onChange={e => setForm({...form, group: e.target.value})} />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg text-sm">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm">Simpan {bulkNames.split('\n').filter(n => n.trim()).length} Tamu</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--primary)]">Edit Tamu</h2>
              <button onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={updateGuest} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm" required value={showEdit.name} onChange={e => setShowEdit({...showEdit, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm" value={showEdit.group || ''} onChange={e => setShowEdit({...showEdit, group: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                <input className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm" value={showEdit.phone || ''} onChange={e => setShowEdit({...showEdit, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm" rows={2} value={showEdit.notes || ''} onChange={e => setShowEdit({...showEdit, notes: e.target.value})} />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowEdit(null)} className="px-4 py-2 border rounded-lg text-sm">Batal</button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 text-center">
            <Upload className="mx-auto text-[var(--primary)] mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Import dari CSV</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload file .csv dengan header kolom baris pertama:<br/>
              <code className="bg-gray-100 px-2 py-1 rounded">nama, group, phone, notes</code>
            </p>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileRef} 
              className="hidden" 
              onChange={handleImport}
            />
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowImport(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Batal</button>
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">Pilih File CSV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
