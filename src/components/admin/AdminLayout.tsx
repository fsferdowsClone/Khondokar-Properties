import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from '@/src/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LayoutDashboard, Building2, BookOpen, MessageSquare, Settings, LogOut, Globe, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
            src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/real-estate-logo-luxury.png" 
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

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full bg-surface p-10 rounded-xl border border-border text-center">
          <img 
            src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/real-estate-logo-luxury.png" 
            alt="Khondokar Properties" 
            className="w-20 h-20 mx-auto mb-6 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-serif mb-2">Identity Verification</h1>
          <p className="text-text-muted mb-8">Password accepted. Now sign in with Google to verify your identity for database access.</p>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-accent-gold text-background py-3 rounded-small font-semibold hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            Verify with Google
          </button>
          <button 
            onClick={() => { setIsAuthorized(false); sessionStorage.removeItem('admin_auth'); }}
            className="mt-4 text-xs text-text-muted hover:text-white"
          >
            Back to Password
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Properties', icon: Building2, path: '/admin/properties' },
    { name: 'Bookings', icon: MessageSquare, path: '/admin/bookings' },
    { name: 'Blog', icon: BookOpen, path: '/admin/blog' },
    { name: 'Testimonials', icon: Users, path: '/admin/testimonials' },
    { name: 'Site Content', icon: Globe, path: '/admin/content' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <img 
            src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/real-estate-logo-luxury.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif font-semibold tracking-tight">Admin CMS</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
