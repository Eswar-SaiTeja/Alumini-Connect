import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { AlumniProfile } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Filter,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const AdminAlumni: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [batch, setBatch] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBatch, setFormBatch] = useState('2024');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formDegree, setFormDegree] = useState('B.Sc Computer Science');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formVerified, setFormVerified] = useState(true);

  const { subscribe } = useSocket();

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '15');
      if (search.trim()) params.set('search', search.trim());
      if (department !== 'ALL') params.set('department', department);
      if (batch) params.set('batch', batch);

      const res = await api.get(`/alumni?${params.toString()}`);
      setAlumni(res.data.alumni || []);
      setTotalRecords(res.data.pagination.total || 0);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Failed to load alumni:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, department, batch]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    const unsub1 = subscribe('ALUMNI_REGISTERED', () => fetchAlumni());
    const unsub2 = subscribe('ALUMNI_UPDATED', () => fetchAlumni());
    const unsub3 = subscribe('ALUMNI_VERIFIED', () => fetchAlumni());
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [subscribe, fetchAlumni]);

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await api.patch(`/admin/alumni/${id}/verify`, { isVerified });
      fetchAlumni();
    } catch (error) {
      alert('Verification update failed.');
    }
  };

  const handleExportCSV = async () => {
    window.open('/api/admin/alumni/export-csv', '_blank');
  };

  const handleCreateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        fullName: formName,
        email: formEmail,
        phone: formPhone,
        graduationYear: parseInt(formBatch, 10),
        department: formDept,
        degree: formDegree,
        currentCompany: formCompany,
        currentDesignation: formRole,
        city: formCity,
        password: 'AlumniPassword@2026',
      });
      setAddModalOpen(false);
      fetchAlumni();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create alumni.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Alumni Directory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {totalRecords} registered alumni records in database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="font-bold text-xs"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold text-xs shadow-sm"
          >
            Add New Alumni
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, designation, email..."
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
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Botany">Botany</option>
            <option value="Zoology">Zoology</option>
            <option value="Commerce">Commerce</option>
            <option value="Economics">Economics</option>
            <option value="History">History</option>
            <option value="Telugu">Telugu</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={batch}
            onChange={(e) => {
              setBatch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="">All Batches</option>
            {Array.from({ length: 50 }, (_, i) => 2026 - i).map((y) => (
              <option key={y} value={y}>
                Class of {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Alumnus Name</th>
                <th className="py-3 px-4">Batch & Degree</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : alumni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No alumni records found.
                  </td>
                </tr>
              ) : (
                alumni.map((alum) => (
                  <tr key={alum.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {alum.profilePhoto ? (
                          <img
                            src={alum.profilePhoto}
                            alt={alum.fullName}
                            className="w-8 h-8 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-college-navy text-white font-bold flex items-center justify-center text-xs">
                            {alum.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{alum.fullName}</span>
                          <span className="text-[10px] text-slate-400">{alum.email || 'Private'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-college-navy block">Class of {alum.graduationYear}</span>
                      <span className="text-[10px] text-slate-500">{alum.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {alum.currentDesignation || '—'}
                      </span>
                      <span className="text-[10px] text-slate-500">{alum.currentCompany}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {[alum.city, alum.country].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={alum.isVerified ? 'success' : 'warning'} size="sm">
                        {alum.isVerified ? 'VERIFIED' : 'PENDING'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(alum.id, !alum.isVerified)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          alum.isVerified
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {alum.isVerified ? 'Unverify' : 'Verify'}
                      </button>
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
            limit={15}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Add Alumni Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add New Alumni Record"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateAlumni} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Batch Year *
                </label>
                <input
                  type="number"
                  required
                  value={formBatch}
                  onChange={(e) => setFormBatch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  required
                  value={formDegree}
                  onChange={(e) => setFormDegree(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Company
                </label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Role / Designation
                </label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                Create Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
