import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    nav('/admin/login');
  };
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-sage text-white p-6">
        <h2 className="font-display text-2xl mb-8">Wedding Admin</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block hover:opacity-80">Undangan</Link>
          <Link to="/admin/templates" className="block hover:opacity-80">Template</Link>
        </nav>
        <button onClick={logout} className="mt-12 text-sm opacity-70 hover:opacity-100">Logout</button>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
