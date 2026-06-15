import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import heroBg from '@/assets/garden-hero.jpg';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@wedding.test');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/auth/login', { email, password });
      localStorage.setItem('admin_token', r.data.token);
      localStorage.setItem('admin_user', JSON.stringify(r.data.user));
      toast.success('Selamat datang kembali!');
      nav('/admin');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(245,243,232,0.5), rgba(245,243,232,0.7)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '1.25rem',
          border: '1px solid rgba(207,197,165,0.5)',
          padding: '2.5rem',
          boxShadow: '0 20px 60px -20px rgba(74,93,63,0.3)',
        }}
      >
        {/* Logo / Branding */}
        <div className="text-center mb-6">
          <p className="font-script text-4xl text-[var(--accent)]">Admin</p>
          <h1 className="font-display text-3xl text-[var(--primary)] mt-1">Wedding Dashboard</h1>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>

        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--input)] rounded-lg px-4 py-2.5 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition"
              placeholder="admin@wedding.test"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--input)] rounded-lg px-4 py-2.5 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-medium text-sm tracking-wide hover:opacity-90 disabled:opacity-50 transition mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memproses...
              </span>
            ) : 'Masuk'}
          </button>
        </div>
      </form>
    </div>
  );
}
