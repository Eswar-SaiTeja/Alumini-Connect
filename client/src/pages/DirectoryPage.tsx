import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { AlumniProfile } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { CardSkeleton } from '../components/common/Skeleton';
import { Modal } from '../components/common/Modal';
import {
  Search,
  Filter,
  Users,
  Briefcase,
  MapPin,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { subscribe } = useSocket();

  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'ALL');
  const [degree, setDegree] = useState(searchParams.get('degree') || 'ALL');
  const [industry, setIndustry] = useState(searchParams.get('industry') || 'ALL');
  const [batch, setBatch] = useState(searchParams.get('batch') || '');
  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'graduationYear_desc');

  // Filter option choices from backend
  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    degrees: string[];
    industries: string[];
    batches: number[];
  }>({
    departments: [],
    degrees: [],
    industries: [],
    batches: [],
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  // Fetch filter options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/alumni/filter-options');
        setFilterOptions(res.data);
      } catch (error) {
        // Fallback default options
        setFilterOptions({
          departments: [
            'Physics',
            'Chemistry',
            'Mathematics',
            'Botany',
            'Zoology',
            'Computer Science',
            'Commerce',
            'Economics',
            'History',
            'Telugu',
            'English',
          ],
          degrees: [
            'B.Sc Computer Science',
            'B.Sc Physics',
            'B.Sc Chemistry',
            'B.Sc Mathematics',
            'B.Sc Botany',
            'B.Sc Zoology',
            'B.Com General',
            'B.Com Computers',
            'B.A. Economics',
            'B.A. History',
            'M.A. Telugu Literature',
            'M.A. English Literature',
          ],
          industries: [
            'Information Technology',
            'Pharmaceuticals & Biotechnology',
            'Civil Services & Public Policy',
            'Investment Banking & Finance',
            'Higher Education & Research',
            'Healthcare & Medicine',
            'Aerospace & Space Technology',
            'Agriculture & Food Processing',
          ],
          batches: Array.from({ length: 50 }, (_, i) => 2024 - i),
        });
      }
    };
    fetchOptions();
  }, []);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '12');
      if (search.trim()) params.set('search', search.trim());
      if (department && department !== 'ALL') params.set('department', department);
      if (degree && degree !== 'ALL') params.set('degree', degree);
      if (industry && industry !== 'ALL') params.set('industry', industry);
      if (batch) params.set('batch', batch);
      if (company.trim()) params.set('company', company.trim());
      if (city.trim()) params.set('city', city.trim());
      if (sortBy) params.set('sortBy', sortBy);

      const res = await api.get(`/alumni?${params.toString()}`);
      setAlumni(res.data.alumni || []);
      setTotalRecords(res.data.pagination.total || 0);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch alumni directory:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, department, degree, industry, batch, company, city, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlumni();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchAlumni]);

  // Subscribe to real-time additions/updates
  useEffect(() => {
    const unsubscribeUpdated = subscribe('ALUMNI_UPDATED', () => fetchAlumni());
    const unsubscribeRegistered = subscribe('ALUMNI_REGISTERED', () => fetchAlumni());
    const unsubscribeVerified = subscribe('ALUMNI_VERIFIED', () => fetchAlumni());

    return () => {
      unsubscribeUpdated();
      unsubscribeRegistered();
      unsubscribeVerified();
    };
  }, [subscribe, fetchAlumni]);

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('ALL');
    setDegree('ALL');
    setIndustry('ALL');
    setBatch('');
    setCompany('');
    setCity('');
    setSortBy('graduationYear_desc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search ||
    department !== 'ALL' ||
    degree !== 'ALL' ||
    industry !== 'ALL' ||
    batch ||
    company ||
    city;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5" /> Official Member Registry
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-college-navy font-display">
                Alumni Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Discover, search, and connect with graduates across 173 years of Government College
                Rajahmundry history.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-500">
                {totalRecords} Alumni Found
              </span>
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-college-navy shadow-sm font-bold' : 'text-slate-500'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-college-navy shadow-sm font-bold' : 'text-slate-500'
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Sort Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 pt-6 border-t border-slate-100 items-center">
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alumni by name, current company, designation, city, skills..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              >
                <option value="graduationYear_desc">Sort: Batch (Newest First)</option>
                <option value="graduationYear_asc">Sort: Batch (Oldest First)</option>
                <option value="name_asc">Sort: Name (A to Z)</option>
                <option value="name_desc">Sort: Name (Z to A)</option>
                <option value="recently_joined">Sort: Recently Joined</option>
              </select>

              <Button
                variant="outline"
                size="md"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Directory Body: Sidebar Filters + Alumni Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Filter className="w-4 h-4 text-college-navy" /> Refine Directory
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                {filterOptions.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Graduation Batch Year */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Graduation Batch
              </label>
              <select
                value={batch}
                onChange={(e) => {
                  setBatch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              >
                <option value="">All Batches (1853 - 2026)</option>
                {filterOptions.batches.map((b) => (
                  <option key={b} value={b.toString()}>
                    Class of {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Industry / Domain
              </label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              >
                <option value="ALL">All Industries</option>
                {filterOptions.industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Microsoft, ISRO, Google"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            {/* City / Location Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, London, Rajahmundry"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Alumni Results Area */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : alumni.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 font-display">
                  No Alumni Records Match Your Filter
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search terms, removing filters, or clearing the batch selection.
                </p>
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumni.map((alum) => (
                  <div
                    key={alum.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start space-x-3.5 mb-4">
                        <div className="relative shrink-0">
                          {alum.profilePhoto ? (
                            <img
                              src={alum.profilePhoto}
                              alt={alum.fullName}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-college-navy text-white text-lg font-bold flex items-center justify-center">
                              {alum.fullName.charAt(0)}
                            </div>
                          )}
                          {alum.isFeatured && (
                            <div
                              className="absolute -bottom-1 -right-1 bg-college-gold text-white p-0.5 rounded-full shadow-sm"
                              title="Featured Luminary"
                            >
                              <Award className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 font-display truncate group-hover:text-college-navy transition-colors">
                            {alum.fullName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <Badge variant="primary" size="sm">
                              '{alum.graduationYear.toString().slice(-2)}
                            </Badge>
                            <span className="text-[11px] text-slate-500 truncate">
                              {alum.department}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Career / Designation */}
                      <div className="space-y-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                        {alum.currentDesignation && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-college-gold-600 shrink-0 mt-0.5" />
                            <span className="font-semibold text-slate-800 line-clamp-2">
                              {alum.currentDesignation}
                              {alum.currentCompany ? ` at ${alum.currentCompany}` : ''}
                            </span>
                          </div>
                        )}

                        {(alum.city || alum.country) && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {[alum.city, alum.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Skills Tags */}
                      {alum.skills && Array.isArray(alum.skills) && alum.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {alum.skills.slice(0, 3).map((skill: any, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {typeof skill === 'string' ? skill : skill.name}
                            </span>
                          ))}
                          {alum.skills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{alum.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAlumni(alum)}
                        className="w-full font-semibold text-xs"
                      >
                        Quick Card
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/directory/${alum.id}`)}
                        className="px-2.5"
                        title="View Full Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View Table */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Alumnus</th>
                        <th className="py-3.5 px-4">Batch & Degree</th>
                        <th className="py-3.5 px-4">Current Role & Organization</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {alumni.map((alum) => (
                        <tr key={alum.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              {alum.profilePhoto ? (
                                <img
                                  src={alum.profilePhoto}
                                  alt={alum.fullName}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-college-navy text-white font-bold flex items-center justify-center text-xs">
                                  {alum.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-900 block">{alum.fullName}</span>
                                <span className="text-[10px] text-slate-400">{alum.department}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-college-navy block">
                              Class of {alum.graduationYear}
                            </span>
                            <span className="text-[10px] text-slate-500">{alum.degree}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">
                              {alum.currentDesignation || '—'}
                            </span>
                            <span className="text-[10px] text-slate-500">{alum.currentCompany}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {[alum.city, alum.country].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/directory/${alum.id}`)}
                              className="font-bold text-xs"
                            >
                              Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              limit={12}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>

        {/* Quick View Profile Modal */}
        {selectedAlumni && (
          <Modal
            isOpen={!!selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            title="Alumni Quick Card"
            maxWidth="md"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
                {selectedAlumni.profilePhoto ? (
                  <img
                    src={selectedAlumni.profilePhoto}
                    alt={selectedAlumni.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-college-gold/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-college-navy text-white text-xl font-bold flex items-center justify-center">
                    {selectedAlumni.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">
                    {selectedAlumni.fullName}
                  </h4>
                  <p className="text-xs text-college-navy font-semibold">
                    {selectedAlumni.degree} • Class of {selectedAlumni.graduationYear}
                  </p>
                  <p className="text-xs text-slate-500">Department of {selectedAlumni.department}</p>
                </div>
              </div>

              {selectedAlumni.currentDesignation && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Position & Company</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedAlumni.currentDesignation}
                  </p>
                  <p className="text-xs text-slate-600">
                    {selectedAlumni.currentCompany}
                    {selectedAlumni.city ? ` • ${selectedAlumni.city}, ${selectedAlumni.country}` : ''}
                  </p>
                </div>
              )}

              {/* Privacy Contact Info */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-xs">
                <p className="font-bold text-college-navy">Contact & Social Information</p>
                {selectedAlumni.email ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-college-navy" />
                    <span>{selectedAlumni.email}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    🔒 Email privacy set to Alumni-Only or Private.
                  </p>
                )}
                {selectedAlumni.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-college-navy" />
                    <span>{selectedAlumni.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    navigate(`/directory/${selectedAlumni.id}`);
                    setSelectedAlumni(null);
                  }}
                  className="w-full font-bold"
                >
                  View Full Career History & Education
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
