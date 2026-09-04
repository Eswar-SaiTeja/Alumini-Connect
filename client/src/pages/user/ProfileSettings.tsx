import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User,
  Lock,
  Shield,
  Briefcase,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileSettings: React.FC = () => {
  const { user, refreshUser, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'privacy' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile fields
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [currentCompany, setCurrentCompany] = useState(user?.profile?.currentCompany || '');
  const [currentDesignation, setCurrentDesignation] = useState(user?.profile?.currentDesignation || '');
  const [industry, setIndustry] = useState(user?.profile?.industry || 'Information Technology');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [state, setState] = useState(user?.profile?.state || '');
  const [country, setCountry] = useState(user?.profile?.country || 'India');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile?.profilePhoto || '');
  const [linkedIn, setLinkedIn] = useState(user?.profile?.linkedIn || '');
  const [github, setGithub] = useState(user?.profile?.github || '');
  const [website, setWebsite] = useState(user?.profile?.website || '');
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(user?.profile?.skills)
      ? user.profile.skills.map((s: any) => (typeof s === 'string' ? s : s.name)).join(', ')
      : ''
  );

  // Privacy fields
  const [emailPrivacy, setEmailPrivacy] = useState(user?.profile?.emailPrivacy || 'ALUMNI_ONLY');
  const [phonePrivacy, setPhonePrivacy] = useState(user?.profile?.phonePrivacy || 'PRIVATE');
  const [companyPrivacy, setCompanyPrivacy] = useState(user?.profile?.companyPrivacy || 'PUBLIC');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Work experience form
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setFullName(user.profile.fullName);
      setPhone(user.profile.phone || '');
      setCurrentCompany(user.profile.currentCompany || '');
      setCurrentDesignation(user.profile.currentDesignation || '');
      setIndustry(user.profile.industry || 'Information Technology');
      setCity(user.profile.city || '');
      setState(user.profile.state || '');
      setCountry(user.profile.country || 'India');
      setBio(user.profile.bio || '');
      setProfilePhoto(user.profile.profilePhoto || '');
      setLinkedIn(user.profile.linkedIn || '');
      setGithub(user.profile.github || '');
      setWebsite(user.profile.website || '');
      setEmailPrivacy(user.profile.emailPrivacy || 'ALUMNI_ONLY');
      setPhonePrivacy(user.profile.phonePrivacy || 'PRIVATE');
      setCompanyPrivacy(user.profile.companyPrivacy || 'PUBLIC');
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const ok = await updateProfile({
      fullName,
      phone,
      currentCompany,
      currentDesignation,
      industry,
      city,
      state,
      country,
      bio,
      profilePhoto,
      linkedIn,
      github,
      website,
      emailPrivacy: emailPrivacy as any,
      phonePrivacy: phonePrivacy as any,
      companyPrivacy: companyPrivacy as any,
      skills: skillsArray as any,
    });

    setLoading(false);
    if (ok) {
      setSuccessMessage('Profile and privacy settings updated successfully!');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      refreshUser();
    } else {
      setErrorMessage('Failed to update profile settings.');
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expCompany || !expStart) return;

    setLoading(true);
    try {
      await api.post('/auth/experience', {
        title: expTitle,
        company: expCompany,
        location: expLocation,
        startDate: expStart,
        endDate: expEnd,
        isCurrent: expCurrent,
        description: expDesc,
      });
      setSuccessMessage('Work experience added successfully!');
      setExpTitle('');
      setExpCompany('');
      setExpLocation('');
      setExpStart('');
      setExpEnd('');
      setExpDesc('');
      refreshUser();
    } catch (error) {
      setErrorMessage('Failed to add experience.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await api.delete(`/auth/experience/${id}`);
      refreshUser();
    } catch (error) {
      alert('Failed to delete experience.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccessMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-college-navy font-display">
            Profile & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, privacy visibility preferences, career timeline, and security.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100 pb-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-college-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <User className="w-4 h-4" /> Personal & Career
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'experience'
                  ? 'bg-college-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Work Experience
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-college-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" /> Privacy Controls
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-college-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" /> Security & Password
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Personal & Career Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <h2 className="text-base font-bold text-slate-900 font-display">
              General Profile Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Company / Employer
                </label>
                <input
                  type="text"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Designation / Role
                </label>
                <input
                  type="text"
                  value={currentDesignation}
                  onChange={(e) => setCurrentDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Skills & Expertise (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems, Public Policy, Chemistry, Financial Risk"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                About & Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Personal Website
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<Save className="w-4 h-4" />}
              className="font-bold shadow-md"
            >
              Save Profile Changes
            </Button>
          </form>
        )}

        {/* Tab 2: Work Experiences */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* List Existing */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Your Recorded Work Experiences
              </h2>

              {user?.profile?.experiences && user.profile.experiences.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {user.profile.experiences.map((exp) => (
                    <div key={exp.id} className="py-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                        <p className="text-xs font-semibold text-college-navy">
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No work experiences added yet.</p>
              )}
            </div>

            {/* Add New Form */}
            <form onSubmit={handleAddExperience} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Plus className="w-4 h-4 text-college-navy" /> Add Work Experience
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Architect"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    required
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    disabled={expCurrent}
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCurrent"
                  checked={expCurrent}
                  onChange={(e) => setExpCurrent(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <label htmlFor="expCurrent" className="text-xs font-semibold text-slate-700">
                  I currently work in this role
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Responsibilities / Projects
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize key projects or contributions..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="font-bold"
              >
                Add Experience
              </Button>
            </form>
          </div>
        )}

        {/* Tab 3: Privacy Controls */}
        {activeTab === 'privacy' && (
          <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Granular Privacy Controls
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Control which alumni and public members can view your direct contact coordinates.
            </p>

            <div className="space-y-4">
              {/* Email Privacy */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Address Visibility</h4>
                  <p className="text-xs text-slate-500">
                    Controls whether non-logged-in visitors or only verified alumni can view your email.
                  </p>
                </div>
                <select
                  value={emailPrivacy}
                  onChange={(e) => setEmailPrivacy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="PUBLIC">Public (Visible to All)</option>
                  <option value="ALUMNI_ONLY">Alumni Only (Logged-in members)</option>
                  <option value="PRIVATE">Private (Only Admins & Me)</option>
                </select>
              </div>

              {/* Phone Privacy */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Phone Number Visibility</h4>
                  <p className="text-xs text-slate-500">
                    Keep your direct mobile number private or share with verified alumni.
                  </p>
                </div>
                <select
                  value={phonePrivacy}
                  onChange={(e) => setPhonePrivacy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="PUBLIC">Public (Visible to All)</option>
                  <option value="ALUMNI_ONLY">Alumni Only (Logged-in members)</option>
                  <option value="PRIVATE">Private (Only Admins & Me)</option>
                </select>
              </div>

              {/* Company & Designation Privacy */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Company & Role Visibility</h4>
                  <p className="text-xs text-slate-500">
                    Show or hide current employer in directory cards.
                  </p>
                </div>
                <select
                  value={companyPrivacy}
                  onChange={(e) => setCompanyPrivacy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="ALUMNI_ONLY">Alumni Only</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="font-bold shadow-sm"
            >
              Save Privacy Preferences
            </Button>
          </form>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-4 max-w-lg">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Change Account Password
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="font-bold shadow-sm"
            >
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
