import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Palette,
  Phone,
  Share2,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [collegeName, setCollegeName] = useState(settings.college_name || '');
  const [collegeShortName, setCollegeShortName] = useState(settings.college_short_name || '');
  const [collegeEstd, setCollegeEstd] = useState(settings.college_estd || '1853');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [heroBadge, setHeroBadge] = useState(settings.hero_badge || '');
  const [heroTitle, setHeroTitle] = useState(settings.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.hero_subtitle || '');

  const [contactEmail, setContactEmail] = useState(settings.contact_email || '');
  const [contactPhone, setContactPhone] = useState(settings.contact_phone || '');
  const [contactAddress, setContactAddress] = useState(settings.contact_address || '');

  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedin_url || '');
  const [twitterUrl, setTwitterUrl] = useState(settings.twitter_url || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtube_url || '');

  const [statsAlumni, setStatsAlumni] = useState(settings.stats_total_alumni || '52400');
  const [statsCountries, setStatsCountries] = useState(settings.stats_countries || '42');
  const [statsChapters, setStatsChapters] = useState(settings.stats_chapters || '18');

  useEffect(() => {
    setCollegeName(settings.college_name || '');
    setCollegeShortName(settings.college_short_name || '');
    setCollegeEstd(settings.college_estd || '1853');
    setTagline(settings.tagline || '');
    setHeroBadge(settings.hero_badge || '');
    setHeroTitle(settings.hero_title || '');
    setHeroSubtitle(settings.hero_subtitle || '');
    setContactEmail(settings.contact_email || '');
    setContactPhone(settings.contact_phone || '');
    setContactAddress(settings.contact_address || '');
    setFacebookUrl(settings.facebook_url || '');
    setLinkedinUrl(settings.linkedin_url || '');
    setTwitterUrl(settings.twitter_url || '');
    setYoutubeUrl(settings.youtube_url || '');
    setStatsAlumni(settings.stats_total_alumni || '52400');
    setStatsCountries(settings.stats_countries || '42');
    setStatsChapters(settings.stats_chapters || '18');
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const ok = await updateSettings({
      college_name: collegeName,
      college_short_name: collegeShortName,
      college_estd: collegeEstd,
      tagline,
      hero_badge: heroBadge,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      contact_address: contactAddress,
      facebook_url: facebookUrl,
      linkedin_url: linkedinUrl,
      twitter_url: twitterUrl,
      youtube_url: youtubeUrl,
      stats_total_alumni: statsAlumni,
      stats_countries: statsCountries,
      stats_chapters: statsChapters,
    });

    setLoading(false);
    if (ok) {
      setSuccess(true);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Site Branding & Institutional Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure website titles, official contact details, social channels, and dynamic counters.
          Changes broadcast in real-time across connected browsers.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Branding settings updated and broadcasted in real-time!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Institution Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Building className="w-5 h-5 text-college-navy" /> Institutional Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                College Official Name *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Short Name / Acronym
              </label>
              <input
                type="text"
                required
                value={collegeShortName}
                onChange={(e) => setCollegeShortName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Founding Year
              </label>
              <input
                type="text"
                value={collegeEstd}
                onChange={(e) => setCollegeEstd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Institutional Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Homepage Hero Section Customizer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-college-gold" /> Homepage Hero Customizer
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Top Badge Text (Accreditation / Autonomy)
            </label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Main Hero Subtitle
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none font-serif"
            />
          </div>
        </div>

        {/* Section 3: Official Contact Coordinates */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Phone className="w-5 h-5 text-college-navy" /> Official Contact Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Inquiries Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Office Phone / WhatsApp
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Campus Address (Appears in Footer & Contact page)
            </label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Share2 className="w-5 h-5 text-college-navy" /> Official Social Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                LinkedIn School URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Twitter / X Handle URL
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Dynamic Counter Overrides */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-college-navy" /> Live Metrics Overrides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Total Alumni Count Display
              </label>
              <input
                type="text"
                value={statsAlumni}
                onChange={(e) => setStatsAlumni(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Countries Worldwide
              </label>
              <input
                type="text"
                value={statsCountries}
                onChange={(e) => setStatsCountries(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alumni Chapters Active
              </label>
              <input
                type="text"
                value={statsChapters}
                onChange={(e) => setStatsChapters(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={loading}
          rightIcon={<Save className="w-5 h-5" />}
          className="font-bold shadow-lg text-college-navy-900 px-8"
        >
          Save & Broadcast All Settings
        </Button>
      </form>
    </div>
  );
};
