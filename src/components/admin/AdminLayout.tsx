import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from '@/src/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LayoutDashboard, Building2, BookOpen, MessageSquare, Settings, LogOut, Globe, Users, Menu, X, Youtube } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LabluMama') {
      setIsAuthorized(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-accent-gold">Loading...</div>;

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full bg-surface p-10 rounded-xl border border-border text-center">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNTBMNTAgMjAwSDkwVjQ1MEgyMTBWMzAwSDI5MFY0NTBIMzkwVjIwMEg0NTBMMjUwIDUwWiIgZmlsbD0iIzAwMkI0OSIvPgo8cGF0aCBkPSJNMjUwIDUwTDE1MCAxMjVMMjUwIDIwMEwzNTAgMTI1TDI1MCA1MFoiIGZpbGw9IiMyRDZBNzQiLz4KPHBhdGggZD0iTTI1MCAyMDBMMTUwIDI3NVY0NTBIMjUwVjIwMFoiIGZpbGw9IiNBNjhCNUIiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=" 
            alt="Khondokar Properties" 
            className="w-20 h-20 mx-auto mb-6 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-serif mb-2">Admin Portal</h1>
          <p className="text-text-muted mb-8">Enter password to access the CMS</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold text-center"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-accent-gold text-background py-3 rounded-small font-semibold hover:bg-white transition-all"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Properties', icon: Building2, path: '/admin/properties' },
    { name: 'Bookings', icon: MessageSquare, path: '/admin/bookings' },
    { name: 'Blog', icon: BookOpen, path: '/admin/blog' },
    { name: 'Videos', icon: Youtube, path: '/admin/videos' },
    { name: 'Testimonials', icon: Users, path: '/admin/testimonials' },
    { name: 'Site Content', icon: Globe, path: '/admin/content' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-text-primary overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-accent-gold text-background p-4 rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNTBMNTAgMjAwSDkwVjQ1MEgyMTBWMzAwSDI5MFY0NTBIMzkwVjIwMEg0NTBMMjUwIDUwWiIgZmlsbD0iIzAwMkI0OSIvPgo8cGF0aCBkPSJNMjUwIDUwTDE1MCAxMjVMMjUwIDIwMEwzNTAgMTI1TDI1MCA1MFoiIGZpbGw9IiMyRDZBNzQiLz4KPHBhdGggZD0iTTI1MCAyMDBMMTUwIDI3NVY0NTBIMjUwVjIwMFoiIGZpbGw9IiNBNjhCNUIiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-serif font-semibold tracking-tight">Admin CMS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-muted">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-small transition-colors ${
                location.pathname === item.path ? 'bg-accent-gold text-background' : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full" />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">{user.displayName}</p>
                  <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout().then(() => {
                    sessionStorage.removeItem('admin_auth');
                    setIsAuthorized(false);
                    navigate('/');
                  });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] text-text-muted px-4 leading-relaxed">
                Signed in with password. To edit database, verify with Google.
              </p>
              <button
                onClick={loginWithGoogle}
                className="w-full bg-accent-gold text-background py-2 rounded-small font-semibold hover:bg-white transition-all text-xs"
              >
                Verify with Google
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_auth');
                  setIsAuthorized(false);
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-text-muted hover:text-white transition-colors text-xs font-medium"
              >
                <LogOut size={16} />
                Exit Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
