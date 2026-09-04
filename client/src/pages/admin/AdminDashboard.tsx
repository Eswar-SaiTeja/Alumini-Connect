import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  Ticket,
  BellRing,
  Quote,
  Image as ImageIcon,
  Mail,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  History as HistoryIcon,
} from 'lucide-react';

const COLORS = ['#0a2540', '#c89116', '#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed'];

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Listen to live events and update dashboard without manual refresh
  useEffect(() => {
    const unsub = subscribe('*', () => {
      fetchDashboardStats();
    });
    return () => unsub();
  }, [subscribe]);

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await api.patch(`/admin/alumni/${id}/verify`, { isVerified });
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to update verification status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-college-navy" />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  const kpiCards = [
    {
      title: 'Total Alumni Registered',
      value: metrics.totalAlumni || 0,
      icon: Users,
      color: 'bg-college-navy text-white',
      link: '/admin/alumni',
    },
    {
      title: 'Verified Profiles',
      value: metrics.verifiedAlumni || 0,
      icon: UserCheck,
      color: 'bg-emerald-600 text-white',
      link: '/admin/alumni',
    },
    {
      title: 'Pending Approvals',
      value: metrics.pendingApprovals || 0,
      icon: Clock,
      color: 'bg-amber-500 text-white',
      link: '/admin/users',
    },
    {
      title: 'Active Events',
      value: metrics.totalEvents || 0,
      icon: Calendar,
      color: 'bg-blue-600 text-white',
      link: '/admin/events',
    },
    {
      title: 'Event Registrations',
      value: metrics.totalRegistrations || 0,
      icon: Ticket,
      color: 'bg-purple-600 text-white',
      link: '/admin/events',
    },
    {
      title: 'Unread Inquiries',
      value: metrics.unreadMessages || 0,
      icon: Mail,
      color: 'bg-rose-600 text-white',
      link: '/admin/messages',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Executive Analytics & Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time platform metrics, alumni distribution analytics, and administrative feed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardStats}
            className="font-bold text-xs"
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/alumni')}
            className="font-bold text-xs shadow-sm"
          >
            Manage Alumni
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 line-clamp-1">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-display">
                {kpi.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Alumni by Batch */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Alumni Distribution by Graduation Batch
              </h3>
              <p className="text-xs text-slate-500">Graduates registered per graduation year</p>
            </div>
            <Badge variant="primary" size="sm">
              Batch Metrics
            </Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.alumniByBatch || []}>
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2540',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0a2540" radius={[6, 6, 0, 0]} name="Alumni" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Alumni by Department */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Alumni by Academic Department
              </h3>
              <p className="text-xs text-slate-500">Breakdown across arts, science, and commerce</p>
            </div>
            <Badge variant="gold" size="sm">
              Departments
            </Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.alumniByDepartment || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {(charts.alumniByDepartment || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2540',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Alumni by Industry */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Industry & Career Representation
              </h3>
              <p className="text-xs text-slate-500">Distribution across career domains</p>
            </div>
            <Badge variant="secondary" size="sm">
              Industries
            </Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.alumniByIndustry || []} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2540',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#c89116" radius={[0, 6, 6, 0]} name="Alumni" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Event Participation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Event Attendance & Capacities
              </h3>
              <p className="text-xs text-slate-500">Confirmed registrations vs hall capacity</p>
            </div>
            <Badge variant="primary" size="sm">
              Conventions
            </Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.eventParticipation || []}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2540',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="registered" fill="#1e40af" radius={[6, 6, 0, 0]} name="Registered" />
                <Bar dataKey="capacity" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Registrations & Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Alumni Registrations */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-college-navy" /> Recent Alumni Registrations
            </h3>
            <Link to="/admin/alumni" className="text-xs text-college-blue-600 hover:underline font-bold">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Batch & Dept</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.recentAlumni?.map((alum: any) => (
                  <tr key={alum.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{alum.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      '{alum.graduationYear.toString().slice(-2)} • {alum.department}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={alum.isVerified ? 'success' : 'warning'} size="sm">
                        {alum.isVerified ? 'VERIFIED' : 'PENDING'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {!alum.isVerified ? (
                        <button
                          onClick={() => handleVerify(alum.id, true)}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold"
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-college-navy" /> Live Audit Log Trail
            </h3>
            <Link to="/admin/audit-logs" className="text-xs text-college-blue-600 hover:underline font-bold">
              Full Logs
            </Link>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {data.recentLogs?.map((log: any) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-college-navy">{log.adminEmail}</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="font-bold text-slate-800 mt-1">{log.action}</p>
                {log.details && <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
