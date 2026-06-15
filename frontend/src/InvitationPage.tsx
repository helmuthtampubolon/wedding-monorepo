import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { Instagram, MapPin, Copy, Heart, ChevronDown } from "lucide-react";
import heroBg from "@/assets/garden-hero.jpg";
import floral from "@/assets/floral-corner.png";
import couple from "@/assets/couple.jpg";
import divider from "@/assets/divider-flower.png";
import { api } from "@/lib/api";

// ─── Fallback date ───────────────────────────────────────────
const FALLBACK_DATE = new Date("2025-12-31T10:00:00+07:00").getTime();

// ─── Countdown hook ──────────────────────────────────────────
function useCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, targetMs - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

// ─── Scroll reveal hook ──────────────────────────────────────
function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Music player hook ───────────────────────────────────────
function useMusicPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Update audio src dynamically without resetting play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    const wasPlaying = !audio.paused;
    audio.src = src;
    audio.load();
    if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }, [src]);

  const start = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }, [playing]);

  return { audioRef, playing, start, toggle };
}

// ─── Types ───────────────────────────────────────────────────
type InvData = {
  invitation: {
    groom_name: string;
    bride_name: string;
    groom_full: string;
    bride_full: string;
    groom_parents: string;
    bride_parents: string;
    groom_ig: string;
    bride_ig: string;
    wedding_date: string;
    cover_quote: string;
    music_url: string | null;
    love_story: Array<{ year: string; title: string; text: string }>;
    banks: Array<{ bank: string; number: string; name: string }>;
    events: Array<{
      title: string;
      date: string;
      time: string;
      place: string;
      address: string;
      maps: string;
    }>;
    gallery: string[];
  };
  guest_name: string | null;
};

type Inv = InvData["invitation"];

// ─── SVG Components ──────────────────────────────────────────

function BirdSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" fill="currentColor" className={className}>
      <path d="M0 10 Q8 2 20 7 Q32 2 40 10 Q32 5 20 10 Q8 5 0 10Z" />
    </svg>
  );
}

function ButterflySVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="10" rx="11" ry="8" fill="#7c9e7a" opacity="0.85" transform="rotate(-20 12 10)" />
      <ellipse cx="36" cy="10" rx="11" ry="8" fill="#7c9e7a" opacity="0.85" transform="rotate(20 36 10)" />
      <ellipse cx="14" cy="24" rx="9" ry="6" fill="#5a7d58" opacity="0.75" transform="rotate(15 14 24)" />
      <ellipse cx="34" cy="24" rx="9" ry="6" fill="#5a7d58" opacity="0.75" transform="rotate(-15 34 24)" />
      <ellipse cx="24" cy="17" rx="2" ry="9" fill="#2d4a2b" />
      <line x1="24" y1="8" x2="16" y2="2" stroke="#2d4a2b" strokeWidth="1" />
      <line x1="24" y1="8" x2="32" y2="2" stroke="#2d4a2b" strokeWidth="1" />
      <circle cx="16" cy="2" r="1.5" fill="#2d4a2b" />
      <circle cx="32" cy="2" r="1.5" fill="#2d4a2b" />
    </svg>
  );
}

function VinylDiscIcon({ spinning }: { spinning: boolean }) {
  return (
    <div className={`relative w-8 h-8 ${spinning ? "animate-spin-slow" : "vinyl-paused"}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="15" fill="#1a1a1a" />
        <circle cx="16" cy="16" r="12" fill="none" stroke="#2a2a2a" strokeWidth="1" />
        <circle cx="16" cy="16" r="9" fill="none" stroke="#2a2a2a" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="6" fill="none" stroke="#2a2a2a" strokeWidth="0.6" />
        <circle cx="16" cy="16" r="5" fill="#c9a84c" />
        <circle cx="16" cy="16" r="1.8" fill="#1a1a1a" />
      </svg>
    </div>
  );
}

// ─── Animated Left Panel (Desktop only) ──────────────────────
function AnimatedLeftPanel({
  inv,
  playing,
  onToggleMusic,
}: {
  inv?: Inv | null;
  playing: boolean;
  onToggleMusic: () => void;
}) {
  const groomName = inv?.groom_name || "Deardo";
  const brideName = inv?.bride_name || "Dea";
  const dateStr = inv?.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, " . ")
    : "12 . 10 . 2024";

  return (
    <div className="hidden md:block fixed left-0 top-0 w-[65%] h-screen overflow-hidden z-10">
      {/* Background with Ken Burns */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark overlay gradient for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,30,15,0.65) 0%, rgba(20,30,15,0.20) 55%, transparent 100%)",
        }}
      />

      {/* Floral corner top-right */}
      <img
        src={floral}
        alt=""
        className="absolute top-0 right-0 w-48 opacity-75 animate-sway origin-top-right"
      />

      {/* Floral corner bottom-left (flipped) */}
      <img
        src={floral}
        alt=""
        className="absolute bottom-0 left-0 w-40 opacity-50 animate-sway scale-x-[-1] scale-y-[-1]"
      />

      {/* Bird 1 — flies left→right */}
      <div className="absolute top-[22%] left-0 animate-fly-bird pointer-events-none">
        <BirdSVG className="w-9 h-6 text-emerald-200 opacity-80" />
      </div>

      {/* Bird 2 — flies slower, different vertical position */}
      <div className="absolute top-[42%] left-0 animate-fly-bird-delay pointer-events-none">
        <BirdSVG className="w-6 h-4 text-emerald-300 opacity-65" />
      </div>

      {/* Butterfly 1 */}
      <div className="absolute top-[30%] left-[38%] animate-float-butterfly pointer-events-none">
        <ButterflySVG className="w-10 h-8 opacity-70" />
      </div>

      {/* Butterfly 2 (mirrored) */}
      <div className="absolute top-[58%] left-[55%] animate-float-butterfly-2 pointer-events-none">
        <ButterflySVG className="w-7 h-6 opacity-55 scale-x-[-1]" />
      </div>

      {/* Leaf fall 1 */}
      <div
        className="absolute top-0 left-[20%] animate-leaf-fall pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        <svg viewBox="0 0 12 20" className="w-3 h-5 text-emerald-400 opacity-60 fill-current">
          <path d="M6 0 C10 5 12 10 6 20 C0 10 2 5 6 0Z" />
        </svg>
      </div>

      {/* Leaf fall 2 */}
      <div
        className="absolute top-0 left-[70%] animate-leaf-fall-2 pointer-events-none"
        style={{ animationDelay: "7s" }}
      >
        <svg viewBox="0 0 12 20" className="w-2.5 h-4 text-emerald-500 opacity-50 fill-current">
          <path d="M6 0 C10 5 12 10 6 20 C0 10 2 5 6 0Z" />
        </svg>
      </div>

      {/* Couple names overlay — bottom left */}
      <div className="absolute bottom-20 left-10 text-white">
        <p
          className="font-script opacity-90 mb-1 drop-shadow"
          style={{ fontSize: "1.6rem" }}
        >
          The Wedding Of
        </p>
        <h1
          className="font-display font-bold leading-tight drop-shadow-lg"
          style={{ fontSize: "2.8rem" }}
        >
          {groomName} & {brideName}
        </h1>
        <p className="mt-2 tracking-[0.35em] text-sm opacity-80 drop-shadow">
          {dateStr}
        </p>
      </div>

      {/* Vinyl disc music button — bottom left corner */}
      <button
        onClick={onToggleMusic}
        className="absolute bottom-6 left-6 w-12 h-12 rounded-full
          bg-white/20 backdrop-blur-sm border border-white/30
          flex items-center justify-center
          hover:bg-white/35 transition z-20"
        title={playing ? "Pause musik" : "Putar musik"}
        aria-label={playing ? "Pause musik" : "Putar musik"}
      >
        <VinylDiscIcon spinning={playing} />
      </button>
    </div>
  );
}

// ─── Desktop Cover Card (Right panel before open) ─────────────
function DesktopCoverCard({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <div className="h-screen flex items-center justify-center p-8 bg-[var(--background)]">
      <div
        className="event-card-border rounded-2xl p-10 text-center w-full max-w-[280px] relative
          bg-[var(--card)] animate-float-in"
      >
        {/* Floral corners */}
        <img
          src={floral}
          alt=""
          className="absolute -top-8 -right-8 w-20 opacity-70 animate-sway"
        />
        <img
          src={floral}
          alt=""
          className="absolute -bottom-8 -left-8 w-20 opacity-60 animate-sway scale-x-[-1] scale-y-[-1]"
        />

        <p className="font-script text-4xl text-[var(--accent)] mb-1">Welcome</p>

        {/* Ornament divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[var(--accent)]">◇</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-2">
          Kepada Yth.
        </p>
        <p className="font-display text-2xl text-[var(--primary)] mb-8 leading-tight">
          {guestName}
        </p>

        <button
          onClick={onOpen}
          className="w-full py-3 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]
            text-sm font-medium flex items-center justify-center gap-2
            hover:opacity-90 transition shadow-soft animate-pulse hover:animate-none"
        >
          <Heart className="h-4 w-4 fill-current" /> Buka Undangan
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Cover (full-screen) ──────────────────────────────
function MobileCover({
  inv,
  guestName,
  onOpen,
  playing,
  onToggleMusic,
}: {
  inv?: Inv | null;
  guestName: string;
  onOpen: () => void;
  playing: boolean;
  onToggleMusic: () => void;
}) {
  const groomName = inv?.groom_name || "Deardo";
  const brideName = inv?.bride_name || "Dea";
  const dateStr = inv?.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, " . ")
    : "12 . 10 . 2024";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ken Burns via overlay div */}
      <div className="absolute inset-0 bg-cover bg-center animate-ken-burns opacity-0 pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Top floral */}
      <img
        src={floral}
        alt=""
        className="absolute top-0 right-0 w-36 opacity-80 animate-sway"
      />

      {/* Bird */}
      <div className="absolute top-[18%] left-0 animate-fly-bird pointer-events-none w-full">
        <BirdSVG className="w-8 h-5 text-emerald-200 opacity-75" />
      </div>

      {/* Butterfly */}
      <div className="absolute top-[35%] left-[40%] animate-float-butterfly pointer-events-none">
        <ButterflySVG className="w-9 h-7 opacity-65" />
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(30,40,20,0.90) 0%, rgba(30,40,20,0.55) 45%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="relative mt-auto px-8 pb-12 text-white text-center animate-float-in">
        <p className="font-script text-3xl opacity-90 mb-1 drop-shadow">The Wedding Of</p>
        <h1 className="font-display text-5xl font-bold leading-tight drop-shadow-lg">
          {groomName} & {brideName}
        </h1>
        <p className="mt-2 tracking-[0.35em] text-sm opacity-80">{dateStr}</p>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/30" />
          <span className="text-white/60 text-sm">◇</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">Kepada Yth.</p>
        <p className="font-display text-2xl mb-8">{guestName}</p>

        <button
          onClick={onOpen}
          className="mx-auto flex items-center gap-2 px-10 py-3.5 rounded-full
            bg-[var(--primary)] text-[var(--primary-foreground)]
            text-sm font-medium hover:opacity-90 transition shadow-lg
            animate-pulse hover:animate-none"
        >
          <Heart className="h-4 w-4 fill-current" /> Buka Undangan
        </button>
      </div>

      {/* Vinyl disc (mobile cover) */}
      <button
        onClick={onToggleMusic}
        className="absolute bottom-6 left-6 w-11 h-11 rounded-full
          bg-white/20 backdrop-blur-sm border border-white/30
          flex items-center justify-center hover:bg-white/30 transition"
        title={playing ? "Pause musik" : "Putar musik"}
      >
        <VinylDiscIcon spinning={playing} />
      </button>
    </div>
  );
}

// ─── Mobile Hero (after open, top of content) ────────────────
function MobileHero({ inv }: { inv?: Inv | null }) {
  const groomName = inv?.groom_name || "Deardo";
  const brideName = inv?.bride_name || "Dea";
  const dateStr = inv?.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "12 Oktober 2024";
  const quote =
    inv?.cover_quote ||
    "\u201cApa yang telah dipersatukan Allah, tidak boleh diceraikan manusia\u201d";

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center text-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.35), rgba(245,243,232,0.65)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "local",
      }}
    >
      <div>
        <p className="font-script text-3xl text-[var(--primary)]">The Wedding Of</p>
        <h2 className="text-5xl font-display text-[var(--primary)] font-bold mt-2">
          {groomName} & {brideName}
        </h2>
        <p className="mt-4 tracking-[0.4em] text-sm text-[var(--muted-foreground)]">{dateStr}</p>
        <p className="mt-4 italic text-[var(--muted-foreground)] max-w-xs mx-auto text-sm">
          {quote}
        </p>
        <ChevronDown className="mx-auto mt-10 animate-bounce text-[var(--primary)]" />
      </div>
    </section>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function SectionHeader({
  label,
  title,
}: {
  label?: string;
  title?: string;
}) {
  return (
    <div className="text-center mb-10">
      {label && (
        <p className="font-script text-3xl text-[var(--accent)] mb-1">{label}</p>
      )}
      {title && (
        <h2 className="font-display text-2xl md:text-3xl text-[var(--primary)]">{title}</h2>
      )}
      <img src={divider} alt="" className="mx-auto h-12 mt-4 opacity-70" loading="lazy" />
    </div>
  );
}

// ─── Person (Bride / Groom) ───────────────────────────────────
function Person({
  name,
  full,
  parents,
  ig,
  photo,
}: {
  name: string;
  full: string;
  parents: string;
  ig: string;
  photo?: string;
}) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="text-center reveal">
      {/* Arched photo frame */}
      <div
        className="mx-auto mb-5"
        style={{ width: 130, height: 170 }}
      >
        <div
          className="arch-frame w-full h-full bg-[var(--muted)] border-2"
          style={{ borderColor: "rgba(201,168,76,0.35)" }}
        >
          <img
            src={photo || couple}
            alt={name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>

      <p className="font-script text-5xl text-[var(--accent)] leading-none">{name}</p>
      <h3 className="text-lg font-display text-[var(--primary)] mt-2 leading-snug">{full}</h3>
      <p className="mt-3 text-xs text-[var(--muted-foreground)]">Putra/Putri dari</p>
      <p className="text-sm mt-0.5 leading-snug">{parents}</p>
      <a
        href={`https://instagram.com/${ig}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 mt-4 text-xs tracking-wider
          text-[var(--primary)] hover:text-[var(--accent)] transition"
      >
        <Instagram className="h-3.5 w-3.5" />
        Instagram {name}{" "}
        <span className="text-[var(--accent)] font-bold">&gt;&gt;&gt;</span>
      </a>
    </div>
  );
}

function BrideGroom({ inv }: { inv?: Inv | null }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="py-14 px-6 reveal">
      <SectionHeader label="Bride & Groom" title="With Joyful Hearts" />
      <p className="text-sm text-[var(--muted-foreground)] max-w-xs mx-auto text-center mb-10 leading-relaxed">
        Tuhan membuat segala sesuatu indah pada waktunya.
      </p>
      <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
        <Person
          name={inv?.groom_name || "Deardo"}
          full={inv?.groom_full || "Deardo Indra Nainggolan, S.T."}
          parents={inv?.groom_parents || "Bapak & Ibu Nainggolan"}
          ig={inv?.groom_ig || "deardo"}
        />
        <Person
          name={inv?.bride_name || "Dea"}
          full={inv?.bride_full || "Dea Simbolon, S.T."}
          parents={inv?.bride_parents || "Bapak & Ibu Simbolon"}
          ig={inv?.bride_ig || "dea"}
        />
      </div>
    </section>
  );
}

// ─── Countdown ───────────────────────────────────────────────
function Countdown({ weddingDateMs }: { weddingDateMs: number }) {
  const ref = useScrollReveal();
  const { d, h, m, s } = useCountdown(weddingDateMs);
  const isPast = Date.now() > weddingDateMs;
  const items = [
    { v: d, l: "Hari" },
    { v: h, l: "Jam" },
    { v: m, l: "Menit" },
    { v: s, l: "Detik" },
  ];

  return (
    <section ref={ref} className="py-14 px-6 text-center bg-[var(--muted)]/40 reveal">
      <SectionHeader label="We Found Love" title="Counting The Days" />
      <p className="italic text-[var(--muted-foreground)] max-w-xs mx-auto text-sm mb-2">
        &ldquo;Demikianlah mereka bukan lagi dua, melainkan satu.&rdquo;
      </p>
      <p className="text-xs text-[var(--muted-foreground)] mb-8">— Matius 19 : 6</p>
      {isPast && (
        <p className="font-display text-xl text-[var(--accent)] mb-4">
          Kami telah resmi menikah! 🎉
        </p>
      )}
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {items.map((it) => (
          <div key={it.l} className="event-card-border rounded-xl py-4 bg-[var(--card)] text-center">
            <div className="text-2xl font-display text-[var(--primary)] tabular-nums">
              {String(it.v).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mt-1">
              {it.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Event Card ───────────────────────────────────────────────
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
  const ref = useScrollReveal();

  // Parse "Sabtu, 12 . 10 . 2024" → dayName="Sabtu", dateNum="12 . 10 . 2024"
  const commaIdx = date.indexOf(",");
  const dayName = commaIdx > -1 ? date.slice(0, commaIdx).trim() : "";
  const dateNum = commaIdx > -1 ? date.slice(commaIdx + 1).trim() : date;

  return (
    <div
      ref={ref}
      className="reveal event-card-border rounded-2xl p-8 text-center bg-[var(--card)] relative overflow-hidden"
    >
      {/* Subtle watermark */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Title */}
      <h3 className="font-display text-base uppercase tracking-[0.18em] text-[var(--primary)] relative z-10">
        {title}
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] mt-1 mb-4 relative z-10">
        Acara akan dilaksanakan pada:
      </p>

      {/* Day name in script */}
      {dayName && (
        <p className="font-script text-4xl text-[var(--accent)] relative z-10">{dayName}</p>
      )}
      {/* Numeric date */}
      <p className="font-display text-xl font-bold text-[var(--primary)] tracking-widest mt-1 relative z-10">
        {dateNum}
      </p>

      {/* Diamond divider */}
      <div className="flex items-center gap-3 my-5 relative z-10">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[var(--accent)] text-sm">◇</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Time */}
      <p className="text-sm text-[var(--foreground)] mb-5 relative z-10">Pukul {time}</p>

      {/* Location */}
      <MapPin className="mx-auto h-5 w-5 text-[var(--muted-foreground)] mb-1.5 relative z-10" />
      <p className="text-xs text-[var(--muted-foreground)] mb-1 relative z-10">Bertempat di:</p>
      <p className="font-display text-base text-[var(--primary)] relative z-10">{place}</p>
      <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed relative z-10">
        {address}
      </p>

      {/* OPEN MAPS button — gold */}
      <a
        href={maps}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full
          text-sm font-medium text-white hover:opacity-90 transition relative z-10"
        style={{ backgroundColor: "#c9a84c" }}
      >
        <MapPin className="h-4 w-4" /> OPEN MAPS
      </a>
    </div>
  );
}

const DEFAULT_EVENTS = [
  {
    title: "Engagement",
    date: "Sabtu, 05 . 10 . 2024",
    time: "10.00 WIB — Selesai",
    place: "Gereja HKBP Bolon Pangururan",
    address: "Simpang 4 Jl. Gereja, Ps. Pangururan, Kec. Pangururan, Kab. Samosir",
    maps: "https://maps.app.goo.gl/TLae2MYHnKHpRdBFA",
  },
  {
    title: "Pemberkatan",
    date: "Sabtu, 12 . 10 . 2024",
    time: "10.00 — 12.00 WIB",
    place: "Gereja HKBP Tampubolon",
    address: "Balige, Toba Samosir, Sumatera Utara",
    maps: "https://maps.app.goo.gl/YLXUfzKz5bbtUYWv7",
  },
  {
    title: "Resepsi Pernikahan",
    date: "Sabtu, 12 . 10 . 2024",
    time: "13.00 WIB — Selesai",
    place: "Sopo Parsaoran Nauli Tambunan",
    address: "Jl. Pasar Melintang, Lumban Pea Tim., Kec. Balige, Tambunan, Sumatera Utara",
    maps: "https://maps.app.goo.gl/pqkwVqmzChscKK2E7",
  },
];

function Events({ inv, dataLoaded }: { inv?: Inv | null; dataLoaded: boolean }) {
  const ref = useScrollReveal();
  const events = dataLoaded ? (inv?.events ?? []) : DEFAULT_EVENTS;

  return (
    <section ref={ref} className="py-14 px-5 reveal">
      <SectionHeader label="Save The Date" title="Wedding Events" />
      {events.length === 0 ? (
        <p className="text-center text-[var(--muted-foreground)] py-8 text-sm">
          Belum ada acara yang ditambahkan.
        </p>
      ) : (
        // Stack vertically (right panel is narrow on desktop, and mobile is single col too)
        <div className="space-y-6 max-w-sm mx-auto">
          {events.map((e) => (
            <EventCard key={e.title} {...e} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────
function Gallery({ inv, dataLoaded }: { inv?: Inv | null; dataLoaded: boolean }) {
  const ref = useScrollReveal();
  const rawGallery = dataLoaded ? (inv?.gallery ?? []) : [];
  const images =
    rawGallery.length > 0
      ? rawGallery
      : [couple, heroBg, couple, heroBg, couple, heroBg];

  return (
    <section ref={ref} className="reveal">
      {/* Dark header */}
      <div className="bg-[#2d3a2a] py-10 text-center text-white px-5">
        <h2 className="font-display text-3xl">Our Gallery</h2>
        <p className="text-sm mt-2 opacity-60 italic">Constantly, consistently, continually, You.</p>
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 gap-0.5 bg-[#2d3a2a] p-0.5">
        {images.map((src, i) => (
          <div
            key={i}
            className={`overflow-hidden ${i === 2 ? "col-span-2" : ""}`}
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition duration-700"
              style={{ aspectRatio: i === 2 ? "16/7" : "4/5" }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Love Story ───────────────────────────────────────────────
const DEFAULT_LOVE_STORY = [
  {
    year: "2013",
    title: "First Meet",
    text: "Keduanya pertama kali bertemu saat masih di bangku SMA, bergabung dalam ekstrakurikuler yang sama.",
  },
  {
    year: "2016",
    title: "Relationship",
    text: "Tak disangka keduanya melanjutkan pendidikan di kampus yang sama dan bergabung di organisasi yang sama.",
  },
  {
    year: "2017",
    title: "Together",
    text: "Setelah berani mengungkapkan perasaan, keduanya resmi menjalin hubungan.",
  },
  {
    year: "2023",
    title: "Engagement",
    text: "Enam tahun berlalu, di momen yang sederhana, lamaran diterima dengan penuh haru.",
  },
];

function StoryItem({ s }: { s: { year: string; title: string; text: string } }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="flex gap-5 mb-10 relative reveal">
      {/* Timeline dot + year */}
      <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 56 }}>
        <div className="w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--card)] mt-1 z-10" />
        <span className="font-display text-sm text-[var(--primary)] mt-1">{s.year}</span>
      </div>
      {/* Content */}
      <div className="flex-1 pb-2">
        <p className="font-script text-2xl text-[var(--accent)]">{s.title}</p>
        <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">{s.text}</p>
      </div>
    </div>
  );
}

function LoveStory({ inv, dataLoaded }: { inv?: Inv | null; dataLoaded: boolean }) {
  const ref = useScrollReveal();
  const stories = dataLoaded ? (inv?.love_story ?? []) : DEFAULT_LOVE_STORY;

  return (
    <section ref={ref} className="py-14 px-6 reveal bg-[var(--muted)]/30">
      <SectionHeader label="Love Story" title="Ours Is My Favorite" />
      <div className="max-w-sm mx-auto relative">
        {stories.length === 0 ? (
          <p className="text-center text-[var(--muted-foreground)] py-8 text-sm">
            Belum ada cerita yang ditambahkan.
          </p>
        ) : (
          <>
            {/* Timeline vertical line */}
            <div className="absolute left-[28px] top-2 bottom-2 w-px bg-[var(--border)]" />
            {stories.map((s, idx) => (
              <StoryItem key={s.year + idx} s={s} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}


// ─── Gift ─────────────────────────────────────────────────────
const DEFAULT_BANKS = [
  { bank: "Bank Mandiri", number: "1650001827451", name: "Deardo Indra Nainggolan" },
  { bank: "Bank BRI", number: "043001009542535", name: "Dea Simbolon" },
];

function Account({ bank, number, name }: { bank: string; number: string; name: string }) {
  const copy = () => {
    navigator.clipboard.writeText(number);
    toast.success("Nomor rekening disalin");
  };
  return (
    <Card className="p-6 text-center">
      <p className="font-display text-lg text-[var(--primary)]">{bank}</p>
      <p className="text-xl tracking-wider mt-3 font-mono">{number}</p>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">a.n {name}</p>
      <Button onClick={copy} variant="outline" className="mt-4 rounded-full text-xs">
        <Copy className="mr-2 h-3.5 w-3.5" /> Salin Nomor
      </Button>
    </Card>
  );
}

function Gift({ inv, dataLoaded }: { inv?: Inv | null; dataLoaded: boolean }) {
  const ref = useScrollReveal();
  const banks = dataLoaded ? (inv?.banks ?? []) : DEFAULT_BANKS;

  return (
    <section ref={ref} className="py-14 px-6 reveal">
      <SectionHeader label="Wedding Gift" title="Tanda Kasih" />
      <p className="text-sm text-[var(--muted-foreground)] max-w-xs mx-auto text-center mb-8">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
      </p>
      {banks.length === 0 ? (
        <p className="text-center text-[var(--muted-foreground)] text-sm">
          Belum ada rekening yang ditambahkan.
        </p>
      ) : (
        <div className="space-y-4 max-w-xs mx-auto">
          {banks.map((b) => (
            <Account key={b.bank} {...b} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────
function Rsvp({ slug }: { slug: string }) {
  const ref = useScrollReveal();
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

  const selectCls =
    "mt-1 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <section ref={ref} className="py-14 px-6 bg-[var(--muted)]/30 reveal">
      <SectionHeader label="RSVP" title="Konfirmasi Kehadiran" />
      <div className="event-card-border rounded-2xl p-6 bg-[var(--card)] max-w-xs mx-auto">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
              Nama *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
              Konfirmasi Kehadiran
            </label>
            <select
              value={form.attendance}
              onChange={(e) => setForm({ ...form, attendance: e.target.value })}
              className={selectCls}
            >
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
              Jumlah Kehadiran
            </label>
            <select
              value={form.count}
              onChange={(e) => setForm({ ...form, count: e.target.value })}
              className={selectCls}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
              Alamat Domisili
            </label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1"
              placeholder="Nama Kota"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-medium
              flex items-center justify-center gap-2 transition
              bg-[var(--primary)] text-[var(--primary-foreground)]
              hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "▶ Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Wishes ───────────────────────────────────────────────────
type Wish = { name: string; attendance?: string; status?: string; message: string };

function Wishes({ slug }: { slug: string }) {
  const ref = useScrollReveal();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [form, setForm] = useState({ name: "", status: "Hadir", message: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/invitations/${slug}/wishes`);
      setWishes(data.data || data || []);
    } catch {
      setWishes([
        { name: "Devi Maria", status: "Hadir", message: "Happy Wedding! Tuhan memberkati! 🙏" },
        { name: "Graceee", status: "Hadir", message: "Wishing u a lifetime love and happiness ❤️" },
      ]);
    }
  };

  useEffect(() => { load(); }, [slug]);

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

  const selectCls =
    "w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <section ref={ref} className="py-14 px-6 reveal">
      <SectionHeader label="Best Wishes" title="Doa & Ucapan" />

      {/* Wish form */}
      <form onSubmit={submit} className="max-w-xs mx-auto space-y-3 mb-8">
        <Input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectCls}>
          <option>Hadir</option>
          <option>Tidak Hadir</option>
          <option>Masih Ragu</option>
        </select>
        <Textarea
          placeholder="Tulis ucapan & doa..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="min-h-[80px]"
        />
        <Button type="submit" disabled={loading} className="w-full rounded-full text-sm">
          {loading ? "Mengirim..." : "Kirim Ucapan"}
        </Button>
      </form>

      {/* Wish list */}
      <div className="space-y-3 max-w-xs mx-auto max-h-72 overflow-y-auto pr-1">
        {wishes.map((w, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-sm font-display flex-shrink-0">
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-display text-base text-[var(--primary)]">{w.name}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex-shrink-0">
                {w.attendance || w.status}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2 pl-10 leading-relaxed">
              {w.message}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer({ inv }: { inv?: Inv | null }) {
  const ref = useScrollReveal();
  const groomName = inv?.groom_name || "Deardo";
  const brideName = inv?.bride_name || "Dea";
  const dateStr = inv?.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "12 Oktober 2024";

  return (
    <footer
      ref={ref}
      className="relative py-20 text-center px-6 reveal overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.75), rgba(245,243,232,0.90)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundAttachment: "local",
      }}
    >
      <img src={floral} alt="" className="mx-auto w-32 mb-6 animate-sway" loading="lazy" />
      <p className="font-script text-4xl text-[var(--accent)]">Thank You</p>
      <h2 className="font-display text-3xl md:text-4xl text-[var(--primary)] mt-2">
        {groomName} & {brideName}
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-4 tracking-widest">{dateStr}</p>
      <p className="mt-6 text-[10px] text-[var(--muted-foreground)] opacity-60">
        Made with ❤️ — Wedding Invitation
      </p>
    </footer>
  );
}

// ─── Right Panel Content (shared desktop + mobile) ────────────
function RightPanelContent({
  inv,
  slug,
  dataLoaded,
  weddingDateMs,
}: {
  inv?: Inv | null;
  slug: string;
  dataLoaded: boolean;
  weddingDateMs: number;
}) {
  return (
    <>
      <BrideGroom inv={inv} />
      <Countdown weddingDateMs={weddingDateMs} />
      <Events inv={inv} dataLoaded={dataLoaded} />
      <Gallery inv={inv} dataLoaded={dataLoaded} />
      <LoveStory inv={inv} dataLoaded={dataLoaded} />
      <Gift inv={inv} dataLoaded={dataLoaded} />
      <Rsvp slug={slug} />
      <Wishes slug={slug} />
      <Footer inv={inv} />
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function InvitationPage() {
  const params = useParams();
  const [search] = useSearchParams();
  const slug = params.slug || "bobby-krisma";

  const [opened, setOpened] = useState(false);
  const [invData, setInvData] = useState<InvData | null>(null);

  // musicSrc is computed first (before useMusicPlayer) so we can pass it in
  // Note: invData starts null so musicSrc defaults to the fallback path
  const [musicSrc, setMusicSrc] = useState("/music/wedding-bg.mp3");

  const { audioRef, playing, start, toggle } = useMusicPlayer(musicSrc);

  // Update musicSrc when invData arrives
  useEffect(() => {
    if (invData?.invitation?.music_url) {
      setMusicSrc(invData.invitation.music_url);
    }
  }, [invData]);

  // Fix guest name: Title Case, replace hyphens/underscores/+ with space
  const guestName = useMemo(() => {
    const raw = invData?.guest_name || search.get("to") || "Tamu Undangan";
    return decodeURIComponent(raw)
      .replace(/[+_]/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }, [search, invData]);

  // Dynamic browser title
  useEffect(() => {
    if (invData?.invitation) {
      const { groom_name, bride_name } = invData.invitation;
      document.title = `The Wedding of ${groom_name} & ${bride_name}`;
    }
  }, [invData]);

  // Fetch invitation data
  useEffect(() => {
    api
      .get(`/invitations/${slug}`)
      .then((r) => setInvData(r.data))
      .catch(() => {});
  }, [slug]);

  // Lock body scroll (desktop uses right-panel scroll, mobile uses window)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleOpen = () => {
    setOpened(true);
    start(); // Trigger music after user interaction
  };

  const weddingDateMs = invData?.invitation?.wedding_date
    ? new Date(invData.invitation.wedding_date).getTime()
    : FALLBACK_DATE;

  const dataLoaded = invData !== null;

  return (
    <div className="relative">
      {/* Hidden audio element — src managed by useMusicPlayer hook */}
      <audio ref={audioRef} loop preload="none" />

      {/* ══════════════ DESKTOP LAYOUT (md+) ══════════════ */}
      <div className="hidden md:block">
        {/* Left Panel — always visible on desktop */}
        <AnimatedLeftPanel
          inv={invData?.invitation}
          playing={playing}
          onToggleMusic={toggle}
        />

        {/* Right Panel — 35% width, scrollable */}
        <div
          className="right-panel fixed right-0 top-0 h-screen overflow-y-auto bg-[var(--background)] z-20"
          style={{ width: "35%", left: "65%" }}
        >
          {!opened ? (
            <DesktopCoverCard guestName={guestName} onOpen={handleOpen} />
          ) : (
            <div className="animate-float-in">
              <RightPanelContent
                inv={invData?.invitation}
                slug={slug}
                dataLoaded={dataLoaded}
                weddingDateMs={weddingDateMs}
              />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ MOBILE LAYOUT (< md) ══════════════ */}
      <div className="md:hidden">
        {!opened ? (
          <MobileCover
            inv={invData?.invitation}
            guestName={guestName}
            onOpen={handleOpen}
            playing={playing}
            onToggleMusic={toggle}
          />
        ) : (
          <>
            <div
              className="animate-float-in overflow-y-auto"
              style={{ height: "100dvh" }}
            >
              <MobileHero inv={invData?.invitation} />
              <RightPanelContent
                inv={invData?.invitation}
                slug={slug}
                dataLoaded={dataLoaded}
                weddingDateMs={weddingDateMs}
              />
            </div>

            {/* Floating vinyl disc for mobile (after open) */}
            <button
              onClick={toggle}
              className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full
                bg-white/80 backdrop-blur-sm shadow-lg border border-[var(--border)]
                flex items-center justify-center hover:bg-white transition"
              title={playing ? "Pause musik" : "Putar musik"}
            >
              <VinylDiscIcon spinning={playing} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
