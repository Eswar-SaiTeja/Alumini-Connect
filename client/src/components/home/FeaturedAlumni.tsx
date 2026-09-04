import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { AlumniProfile } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Linkedin,
  ArrowRight,
  ExternalLink,
  Mail,
  Award,
} from 'lucide-react';
import { CardSkeleton } from '../common/Skeleton';

export const FeaturedAlumni: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/alumni/featured');
      setAlumni(res.data.alumni || []);
    } catch (error) {
      console.error('Failed to fetch featured alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();

    const unsubscribe = subscribe('ALUMNI_UPDATED', () => {
      fetchFeatured();
    });

    return () => unsubscribe();
  }, [subscribe]);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="fluid-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" /> Distinguished Luminaries
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-college-navy font-display tracking-tight">
              Featured Alumni Spotlight
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Meet our inspiring graduates making monumental contributions across industry,
              scientific research, public governance, and technology globally.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/directory')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shrink-0 self-start md:self-auto"
          >
            View Complete Directory
          </Button>
        </div>

        {/* Alumni Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : alumni.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">No featured alumni available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumni.map((alum) => (
              <div
                key={alum.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      {alum.profilePhoto ? (
                        <img
                          src={alum.profilePhoto}
                          alt={alum.fullName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-college-gold/30 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-college-navy-100 text-college-navy text-xl font-bold flex items-center justify-center border-2 border-college-navy-200">
                          {alum.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-college-gold text-white p-1 rounded-full shadow-sm" title="Featured Alumni">
                        <Award className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 font-display truncate group-hover:text-college-navy transition-colors">
                        {alum.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="primary" size="sm">
                          Batch '{alum.graduationYear.toString().slice(-2)}
                        </Badge>
                        <span className="text-[11px] text-slate-500 truncate">{alum.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Career & Location Info */}
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                    {alum.currentDesignation && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-college-gold-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800 line-clamp-2">
                          {alum.currentDesignation}
                          {alum.currentCompany ? ` at ${alum.currentCompany}` : ''}
                        </span>
                      </div>
                    )}

                    {(alum.city || alum.country) && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {[alum.city, alum.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio excerpt */}
                  {alum.bio && (
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                      {alum.bio}
                    </p>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAlumni(alum)}
                    className="w-full font-semibold text-xs"
                  >
                    Quick View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/directory/${alum.id}`)}
                    className="px-2.5"
                    title="Full Profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick View Profile Modal */}
        {selectedAlumni && (
          <Modal
            isOpen={!!selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            title="Alumni Profile Spotlight"
            maxWidth="md"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
                {selectedAlumni.profilePhoto ? (
                  <img
                    src={selectedAlumni.profilePhoto}
                    alt={selectedAlumni.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-college-gold/30 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-college-navy text-white text-2xl font-bold flex items-center justify-center">
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
                  <p className="text-xs text-slate-500 mt-0.5">
                    Department of {selectedAlumni.department}
                  </p>
                </div>
              </div>

              {selectedAlumni.currentDesignation && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Current Position</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedAlumni.currentDesignation}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {selectedAlumni.currentCompany}
                    {selectedAlumni.city ? ` • ${selectedAlumni.city}, ${selectedAlumni.country}` : ''}
                  </p>
                </div>
              )}

              {selectedAlumni.bio && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    About
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {selectedAlumni.bio}
                  </p>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    navigate(`/directory/${selectedAlumni.id}`);
                    setSelectedAlumni(null);
                  }}
                  className="w-full font-bold"
                >
                  View Full Career Profile & Connect
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
};
