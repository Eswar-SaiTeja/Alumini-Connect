import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { User, Role, UserStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { Modal } from '../../components/common/Modal';
import {
  UserCheck,
  Search,
  ShieldCheck,
  Lock,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Password reset modal
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const { subscribe } = useSocket();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '15');
      if (role !== 'ALL') params.set('role', role);
      if (status !== 'ALL') params.set('status', status);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setTotalRecords(res.data.pagination.total || 0);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, role, status, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const unsub = subscribe('USER_STATUS_UPDATED', () => fetchUsers());
    return () => unsub();
  }, [subscribe, fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { status: newStatus });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleBulkAction = async (action: 'APPROVE' | 'SUSPEND' | 'DELETE') => {
    if (selectedUserIds.length === 0) return;
    if (!confirm(`Are you sure you want to perform ${action} on ${selectedUserIds.length} users?`)) return;

    try {
      await api.post('/admin/users/bulk', { userIds: selectedUserIds, action });
      setSelectedUserIds([]);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Bulk action failed.');
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || newPassword.length < 6) return;

    try {
      await api.put(`/admin/users/${resetModalUser.id}`, { password: newPassword });
      alert(`Password updated successfully for ${resetModalUser.email}`);
      setResetModalUser(null);
      setNewPassword('');
    } catch (error) {
      alert('Password reset failed.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            User Accounts & RBAC Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage administrative privileges, account approvals, suspensions, and authentication.
          </p>
        </div>

        {selectedUserIds.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 px-2">
              {selectedUserIds.length} Selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('APPROVE')}
              className="text-xs font-bold bg-white text-emerald-700"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('SUSPEND')}
              className="text-xs font-bold bg-white text-amber-700"
            >
              Suspend
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleBulkAction('DELETE')}
              className="text-xs font-bold"
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by email, name, or department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="CONTENT_MANAGER">Content Manager</option>
            <option value="ALUMNI">Alumni User</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved / Active</option>
            <option value="PENDING">Pending Approval</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-college-navy"
                  />
                </th>
                <th className="py-3 px-4">User Account</th>
                <th className="py-3 px-4">Role Assignment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No users found matching filter.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);

                  return (
                    <tr key={u.id} className={`hover:bg-slate-50 ${isSelected ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedUserIds(selectedUserIds.filter((id) => id !== u.id));
                            } else {
                              setSelectedUserIds([...selectedUserIds, u.id]);
                            }
                          }}
                          className="w-4 h-4 rounded text-college-navy"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{u.email}</span>
                        <span className="text-[10px] text-slate-500">
                          {u.profile?.fullName || 'No Profile Created'} • {u.profile?.department || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white text-college-navy"
                        >
                          <option value="SUPER_ADMIN">Super Admin</option>
                          <option value="ADMIN">Admin</option>
                          <option value="CONTENT_MANAGER">Content Manager</option>
                          <option value="ALUMNI">Alumni</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.status}
                          onChange={(e) => handleStatusChange(u.id, e.target.value as UserStatus)}
                          className={`px-2 py-1 rounded-lg border text-xs font-bold ${
                            u.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : u.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="APPROVED">Approved</option>
                          <option value="PENDING">Pending</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setResetModalUser(u)}
                          className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold inline-flex items-center gap-1"
                          title="Reset Password"
                        >
                          <Lock className="w-3 h-3" /> Password
                        </button>
                      </td>
                    </tr>
                  );
                })
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
            limit={15}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalUser && (
        <Modal
          isOpen={!!resetModalUser}
          onClose={() => setResetModalUser(null)}
          title={`Reset Password for ${resetModalUser.email}`}
          maxWidth="sm"
        >
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                New Temporary Password *
              </label>
              <input
                type="text"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setResetModalUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                Apply New Password
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
