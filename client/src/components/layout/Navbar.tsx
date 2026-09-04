import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  GraduationCap,
  Menu,
  X,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Wifi,
  WifiOff,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import api from '../../services/api';
import { Notification } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isContentManager, logout } = useAuth();
  const { isConnected } = useSocket();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated, location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Alumni Directory', path: '/directory' },
    { name: 'Events', path: '/events' },
    { name: 'Stories', path: '/stories' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      // Ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle transition-all">
      {/* Institutional Top Bar */}
      <div className="bg-college-navy text-white text-xs py-1.5">
        <div className="fluid-container flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-college-gold-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              {settings.hero_badge || 'Estd. 1853 • Autonomous • NAAC A++'}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-200 truncate">
              Official Alumni Network of Government College Rajahmundry
            </span>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            {/* Real-time connection indicator */}
            <div className="flex items-center gap-1.5 text-[11px]" title={isConnected ? 'Real-time sync active' : 'Connecting to real-time engine...'}>
              {isConnected ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">Live Sync</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-300">
                  <WifiOff className="w-3 h-3" />
                  <span className="hidden sm:inline">Syncing</span>
                </span>
              )}
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors bg-white/10 px-2 py-0.5 rounded"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="fluid-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Title */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-college-navy text-college-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 border-2 border-college-gold/40">
              <GraduationCap className="w-7 h-7 text-college-gold" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-college-navy font-display tracking-tight leading-tight">
                  {settings.college_short_name || 'GCRJY'} ALUMNI CONNECT
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 line-clamp-1">
                {settings.college_name || 'Government College (Autonomous), Rajahmundry'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    active
                      ? 'text-college-navy font-bold bg-college-navy-50/80 border border-college-navy-100'
                      : 'text-slate-600 hover:text-college-navy hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Profile Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-college-navy" /> Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-college-blue-600 hover:text-college-blue-800 font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                                !n.isRead ? 'bg-blue-50/40 font-medium' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold text-slate-800">{n.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                              {n.link && (
                                <Link
                                  to={n.link}
                                  onClick={() => setNotificationsOpen(false)}
                                  className="inline-flex items-center gap-1 text-[11px] text-college-blue-600 hover:underline mt-1 font-medium"
                                >
                                  View details <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    {user?.profile?.profilePhoto ? (
                      <img
                        src={user.profile.profilePhoto}
                        alt={user.profile.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-college-navy-100 text-college-navy font-bold text-xs flex items-center justify-center">
                        {user?.profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden md:inline">
                      {user?.profile?.fullName || user?.email.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {user?.profile?.fullName || 'Alumni Member'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <Badge variant="primary" size="sm" className="mt-1 font-semibold">
                          {user?.role}
                        </Badge>
                      </div>

                      <Link
                        to="/user/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Alumni Dashboard
                      </Link>

                      <Link
                        to="/user/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" /> Edit Profile & Privacy
                      </Link>

                      {isContentManager && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Management
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="font-semibold text-slate-700"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="font-bold shadow-sm"
                >
                  Join Network
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-semibold rounded-lg ${
                    active
                      ? 'bg-college-navy-50 text-college-navy font-bold border border-college-navy-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-college-navy-50 text-college-navy border border-college-navy-200"
                >
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Join Network
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
