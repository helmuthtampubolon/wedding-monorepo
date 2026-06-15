import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

function MusicTrackEditor({
  templateId,
  initialTracks,
  onClose,
  reload,
}: {
  templateId: number;
  initialTracks: { name: string; url: string }[];
  onClose: () => void;
  reload: () => void;
}) {
  const [tracks, setTracks] = useState(initialTracks || []);
  const [testUrl, setTestUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addTrack = () => setTracks([...tracks, { name: '', url: '' }]);
  const removeTrack = (i: number) => setTracks(tracks.filter((_, idx) => idx !== i));
  const setTrack = (i: number, key: string, val: string) =>
    setTracks(tracks.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)));

  const save = async () => {
    try {
      await api.put(`/admin/templates/${templateId}`, {
        config: { music_tracks: tracks },
      });
      toast.success('Daftar musik berhasil disimpan!');
      onClose();
      reload();
    } catch {
      toast.error('Gagal menyimpan musik');
    }
  };

  const testAudio = (url: string) => {
    if (!url) return toast.error('URL kosong');
    setTestUrl(url);
    if (audioRef.current) {
      if (!audioRef.current.paused && audioRef.current.src.includes(url)) {
        audioRef.current.pause();
        return;
      }
      audioRef.current.src = url;
      audioRef.current.play().catch(() => toast.error('URL tidak dapat diputar'));
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)]">
      <h4 className="text-sm font-semibold mb-3">Edit Musik Template</h4>
      <audio ref={audioRef} />
      <div className="space-y-2 mb-4">
        {tracks.map((t, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              placeholder="Nama Lagu (mis: Canon in D)"
              value={t.name}
              onChange={(e) => setTrack(i, 'name', e.target.value)}
              className="w-1/3 border rounded px-2 py-1 text-sm"
            />
            <input
              placeholder="URL Audio (https://... atau /music/...)"
              value={t.url}
              onChange={(e) => setTrack(i, 'url', e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => testAudio(t.url)}
              title="Test putar"
              className="p-1.5 rounded bg-[var(--primary)] text-white hover:bg-opacity-90"
            >
              {audioRef.current && !audioRef.current.paused && audioRef.current.src.includes(t.url) ? '⏹' : '▶'}
            </button>
            <button onClick={() => removeTrack(i)} className="text-sm text-red-500 px-2 hover:underline">
              Hapus
            </button>
          </div>
        ))}
        {tracks.length === 0 && <p className="text-xs text-gray-500">Belum ada lagu.</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={addTrack} className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          + Tambah Lagu
        </button>
        <button onClick={save} className="text-sm px-3 py-1.5 rounded bg-sage text-white hover:bg-opacity-90">
          Simpan Musik
        </button>
        <button onClick={onClose} className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Batal
        </button>
      </div>
    </div>
  );
}

export default function AdminTemplates() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ slug: '', name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => api.get('/admin/templates').then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/templates', form);
      setForm({ slug: '', name: '', description: '' });
      load();
      toast.success('Template ditambahkan');
    } catch {
      toast.error('Gagal');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Hapus template?')) return;
    await api.delete(`/admin/templates/${id}`);
    load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-sage mb-6">Manajemen Template</h1>

      <form onSubmit={create} className="bg-white p-5 rounded-xl shadow space-y-3 mb-6">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Slug (mis: garden-vintage)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nama Template"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="px-4 py-2 rounded-full bg-sage text-white">Tambah Template</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t) => {
          const trackCount = t.config?.music_tracks?.length || 0;
          return (
            <div key={t.id} className="bg-white p-5 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display text-xl text-sage">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.slug}</p>
                </div>
                <button onClick={() => remove(t.id)} className="text-xs text-red-600 hover:underline">
                  Hapus
                </button>
              </div>
              <p className="text-sm mt-2">{t.description}</p>
              
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">🎵 {trackCount} lagu</span>
                <button
                  onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit Musik
                </button>
              </div>

              {editingId === t.id && (
                <MusicTrackEditor
                  templateId={t.id}
                  initialTracks={t.config?.music_tracks || []}
                  onClose={() => setEditingId(null)}
                  reload={load}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
