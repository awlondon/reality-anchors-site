import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from './ui';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/subscription', label: 'Subscription', icon: '◈' },
  { to: '/billing', label: 'Billing', icon: '▤' },
  { to: '/seats', label: 'Benches', icon: '◉' },
  { to: '/contracts', label: 'Contracts', icon: '▧' },
];

const adminItems = [
  { to: '/admin', label: 'Retention', icon: '◬' },
];

export default function Layout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-2 border-r border-line flex flex-col">
        <div className="p-6 border-b border-line">
          <h1 className="text-lg font-semibold text-txt">Reality Anchors</h1>
          <p className="text-xs text-muted mt-0.5">Customer Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent-2 font-medium'
                    : 'text-muted hover:text-txt hover:bg-card'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-xs font-medium text-muted/60 uppercase tracking-wider px-3">Admin</p>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent-2 font-medium'
                        : 'text-muted hover:text-txt hover:bg-card'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-line">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-2 text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-txt truncate">{user?.email}</p>
              {profile?.role && (
                <p className="text-xs text-muted capitalize">{profile.role}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" className="w-full text-sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
