import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, Copy, Heart, Instagram, ChevronDown } from 'lucide-react';

type Invitation = any;

export default function InvitationPage() {
  const { slug } = useParams();
  const [search] = useSearchParams();
  const [data, setData] = useState<{ invitation: Invitation; guest_name: string | null } | null>(null);
  const [opened, setOpened] = useState(false);
  const [wishes, setWishes] = useState<any[]>([]);

  useEffect(() => {
    const q = new URLSearchParams();
    if (search.get('t')) q.set('t', search.get('t')!);
    if (search.get('to')) q.set('to', search.get('to')!);
    api.get(`/invitations/${slug}?${q.toString()}`).then((r) => setData(r.data)).catch(() => toast.error('Undangan tidak ditemukan'));
    api.get(`/invitations/${slug}/wishes`).then((r) => setWishes(r.data));
  }, [slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  const inv = data.invitation;
  const guestName = data.guest_name || 'Tamu Undangan';

  return (
    <div className="min-h-screen bg-cream">
      {!opened && (
        <div className="fixed inset-0 z-50 bg-cream flex items-center justify-center text-center px-6">
          <div>
            <p className="font-script text-3xl text-sage">The Wedding Of</p>
            <h1 className="font-display text-5xl md:text-7xl text-sage mt-2">
              {inv.groom_name} <span className="font-script text-rose">&</span> {inv.bride_name}
            </h1>
            <p className="mt-4 tracking-[0.4em] text-sm">{inv.wedding_date && new Date(inv.wedding_date).toLocaleDateString('id-ID')}</p>
            <p className="mt-8 text-xs uppercase tracking-widest text-gray-500">Kepada Yth.</p>
            <p className="font-display text-2xl">{guestName}</p>
            <button onClick={() => setOpened(true)} className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white">
              <Heart className="w-4 h-4" /> Buka Undangan
            </button>
          </div>
        </div>
      )}

      <Section label="Bride & Groom">
        <div className="grid md:grid-cols-2 gap-12">
          <Person name={inv.groom_name} full={inv.groom_full} parents={inv.groom_parents} ig={inv.groom_ig} />
          <Person name={inv.bride_name} full={inv.bride_full} parents={inv.bride_parents} ig={inv.bride_ig} />
        </div>
      </Section>

      {inv.events?.length > 0 && (
        <Section label="Save The Date" title="Wedding Events">
          <div className="grid md:grid-cols-2 gap-6">
            {inv.events.map((e: any, i: number) => (
              <div key={i} className="bg-white/70 rounded-lg p-6 text-center shadow">
                <h3 className="font-display text-xl text-sage uppercase tracking-widest">{e.title}</h3>
                <div className="flex items-center justify-center gap-2 mt-3 text-gray-600"><Calendar className="w-4 h-4" />{e.date}</div>
                <div className="flex items-center justify-center gap-2 text-gray-600"><Clock className="w-4 h-4" />{e.time}</div>
                <p className="mt-4 font-display text-lg">{e.place}</p>
                <p className="text-sm text-gray-500">{e.address}</p>
                {e.maps && <a href={e.maps} target="_blank" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-sage text-sage"><MapPin className="w-4 h-4" />Open Maps</a>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {inv.love_story?.length > 0 && (
        <Section label="Love Story">
          <div className="max-w-3xl mx-auto">
            {inv.love_story.map((s: any, i: number) => (
              <div key={i} className="md:flex md:gap-8 text-left mb-10">
                <div className="md:w-1/3">
                  <p className="font-script text-3xl text-rose">{s.title}</p>
                  <p className="font-display text-xl text-sage">{s.year}</p>
                </div>
                <p className="md:w-2/3 text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {inv.banks?.length > 0 && (
        <Section label="Wedding Gift" title="Tanda Kasih">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {inv.banks.map((b: any, i: number) => (
              <div key={i} className="bg-white/70 p-6 rounded-lg text-center">
                <p className="font-display text-xl text-sage">{b.bank}</p>
                <p className="font-mono text-2xl mt-3">{b.number}</p>
                <p className="text-sm text-gray-500">a.n {b.name}</p>
                <button onClick={() => { navigator.clipboard.writeText(b.number); toast.success('Disalin'); }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sage text-sage">
                  <Copy className="w-4 h-4" /> Salin Nomor
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section label="RSVP" title="Konfirmasi Kehadiran">
        <RsvpForm slug={slug!} defaultName={data.guest_name || ''} />
      </Section>

      <Section label="Best Wishes" title="Doa & Ucapan">
        <WishForm slug={slug!} defaultName={data.guest_name || ''} onAdded={(w) => setWishes([w, ...wishes])} />
        <div className="space-y-3 max-w-xl mx-auto text-left mt-8 max-h-96 overflow-y-auto pr-2">
          {wishes.map((w) => (
            <div key={w.id} className="bg-white/70 p-4 rounded-lg">
              <div className="flex justify-between">
                <p className="font-display text-lg text-sage">{w.name}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-sage/10">{w.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{w.message}</p>
            </div>
          ))}
        </div>
      </Section>

      <footer className="text-center py-16">
        <p className="font-script text-4xl text-rose">Thank You</p>
        <h2 className="font-display text-3xl text-sage mt-2">{inv.groom_name} & {inv.bride_name}</h2>
      </footer>
    </div>
  );
}

function Section({ label, title, children }: any) {
  return (
    <section className="py-16 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        {label && <p className="font-script text-3xl text-rose mb-2">{label}</p>}
        {title && <h2 className="font-display text-3xl md:text-4xl text-sage mb-8">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Person({ name, full, parents, ig }: any) {
  return (
    <div>
      <p className="font-script text-5xl text-rose">{name}</p>
      <h3 className="font-display text-2xl text-sage mt-2">{full}</h3>
      <p className="mt-3 text-sm text-gray-500">Putra/Putri dari</p>
      <p>{parents}</p>
      {ig && <a href={`https://instagram.com/${ig}`} target="_blank" className="inline-flex items-center gap-2 mt-3 text-sage"><Instagram className="w-4 h-4" />@{ig}</a>}
    </div>
  );
}

function RsvpForm({ slug, defaultName }: { slug: string; defaultName: string }) {
  const [form, setForm] = useState({ name: defaultName, attendance: 'Hadir', guest_count: 1, address: '' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/invitations/${slug}/rsvp`, form);
      toast.success('Terima kasih atas konfirmasinya!');
    } catch { toast.error('Gagal mengirim'); }
  };
  return (
    <form onSubmit={submit} className="max-w-xl mx-auto text-left space-y-3">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" required className="w-full border rounded px-3 py-2" />
      <select value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })} className="w-full border rounded px-3 py-2">
        <option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option>
      </select>
      <input type="number" min={1} value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: +e.target.value })} className="w-full border rounded px-3 py-2" />
      <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat" className="w-full border rounded px-3 py-2" />
      <button className="w-full py-3 rounded-full bg-sage text-white">Kirim Konfirmasi</button>
    </form>
  );
}

function WishForm({ slug, defaultName, onAdded }: { slug: string; defaultName: string; onAdded: (w: any) => void }) {
  const [form, setForm] = useState({ name: defaultName, status: 'Hadir', message: '' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.post(`/invitations/${slug}/wishes`, form);
      onAdded(r.data.wish);
      setForm({ ...form, message: '' });
      toast.success('Ucapan terkirim');
    } catch { toast.error('Gagal'); }
  };
  return (
    <form onSubmit={submit} className="max-w-xl mx-auto text-left space-y-3">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" required className="w-full border rounded px-3 py-2" />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2">
        <option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option>
      </select>
      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tulis ucapan & doa..." required className="w-full border rounded px-3 py-2" />
      <button className="w-full py-3 rounded-full bg-sage text-white">Kirim Ucapan</button>
    </form>
  );
}
