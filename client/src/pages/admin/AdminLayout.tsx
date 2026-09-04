import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  BellRing,
  Quote,
  Image as ImageIcon,
  Mail,
  FileSpreadsheet,
  History,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Wifi,
  WifiOff,
  Menu,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const AdminLayout: React.FC = () => {
  const { user, logout, isSuperAdmin, isContentManager } = useAuth();
  const { isConnected } = useSocket();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Executive Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Alumni Directory CMS', path: '/admin/alumni', icon: Users },
    { label: 'User & Role Security', path: '/admin/users', icon: UserCheck, superAdminOnly: true },
    { label: 'Events & Reunions CMS', path: '/admin/events', icon: Calendar },
    { label: 'News & Bulletins CMS', path: '/admin/news', icon: BellRing },
    { label: 'Success Stories CMS', path: '/admin/stories', icon: Quote },
    { label: 'Campus Gallery CMS', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Contact Inquiries', path: '/admin/messages', icon: Mail },
    { label: 'Data Import & Export', path: '/admin/import-export', icon: FileSpreadsheet },
    { label: 'Audit Log Trail', path: '/admin/audit-logs', icon: History, superAdminOnly: true },
    { label: 'Branding & Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-left font-sans relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-college-navy-900 text-slate-300 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <Link to="/admin" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-college-navy text-college-gold flex items-center justify-center shrink-0 border border-college-gold/40 shadow-sm">
                <GraduationCap className="w-6 h-6 text-college-gold" />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-white text-sm font-display truncate tracking-tight">
                    GCRJY ADMIN
                  </span>
                  <span className="text-[10px] text-college-gold-300 truncate">
                    Control Management Hub
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              if (item.superAdminOnly && !isSuperAdmin) return null;
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-college-gold text-college-navy-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {!collapsed ? (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.profile?.fullName || user?.email}
                </p>
                <Badge variant="gold" size="sm" className="mt-0.5 text-[9px] py-0">
                  {user?.role}
                </Badge>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-700"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!collapsed && <span>Public Alumni Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Admin Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-college-navy font-display leading-none">
                {settings.college_name || 'Government College (Autonomous), Rajahmundry'}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Admin Control Center • Real-Time Synchronization Engine Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Socket Status */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
              {isConnected ? (
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px]">Real-Time Active</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600 text-[11px]">
                  <WifiOff className="w-3.5 h-3.5" /> Reconnecting
                </span>
              )}
            </div>

            <Link
              to="/"
              className="text-xs font-bold text-college-navy hover:text-college-navy-700 hidden sm:inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              View Public Website <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Nested Admin Page Route */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
