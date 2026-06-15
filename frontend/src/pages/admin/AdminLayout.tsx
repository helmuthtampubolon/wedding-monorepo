import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/admin', label: 'Undangan', icon: '💌', exact: true },
  { to: '/admin/templates', label: 'Template', icon: '🎨', exact: false },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const location = useLocation();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}');
    } catch {
      return {};
    }
  })();

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    nav('/admin/login');
  };

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex font-sans bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary)] text-[var(--primary-foreground)] flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/10">
          <p className="font-script text-3xl text-white/90">Wedding</p>
          <p className="text-xs uppercase tracking-widest text-white/50 mt-0.5">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_LINKS.map(({ to, label, icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-display">
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left text-xs text-white/50 hover:text-white/80 transition px-1"
          >
            Keluar →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-[var(--border)] bg-white/60 backdrop-blur-sm flex items-center px-8 flex-shrink-0">
          <p className="text-sm text-[var(--muted-foreground)]">
            {location.pathname === '/admin'
              ? 'Dashboard — Manajemen Undangan'
              : location.pathname.startsWith('/admin/templates')
              ? 'Manajemen Template'
              : location.pathname.includes('/guests')
              ? 'Manajemen Tamu'
              : location.pathname.includes('/rsvps')
              ? 'RSVP & Ucapan'
              : 'Edit Undangan'}
          </p>
        </header>

        {/* Page content */}
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
