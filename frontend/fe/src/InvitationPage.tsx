import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { Instagram, MapPin, Copy, Heart, Calendar, Clock, ChevronDown } from "lucide-react";
import heroBg from "@/assets/garden-hero.jpg";
import floral from "@/assets/floral-corner.png";
import couple from "@/assets/couple.jpg";
import divider from "@/assets/divider-flower.png";
import { api } from "@/lib/api";

const WEDDING_DATE = new Date("2024-10-12T10:00:00+07:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, WEDDING_DATE - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function InvitationPage() {
  const params = useParams();
  const [search] = useSearchParams();
  const slug = params.slug || "bobby-krisma";
  const [opened, setOpened] = useState(false);
  const guestName = useMemo(
    () => (search.get("to") || "Tamu Undangan").replace(/\+/g, " "),
    [search]
  );

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
  }, [opened]);

  // Optional: ambil data invitation dari Laravel (silent fail jika BE belum ready)
  useEffect(() => {
    api.get(`/invitations/${slug}`).catch(() => {});
  }, [slug]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Toaster position="top-center" />
      {!opened && <Cover guestName={guestName} onOpen={() => setOpened(true)} />}
      <main className={opened ? "animate-float-in" : "opacity-0 pointer-events-none"}>
        <Hero />
        <Countdown />
        <BrideGroom />
        <Events />
        <Gallery />
        <LoveStory />
        <Gift />
        <Rsvp slug={slug} />
        <Wishes slug={slug} />
        <Footer />
      </main>
    </div>
  );
}

function Cover({ guestName, onOpen }: { guestName: string; onOpen: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.55), rgba(245,243,232,0.75)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img src={floral} alt="" className="absolute -top-10 -left-10 w-64 opacity-90 animate-sway" />
      <img
        src={floral}
        alt=""
        className="absolute -bottom-10 -right-10 w-64 opacity-90 animate-sway scale-x-[-1]"
      />
      <div className="relative text-center px-6 animate-float-in">
        <p className="font-script text-3xl md:text-4xl text-[var(--primary)] mb-2">The Wedding Of</p>
        <h1 className="text-5xl md:text-7xl font-display text-[var(--primary)] tracking-wide">
          Bobby <span className="font-script text-[var(--accent)]">&</span> Krisma
        </h1>
        <p className="mt-4 tracking-[0.4em] text-sm md:text-base text-[var(--muted-foreground)]">
          12 . 10 . 2024
        </p>
        <div className="mt-10 inline-block">
          <p className="text-sm uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
            Kepada Yth.
          </p>
          <p className="font-display text-2xl md:text-3xl">{guestName}</p>
        </div>
        <div className="mt-10">
          <Button onClick={onOpen} size="lg" className="rounded-full px-8 shadow-soft">
            <Heart className="mr-2 h-4 w-4" /> Buka Undangan
          </Button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.4), rgba(245,243,232,0.7)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <p className="font-script text-3xl md:text-4xl text-[var(--primary)]">The Wedding Of</p>
        <h1 className="text-6xl md:text-8xl font-display text-[var(--primary)] mt-2">
          Bobby <span className="font-script text-[var(--accent)]">&</span> Krisma
        </h1>
        <p className="mt-6 tracking-[0.4em] text-sm text-[var(--muted-foreground)]">12 . 10 . 2024</p>
        <ChevronDown className="mx-auto mt-12 animate-bounce text-[var(--primary)]" />
      </div>
    </section>
  );
}

function Section({
  children,
  label,
  title,
}: {
  children: React.ReactNode;
  label?: string;
  title?: string;
}) {
  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {label && (
          <p className="font-script text-3xl md:text-4xl text-[var(--accent)] mb-2">{label}</p>
        )}
        {title && (
          <h2 className="text-3xl md:text-5xl font-display text-[var(--primary)] mb-8">{title}</h2>
        )}
        <img src={divider} alt="" className="mx-auto h-16 mb-8 opacity-80" loading="lazy" />
        {children}
      </div>
    </section>
  );
}

function Countdown() {
  const { d, h, m, s } = useCountdown();
  const items = [
    { v: d, l: "Hari" },
    { v: h, l: "Jam" },
    { v: m, l: "Menit" },
    { v: s, l: "Detik" },
  ];
  return (
    <Section label="We Found Love" title="Counting The Days">
      <p className="italic text-[var(--muted-foreground)] max-w-2xl mx-auto mb-2">
        "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan
        Allah, tidak boleh diceraikan manusia."
      </p>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">— Matius 19 : 6</p>
      <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
        {items.map((it) => (
          <Card key={it.l} className="py-6">
            <div className="text-3xl md:text-5xl font-display text-[var(--primary)]">
              {String(it.v).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-[var(--muted-foreground)] mt-1">
              {it.l}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Person({
  name,
  full,
  parents,
  ig,
}: {
  name: string;
  full: string;
  parents: string;
  ig: string;
}) {
  return (
    <div className="text-center">
      <p className="font-script text-5xl text-[var(--accent)]">{name}</p>
      <h3 className="text-2xl md:text-3xl font-display text-[var(--primary)] mt-2">{full}</h3>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">Putra/Putri dari</p>
      <p className="text-base mt-1">{parents}</p>
      <a
        href={`https://instagram.com/${ig}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--primary)] hover:text-[var(--accent)] transition"
      >
        <Instagram className="h-4 w-4" /> @{ig}
      </a>
    </div>
  );
}

function BrideGroom() {
  return (
    <Section label="Bride & Groom" title="With Joyful Hearts">
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12">
        Tuhan membuat segala sesuatu indah pada waktunya. Indah saat Dia mempertemukan, indah saat
        Dia menumbuhkan kasih, dan indah saat Dia mempersatukan kami dalam suatu ikatan Pernikahan
        Kudus.
      </p>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Person
          name="Bobby"
          full="Bobby Indra Nainggolan, S.T."
          parents="Bapak M. Suherman Nainggolan & Ibu Tiominar Siahaan"
          ig="killaslark"
        />
        <Person
          name="Krisma"
          full="Krismawati Simbolon, S.T."
          parents="Bapak Lamsihar Simbolon & Ibu Risda R. S. Sirait"
          ig="krismasimbolon"
        />
      </div>
    </Section>
  );
}

function EventCard({
  title,
  date,
  time,
  place,
  address,
  maps,
}: {
  title: string;
  date: string;
  time: string;
  place: string;
  address: string;
  maps: string;
}) {
  return (
    <Card className="p-8 text-center">
      <h3 className="font-display text-2xl text-[var(--primary)] uppercase tracking-widest">
        {title}
      </h3>
      <img src={divider} alt="" className="mx-auto h-12 my-4 opacity-70" loading="lazy" />
      <div className="flex items-center justify-center gap-2 text-[var(--muted-foreground)]">
        <Calendar className="h-4 w-4" /> {date}
      </div>
      <div className="flex items-center justify-center gap-2 text-[var(--muted-foreground)] mt-1">
        <Clock className="h-4 w-4" /> {time}
      </div>
      <p className="mt-6 font-display text-xl">{place}</p>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{address}</p>
      <Button asChild variant="outline" className="mt-6 rounded-full">
        <a href={maps} target="_blank" rel="noreferrer">
          <MapPin className="mr-2 h-4 w-4" /> Open Maps
        </a>
      </Button>
    </Card>
  );
}

function Events() {
  return (
    <Section label="Save The Date" title="Wedding Events">
      <div className="grid md:grid-cols-3 gap-6">
        <EventCard
          title="Engagement"
          date="Sabtu, 05 . 10 . 2024"
          time="10.00 WIB — Selesai"
          place="Gereja HKBP Bolon Pangururan"
          address="Simpang 4 Jl. Gereja, Ps. Pangururan, Kec. Pangururan, Kab. Samosir"
          maps="https://maps.app.goo.gl/TLae2MYHnKHpRdBFA"
        />
        <EventCard
          title="Pemberkatan"
          date="Sabtu, 12 . 10 . 2024"
          time="10.00 — 12.00 WIB"
          place="Gereja HKBP Tampubolon"
          address="Balige, Toba Samosir, Sumatera Utara"
          maps="https://maps.app.goo.gl/YLXUfzKz5bbtUYWv7"
        />
        <EventCard
          title="Resepsi"
          date="Sabtu, 12 . 10 . 2024"
          time="13.00 WIB — Selesai"
          place="Sopo Parsaoran Nauli Tambunan"
          address="Jl. Pasar Melintang, Lumban Pea Tim., Kec. Balige"
          maps="https://maps.app.goo.gl/pqkwVqmzChscKK2E7"
        />
      </div>
    </Section>
  );
}

function Gallery() {
  return (
    <Section label="Our Gallery" title="Constantly, Continually, You">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[couple, heroBg, couple, heroBg, couple, heroBg].map((src, i) => (
          <div key={i} className="aspect-[3/4] overflow-hidden rounded-lg shadow-soft">
            <img
              src={src}
              alt="Gallery"
              className="w-full h-full object-cover hover:scale-105 transition duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

function StoryItem({ year, title, text }: { year: string; title: string; text: string }) {
  return (
    <div className="md:flex md:gap-8 text-left mb-12">
      <div className="md:w-1/3 mb-3 md:mb-0">
        <p className="font-script text-3xl text-[var(--accent)]">{title}</p>
        <p className="font-display text-xl text-[var(--primary)]">{year}</p>
      </div>
      <p className="md:w-2/3 text-[var(--muted-foreground)] leading-relaxed">{text}</p>
    </div>
  );
}

function LoveStory() {
  return (
    <Section label="Love Story" title="Ours Is My Favorite">
      <div className="max-w-3xl mx-auto">
        <StoryItem
          year="2013"
          title="First Meet"
          text="Bobby & Krisma pertama kali bertemu ketika masih di bangku SMA. Keduanya bergabung dalam ekstrakurikuler klub olimpiade matematika."
        />
        <StoryItem
          year="2016"
          title="Relationship"
          text="Tak disangka keduanya melanjutkan pendidikan di kampus yang sama dan bergabung di organisasi yang sama."
        />
        <StoryItem
          year="2017"
          title="Together"
          text="Bobby memberanikan diri mengajak Krisma menjalin hubungan, dan Krisma akhirnya menerima."
        />
        <StoryItem
          year="2023"
          title="Engagement"
          text="Enam tahun berlalu, di momen yang sederhana, Bobby memberanikan diri untuk melamar Krisma."
        />
      </div>
    </Section>
  );
}

function Account({ bank, number, name }: { bank: string; number: string; name: string }) {
  const copy = () => {
    navigator.clipboard.writeText(number);
    toast.success("Nomor rekening disalin");
  };
  return (
    <Card className="p-6 text-center">
      <p className="font-display text-xl text-[var(--primary)]">{bank}</p>
      <p className="text-2xl tracking-wider mt-3 font-mono">{number}</p>
      <p className="text-sm text-[var(--muted-foreground)] mt-1">a.n {name}</p>
      <Button onClick={copy} variant="outline" className="mt-4 rounded-full">
        <Copy className="mr-2 h-4 w-4" /> Salin Nomor
      </Button>
    </Card>
  );
}

function Gift() {
  return (
    <Section label="Wedding Gift" title="Tanda Kasih">
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Account bank="Bank Mandiri" number="1650001827451" name="Bobby Indra Nainggolan" />
        <Account bank="Bank BRI" number="043001009542535" name="Krismawati Simbolon" />
      </div>
    </Section>
  );
}

function Rsvp({ slug }: { slug: string }) {
  const [form, setForm] = useState({ name: "", attendance: "Hadir", count: "1", address: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Mohon isi nama Anda");
    setLoading(true);
    try {
      await api.post(`/invitations/${slug}/rsvp`, {
        name: form.name,
        attendance: form.attendance,
        guest_count: Number(form.count),
        address: form.address,
      });
      toast.success("Terima kasih atas konfirmasinya!");
      setForm({ name: "", attendance: "Hadir", count: "1", address: "" });
    } catch {
      toast.error("Gagal mengirim. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Section label="RSVP" title="Konfirmasi Kehadiran">
      <form onSubmit={submit} className="max-w-xl mx-auto text-left space-y-4">
        <div>
          <label className="text-sm text-[var(--muted-foreground)]">Nama *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--muted-foreground)]">Konfirmasi Kehadiran</label>
          <select
            value={form.attendance}
            onChange={(e) => setForm({ ...form, attendance: e.target.value })}
            className="mt-1 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option>Hadir</option>
            <option>Tidak Hadir</option>
            <option>Masih Ragu</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--muted-foreground)]">Jumlah Kehadiran</label>
          <select
            value={form.count}
            onChange={(e) => setForm({ ...form, count: e.target.value })}
            className="mt-1 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--muted-foreground)]">Alamat Domisili</label>
          <Textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? "Mengirim..." : "Kirim Konfirmasi"}
        </Button>
      </form>
    </Section>
  );
}

type Wish = { name: string; attendance?: string; status?: string; message: string };

function Wishes({ slug }: { slug: string }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [form, setForm] = useState({ name: "", status: "Hadir", message: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/invitations/${slug}/wishes`);
      setWishes(data.data || data || []);
    } catch {
      setWishes([
        {
          name: "Devi Maria",
          status: "Hadir",
          message: "Happy Wedding Bobby & Istri, Tuhan memberkati! 🙏",
        },
        { name: "Graceee", status: "Hadir", message: "Wishing u a lifetime love and happiness ❤️" },
      ]);
    }
  };
  useEffect(() => {
    load();
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return toast.error("Lengkapi nama dan ucapan");
    setLoading(true);
    try {
      await api.post(`/invitations/${slug}/wishes`, {
        name: form.name,
        attendance: form.status,
        message: form.message,
      });
      toast.success("Ucapan terkirim!");
      setForm({ name: "", status: "Hadir", message: "" });
      load();
    } catch {
      toast.error("Gagal mengirim.");
    } finally {
      setLoading(false);
    }
  };

  const counts = wishes.reduce<Record<string, number>>((acc, w) => {
    const k = w.attendance || w.status || "Hadir";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return (
    <Section label="Best Wishes" title="Doa & Ucapan">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-8 text-sm">
        <Card className="py-3">
          <div className="font-display text-2xl text-[var(--primary)]">{counts["Hadir"] || 0}</div>
          Hadir
        </Card>
        <Card className="py-3">
          <div className="font-display text-2xl text-[var(--primary)]">
            {counts["Tidak Hadir"] || 0}
          </div>
          Tidak Hadir
        </Card>
        <Card className="py-3">
          <div className="font-display text-2xl text-[var(--primary)]">
            {counts["Masih Ragu"] || 0}
          </div>
          Masih Ragu
        </Card>
      </div>

      <form onSubmit={submit} className="max-w-xl mx-auto text-left space-y-3 mb-10">
        <Input
          placeholder="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
        >
          <option>Hadir</option>
          <option>Tidak Hadir</option>
          <option>Masih Ragu</option>
        </select>
        <Textarea
          placeholder="Tulis ucapan & doa..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? "Mengirim..." : "Kirim Ucapan"}
        </Button>
      </form>

      <div className="space-y-4 max-w-xl mx-auto text-left max-h-96 overflow-y-auto pr-2">
        {wishes.map((w, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-[var(--primary)]">{w.name}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                {w.attendance || w.status}
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">{w.message}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer
      className="relative py-20 text-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.7), rgba(245,243,232,0.85)), url(${heroBg})`,
        backgroundSize: "cover",
      }}
    >
      <img src={floral} alt="" className="mx-auto w-40 mb-6 animate-sway" loading="lazy" />
      <p className="font-script text-4xl text-[var(--accent)]">Thank You</p>
      <h2 className="font-display text-4xl md:text-5xl text-[var(--primary)] mt-2">
        Bobby & Krisma
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mt-4 tracking-widest">12 . 10 . 2024</p>
    </footer>
  );
}
