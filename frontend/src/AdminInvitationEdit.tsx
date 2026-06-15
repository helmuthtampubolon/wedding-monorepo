import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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
      toast.success('Selamat datang');
      nav('/admin');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login gagal');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow space-y-4">
        <h1 className="font-display text-3xl text-sage text-center">Login Admin</h1>
        <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
        <input className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
        <button disabled={loading} className="w-full py-2.5 rounded-full bg-sage text-white">{loading ? 'Memproses...' : 'Login'}</button>
        <p className="text-xs text-center text-gray-500">Default: admin@wedding.test / password</p>
      </form>
    </div>
  );
}
