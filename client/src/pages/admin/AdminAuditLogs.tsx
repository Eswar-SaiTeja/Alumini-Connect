import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { AuditLog } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { History, Shield, Search, Clock, User } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('ALL');

  const { subscribe } = useSocket();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '20');
      if (actionFilter !== 'ALL') params.set('action', actionFilter);

      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      setLogs(res.data.logs || []);
      setTotalRecords(res.data.pagination.total || 0);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter]);

  useEffect(() => {
    const unsub = subscribe('AUDIT_LOG_CREATED', () => fetchLogs());
    return () => unsub();
  }, [subscribe, currentPage, actionFilter]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            System Security & Action Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable log of all administrative actions, content publications, and user verifications.
          </p>
        </div>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATED_EVENT">Created Event</option>
          <option value="PUBLISHED_EVENT">Published Event</option>
          <option value="CREATED_NEWS">Created News</option>
          <option value="VERIFIED_ALUMNI">Verified Alumni</option>
          <option value="UPDATED_SETTINGS">Updated Settings</option>
          <option value="IMPORTED_ALUMNI_CSV">Imported CSV</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4">Action Triggered</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Context Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-college-navy">
                      {log.adminEmail}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {log.entityType || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs max-w-md">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limit={20}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  );
};
