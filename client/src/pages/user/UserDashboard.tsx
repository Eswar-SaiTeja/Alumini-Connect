import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import { Event, AlumniProfile, Notification } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  GraduationCap,
  Calendar,
  Ticket,
  Bell,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const [recommendedAlumni, setRecommendedAlumni] = useState<AlumniProfile[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateProfileScore = () => {
    if (!user?.profile) return 30;
    let score = 30; // base account
    if (user.profile.profilePhoto) score += 15;
    if (user.profile.bio) score += 15;
    if (user.profile.currentCompany) score += 15;
    if (user.profile.currentDesignation) score += 10;
    if (user.profile.skills && user.profile.skills.length > 0) score += 15;
    return Math.min(100, score);
  };

  const profileScore = calculateProfileScore();

  const fetchDashboardData = async () => {
    try {
      if (user?.profile?.department) {
        const recRes = await api.get(
          `/alumni?department=${encodeURIComponent(user.profile.department)}&limit=4`
        );
        setRecommendedAlumni(
          (recRes.data.alumni || []).filter((a: AlumniProfile) => a.userId !== user.id)
        );
      }

      const evtRes = await api.get('/events?type=upcoming');
      setUpcomingEvents(evtRes.data.events?.slice(0, 2) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const unsub = subscribe('EVENT_REGISTERED', () => refreshUser());
    return () => unsub();
  }, [subscribe, refreshUser]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container space-y-8">
        {/* User Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.profile.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-college-gold/30 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-college-navy text-white text-2xl font-bold flex items-center justify-center font-display">
                  {user?.profile?.fullName?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                </div>
              )}
              {user?.profile?.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm"
                  title="Verified Alumnus"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  Welcome back, {user?.profile?.fullName || 'Alumni Member'}!
                </h1>
                <Badge variant="gold" size="sm">
                  Class of {user?.profile?.graduationYear}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Department of {user?.profile?.department} • {user?.email}
              </p>
              {user?.profile?.currentDesignation && (
                <p className="text-xs font-semibold text-college-navy mt-1">
                  {user.profile.currentDesignation}
                  {user.profile.currentCompany ? ` at ${user.profile.currentCompany}` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/user/settings')}
              className="font-bold text-xs"
            >
              Profile Settings
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/directory/${user?.profile?.id}`)}
              className="font-bold text-xs shadow-sm"
            >
              View Public Card
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Completion + Registered Events */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Completion Meter */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-college-gold" /> Profile Strength Meter
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete profiles receive 4x more mentorship connections from batchmates.
                  </p>
                </div>
                <span className="text-lg font-extrabold text-college-navy font-display">
                  {profileScore}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-college-navy to-college-gold rounded-full transition-all duration-500"
                  style={{ width: `${profileScore}%` }}
                />
              </div>

              {/* Actionable Checklist */}
              {profileScore < 100 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  {!user?.profile?.bio && (
                    <Link
                      to="/user/settings"
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>📝 Add your bio & college memories</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  )}
                  {(!user?.profile?.skills || user.profile.skills.length === 0) && (
                    <Link
                      to="/user/settings"
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>💡 Add skills & expertise tags</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  )}
                  {!user?.profile?.currentCompany && (
                    <Link
                      to="/user/settings"
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>🏢 Add current employer / designation</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* My Event Registrations */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-college-navy" /> My Event Registrations
                </h3>
                <Link
                  to="/events"
                  className="text-xs font-bold text-college-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Explore more events <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {user?.registrations && user.registrations.length > 0 ? (
                <div className="space-y-3">
                  {user.registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-college-navy bg-white px-2 py-0.5 rounded border border-slate-200">
                            {reg.ticketNumber}
                          </span>
                          <Badge
                            variant={reg.attendanceStatus === 'REGISTERED' ? 'success' : 'default'}
                            size="sm"
                          >
                            {reg.attendanceStatus}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {reg.event?.title || 'Alumni Event'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          📅 {reg.event?.eventDate} • 📍 {reg.event?.venue}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/events`)}
                        className="font-bold text-xs shrink-0 self-start sm:self-auto"
                      >
                        Event Hub
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Ticket className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">
                    You haven't registered for any events yet.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => navigate('/events')}>
                    Browse Upcoming Meets
                  </Button>
                </div>
              )}
            </div>

            {/* Batch & Department Peer Recommendations */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-college-navy" /> Alumni from Your Department
                </h3>
                <Link
                  to={`/directory?department=${encodeURIComponent(user?.profile?.department || '')}`}
                  className="text-xs font-bold text-college-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  View all in {user?.profile?.department} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedAlumni.map((alum) => (
                  <div
                    key={alum.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3 hover:bg-slate-100 transition-colors"
                  >
                    {alum.profilePhoto ? (
                      <img
                        src={alum.profilePhoto}
                        alt={alum.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-college-navy text-white font-bold flex items-center justify-center text-sm">
                        {alum.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{alum.fullName}</h4>
                      <p className="text-[11px] text-college-navy font-semibold">
                        Class of {alum.graduationYear}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {alum.currentDesignation || alum.currentCompany || 'Alumnus'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/directory/${alum.id}`)}
                      className="text-xs px-2.5 shrink-0"
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recent Notifications & Quick Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-slate-900 font-display">Quick Actions</h3>

              <div className="space-y-2 text-xs font-semibold">
                <Link
                  to="/directory"
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-college-navy-50 hover:text-college-navy border border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-college-navy" /> Search Alumni Directory
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  to="/events"
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-college-navy-50 hover:text-college-navy border border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Reunions
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  to="/news"
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-college-navy-50 hover:text-college-navy border border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" /> Announcements & News
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-college-navy-50 hover:text-college-navy border border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Contact Alumni Desk
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Bell className="w-4 h-4 text-college-navy" /> Recent In-App Alerts
              </h3>

              <div className="space-y-3">
                {user?.notifications && user.notifications.length > 0 ? (
                  user.notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-2xl border text-xs ${
                        !n.isRead ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No alerts at this moment.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
