import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlumniProfile } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Award,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

export const ProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/alumni/${id}`);
        setProfile(res.data.profile);
      } catch (error) {
        console.error('Failed to retrieve profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-college-navy" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 font-display">Alumni Profile Not Found</h2>
          <p className="text-xs text-slate-500">
            The profile you are looking for may have been removed or does not exist.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/directory')}>
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === profile.userId;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 text-left">
      <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/directory')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-college-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Alumni Directory
        </button>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          {/* Top Decorative Banner */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-college-navy-900 via-college-navy to-college-navy-800 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge variant="gold" size="md" className="backdrop-blur-md">
                Estd. 1853 Alumni
              </Badge>
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-8 relative">
            {/* Avatar & Main Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="relative">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={profile.fullName}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-elevated"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-college-navy text-white text-4xl font-bold flex items-center justify-center border-4 border-white shadow-elevated font-display">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                  {profile.isVerified && (
                    <div
                      className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md border-2 border-white"
                      title="Verified Alumnus"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                      {profile.fullName}
                    </h1>
                    {profile.isFeatured && (
                      <Badge variant="gold" size="sm">
                        <Award className="w-3 h-3 mr-1" /> Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-college-navy">
                    {profile.degree} • Class of {profile.graduationYear}
                  </p>
                  <p className="text-xs text-slate-500">
                    Department of {profile.department} • Government College (Autonomous), Rajahmundry
                  </p>
                </div>
              </div>

              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/user/settings')}
                  className="font-bold shrink-0 self-start sm:self-auto"
                >
                  Edit My Profile
                </Button>
              )}
            </div>

            {/* Quick Details Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              {profile.currentDesignation && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Briefcase className="w-4 h-4 text-college-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Role</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {profile.currentDesignation}
                    </span>
                    {profile.currentCompany && (
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {profile.currentCompany}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(profile.city || profile.country) && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-college-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Location</span>
                    <span className="text-xs font-bold text-slate-800">
                      {[profile.city, profile.country].filter(Boolean).join(', ')}
                    </span>
                    {profile.state && (
                      <span className="text-[11px] text-slate-500 block">{profile.state}</span>
                    )}
                  </div>
                </div>
              )}

              {profile.industry && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Industry</span>
                    <span className="text-xs font-bold text-slate-800">{profile.industry}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Profile Grid: Bio, Experience, Education vs Contact & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio, Work Experience, Education */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bio Section */}
            {profile.bio && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
                <h2 className="text-base font-bold text-slate-900 font-display">About & Bio</h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Work Experiences */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-college-navy" /> Professional Experience
              </h2>

              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-college-navy" />
                      <h3 className="text-sm font-bold text-slate-900 font-display">{exp.title}</h3>
                      <p className="text-xs font-semibold text-college-navy mt-0.5">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  {profile.currentDesignation
                    ? `${profile.currentDesignation} at ${profile.currentCompany || 'N/A'}`
                    : 'No additional work experiences documented.'}
                </p>
              )}
            </div>

            {/* Education History */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-college-navy" /> Academic Background
              </h2>

              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                {/* Government College Rajahmundry Graduation Record */}
                <div className="relative pl-6">
                  <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-college-gold-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Government College (Autonomous), Rajahmundry
                  </h3>
                  <p className="text-xs font-semibold text-college-navy mt-0.5">
                    {profile.degree} • Department of {profile.department}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Graduation Class of {profile.graduationYear}
                  </p>
                </div>

                {/* Additional Educations */}
                {profile.educations?.map((edu) => (
                  <div key={edu.id} className="relative pl-6">
                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      {edu.institution}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills, Contact & Social Handles */}
          <div className="lg:col-span-4 space-y-6">
            {/* Skills & Expertise */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill: any, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-college-navy-50 text-college-navy text-xs font-semibold border border-college-navy-100"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Social Links */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Contact & Connect
              </h3>

              <div className="space-y-3 text-xs">
                {profile.email ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="w-4 h-4 text-college-navy shrink-0" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-college-blue-700 hover:underline truncate font-medium"
                    >
                      {profile.email}
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-[11px]">
                    🔒 Email address protected by privacy settings.
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="w-4 h-4 text-college-navy shrink-0" />
                    <span className="text-slate-800 font-medium">{profile.phone}</span>
                  </div>
                )}

                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-800 hover:bg-blue-100 transition-colors font-semibold"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors font-semibold"
                  >
                    <Github className="w-4 h-4 text-slate-800 shrink-0" />
                    <span className="truncate">GitHub Profile</span>
                  </a>
                )}

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 transition-colors font-semibold"
                  >
                    <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate">Personal Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
