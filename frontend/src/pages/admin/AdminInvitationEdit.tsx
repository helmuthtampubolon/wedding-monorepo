import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────
type Event = { title: string; date: string; time: string; place: string; address: string; maps: string };
type Story = { year: string; title: string; text: string };
type Bank  = { bank: string; number: string; name: string };

// ─── Subforms ─────────────────────────────────────────────
function EventsEditor({ value, onChange }: { value: Event[]; onChange: (v: Event[]) => void }) {
  const set = (i: number, k: keyof Event, v: string) => {
    const next = value.map((e, idx) => idx === i ? { ...e, [k]: v } : e);
    onChange(next);
  };
  const add = () => onChange([...value, { title: '', date: '', time: '', place: '', address: '', maps: '' }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {value.map((ev, i) => (
        <div key={i} className="border border-[var(--border)] rounded-lg p-4 space-y-2 bg-[var(--muted)]/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Acara {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
          </div>
          {(['title', 'date', 'time', 'place', 'address', 'maps'] as (keyof Event)[]).map(k => (
            <div key={k}>
              <label className="block text-xs text-[var(--muted-foreground)] capitalize mb-0.5">{k}</label>
              <input value={ev[k]} onChange={e => set(i, k, e.target.value)}
                className="w-full border border-[var(--input)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={add}
        className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition">
        + Tambah Acara
      </button>
    </div>
  );
}

function StoryEditor({ value, onChange }: { value: Story[]; onChange: (v: Story[]) => void }) {
  const set = (i: number, k: keyof Story, v: string) => onChange(value.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const add = () => onChange([...value, { year: '', title: '', text: '' }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {value.map((s, i) => (
        <div key={i} className="border border-[var(--border)] rounded-lg p-3 space-y-2 bg-[var(--muted)]/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Cerita {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-xs text-red-500">Hapus</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['year', 'title'] as (keyof Story)[]).map(k => (
              <div key={k}>
                <label className="block text-xs text-[var(--muted-foreground)] capitalize mb-0.5">{k}</label>
                <input value={s[k]} onChange={e => set(i, k, e.target.value)}
                  className="w-full border border-[var(--input)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-[var(--muted-foreground)] mb-0.5">Cerita</label>
            <textarea rows={2} value={s.text} onChange={e => set(i, 'text', e.target.value)}
              className="w-full border border-[var(--input)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
        </div>
      ))}
      <button type="button" onClick={add}
        className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition">
        + Tambah Cerita
      </button>
    </div>
  );
}

function BanksEditor({ value, onChange }: { value: Bank[]; onChange: (v: Bank[]) => void }) {
  const set = (i: number, k: keyof Bank, v: string) => onChange(value.map((b, idx) => idx === i ? { ...b, [k]: v } : b));
  const add = () => onChange([...value, { bank: '', number: '', name: '' }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {value.map((b, i) => (
        <div key={i} className="border border-[var(--border)] rounded-lg p-3 space-y-2 bg-[var(--muted)]/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Rekening {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-xs text-red-500">Hapus</button>
          </div>
          {(['bank', 'number', 'name'] as (keyof Bank)[]).map(k => (
            <div key={k}>
              <label className="block text-xs text-[var(--muted-foreground)] capitalize mb-0.5">{k === 'name' ? 'Atas Nama' : k === 'number' ? 'Nomor Rekening' : 'Nama Bank'}</label>
              <input value={b[k]} onChange={e => set(i, k, e.target.value)}
                className="w-full border border-[var(--input)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={add}
        className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition">
        + Tambah Rekening
      </button>
    </div>
  );
}

function GalleryEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...value, '']);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const set = (i: number, v: string) => onChange(value.map((url, idx) => idx === i ? v : url));

  return (
    <div className="space-y-3">
      {value.map((url, i) => (
        <div key={i} className="flex gap-3 items-center">
          {url && (
            <img
              src={url}
              alt={`Foto ${i + 1}`}
              className="w-16 h-12 object-cover rounded-md border border-[var(--border)] flex-shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <input
            value={url}
            onChange={(e) => set(i, e.target.value)}
            placeholder="URL gambar (https://...)"
            className={`flex-1 border border-[var(--input)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] bg-white`}
          />
          <button type="button" onClick={() => remove(i)}
            className="text-xs text-red-500 hover:text-red-700 px-2 flex-shrink-0">
            Hapus
          </button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition">
        + Tambah Foto
      </button>
      {value.length === 0 && (
        <p className="text-xs text-[var(--muted-foreground)] italic">
          Belum ada foto. Tambahkan URL foto untuk ditampilkan di galeri undangan.
        </p>
      )}
    </div>
  );
}

function MusicSelector({
  templateConfig,
  value,
  onChange,
}: {
  templateConfig: any;
  value: string;
  onChange: (url: string) => void;
}) {
  const tracks: { name: string; url: string }[] = templateConfig?.music_tracks || [];
  const [customMode, setCustomMode] = useState(
    () => (value ? !tracks.find((t) => t.url === value) : false)
  );
  const [testing, setTesting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomMode(true);
      onChange('');
    } else {
      setCustomMode(false);
      onChange(val);
    }
  };

  const selectValue = customMode
    ? '__custom__'
    : tracks.find((t) => t.url === value)?.url || (value ? '__custom__' : '');

  const testAudio = () => {
    if (!value) return toast.error('Masukkan URL musik terlebih dahulu');
    if (audioRef.current) {
      if (testing) {
        audioRef.current.pause();
        setTesting(false);
      } else {
        audioRef.current.src = value;
        audioRef.current
          .play()
          .then(() => setTesting(true))
          .catch(() => toast.error('Tidak dapat memutar URL ini'));
      }
    }
  };

  return (
    <div className="space-y-3">
      <audio ref={audioRef} onEnded={() => setTesting(false)} />

      {/* Dropdown pilih dari template atau kustom */}
      <div>
        <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
          Pilih Musik
        </label>
        <select
          value={selectValue}
          onChange={handleSelect}
          className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] bg-white"
        >
          <option value="">— Tidak ada (gunakan default) —</option>
          {tracks.map((t) => (
            <option key={t.url} value={t.url}>
              🎵 {t.name}
            </option>
          ))}
          <option value="__custom__">🔗 URL Kustom...</option>
        </select>
        {tracks.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Template belum punya daftar musik. Tambahkan di{' '}
            <a href="/admin/templates" className="underline">
              Manajemen Template
            </a>
            .
          </p>
        )}
      </div>

      {/* Input URL kustom */}
      {customMode && (
        <div>
          <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
            URL Audio Kustom
          </label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /music/filename.mp3"
            className="w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)]">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--muted-foreground)] truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={testAudio}
            className="text-xs px-3 py-1.5 rounded-full bg-[var(--primary)] text-white flex-shrink-0"
          >
            {testing ? '⏹ Stop' : '▶ Test'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="bg-[var(--muted)] px-5 py-3 border-b border-[var(--border)]">
        <h2 className="font-display text-lg text-[var(--primary)]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full border border-[var(--input)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] bg-white";

// ─── Main Page ─────────────────────────────────────────────
export default function AdminInvitationEdit() {
  const { id } = useParams();
  const [inv, setInv] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/admin/invitations/${id}`).then((r) => setInv(r.data));
    api.get('/admin/templates').then((r) => setTemplates(r.data));
  }, [id]);

  if (!inv) return (
    <div className="flex items-center justify-center h-48 text-[var(--muted-foreground)]">
      <div className="text-center">
        <div className="text-3xl mb-2">⏳</div>
        <p>Memuat data undangan...</p>
      </div>
    </div>
  );

  const set = (k: string, v: any) => setInv((prev: any) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        template_id:   inv.template_id || null,
        slug:          inv.slug,
        groom_name:    inv.groom_name,
        bride_name:    inv.bride_name,
        groom_full:    inv.groom_full,
        bride_full:    inv.bride_full,
        groom_parents: inv.groom_parents,
        bride_parents: inv.bride_parents,
        groom_ig:      inv.groom_ig,
        bride_ig:      inv.bride_ig,
        wedding_date:  inv.wedding_date,
        cover_quote:   inv.cover_quote,
        music_url:     inv.music_url || null,
        is_published:  inv.is_published,
        events:        inv.events    || [],
        love_story:    inv.love_story || [],
        banks:         inv.banks     || [],
        gallery:       inv.gallery   || [],
      };

      const { data } = await api.put(`/admin/invitations/${id}`, payload);
      // Sync local state with what the server actually saved (fresh model)
      setInv(data);
      toast.success('✅ Perubahan berhasil disimpan!');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan perubahan';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-[var(--primary)] hover:opacity-80 transition">← Kembali ke Dashboard</Link>
          <h1 className="font-display text-3xl text-[var(--primary)] mt-1">Edit Undangan</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">/{inv.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/i/${inv.slug}`} target="_blank"
            className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition">
            🔗 Preview
          </a>
          <button onClick={save} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settings */}
        <Section title="Pengaturan">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (URL)">
              <input className={inputCls} value={inv.slug || ''} onChange={e => set('slug', e.target.value)} />
            </Field>
            <Field label="Template">
              <select className={inputCls} value={inv.template_id || ''} onChange={e => set('template_id', e.target.value || null)}>
                <option value="">— Tanpa Template —</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tanggal Pernikahan">
            <input type="datetime-local" className={inputCls}
              value={inv.wedding_date ? inv.wedding_date.slice(0, 16) : ''}
              onChange={e => set('wedding_date', e.target.value)} />
          </Field>
          <Field label="Kutipan Cover">
            <textarea className={inputCls} rows={2} value={inv.cover_quote || ''} onChange={e => set('cover_quote', e.target.value)} />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!inv.is_published} onChange={e => set('is_published', e.target.checked)}
              className="w-4 h-4 accent-[var(--primary)]" />
            <span className="text-sm font-medium">Publish (terlihat publik)</span>
          </label>
        </Section>

        {/* Background Musik */}
        <Section title="Background Musik">
          <MusicSelector
            templateConfig={templates.find((t: any) => t.id === inv.template_id)?.config}
            value={inv.music_url || ''}
            onChange={(url) => set('music_url', url)}
          />
        </Section>

        {/* Mempelai */}
        <Section title="Data Mempelai">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Pria (singkat)">
              <input className={inputCls} value={inv.groom_name || ''} onChange={e => set('groom_name', e.target.value)} />
            </Field>
            <Field label="Nama Wanita (singkat)">
              <input className={inputCls} value={inv.bride_name || ''} onChange={e => set('bride_name', e.target.value)} />
            </Field>
            <Field label="Nama Lengkap Pria">
              <input className={inputCls} value={inv.groom_full || ''} onChange={e => set('groom_full', e.target.value)} />
            </Field>
            <Field label="Nama Lengkap Wanita">
              <input className={inputCls} value={inv.bride_full || ''} onChange={e => set('bride_full', e.target.value)} />
            </Field>
            <Field label="Orang Tua Pria">
              <input className={inputCls} value={inv.groom_parents || ''} onChange={e => set('groom_parents', e.target.value)} />
            </Field>
            <Field label="Orang Tua Wanita">
              <input className={inputCls} value={inv.bride_parents || ''} onChange={e => set('bride_parents', e.target.value)} />
            </Field>
            <Field label="Instagram Pria">
              <input className={inputCls} value={inv.groom_ig || ''} onChange={e => set('groom_ig', e.target.value)} />
            </Field>
            <Field label="Instagram Wanita">
              <input className={inputCls} value={inv.bride_ig || ''} onChange={e => set('bride_ig', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Events */}
        <Section title="Rangkaian Acara">
          <EventsEditor value={inv.events || []} onChange={v => set('events', v)} />
        </Section>

        {/* Love Story */}
        <Section title="Love Story">
          <StoryEditor value={inv.love_story || []} onChange={v => set('love_story', v)} />
        </Section>

        {/* Banks */}
        <Section title="Rekening / Wedding Gift">
          <BanksEditor value={inv.banks || []} onChange={v => set('banks', v)} />
        </Section>

        {/* Gallery */}
        <Section title="Galeri Foto">
          <p className="text-xs text-[var(--muted-foreground)] mb-3">
            Masukkan URL foto untuk ditampilkan di galeri undangan. Gunakan layanan hosting gambar seperti Google Drive (share link), Cloudinary, atau Imgur.
          </p>
          <GalleryEditor value={inv.gallery || []} onChange={v => set('gallery', v)} />
        </Section>

        {/* Save button bottom */}
        <div className="flex justify-end pb-8">
          <button onClick={save} disabled={saving}
            className="px-8 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shadow-card">
            {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
