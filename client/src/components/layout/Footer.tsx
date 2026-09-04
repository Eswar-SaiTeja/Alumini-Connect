import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ShieldCheck,
  Heart,
  Globe,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-college-navy-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 py-10">
        <div className="fluid-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-college-navy text-college-gold flex items-center justify-center border-2 border-college-gold/30 shadow-lg">
              <GraduationCap className="w-8 h-8 text-college-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display tracking-tight">
                {settings.college_name || 'Government College (Autonomous), Rajahmundry'}
              </h3>
              <p className="text-xs text-college-gold-300 font-medium">
                {settings.hero_badge || 'Estd. 1853 • Autonomous • NAAC A++ (3.72 CGPA)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-college-gold hover:text-college-navy-900 text-slate-300 flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-college-gold hover:text-college-navy-900 text-slate-300 flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-college-gold hover:text-college-navy-900 text-slate-300 flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-college-gold hover:text-college-navy-900 text-slate-300 flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="fluid-container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: About & Legacy */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base font-display">173 Years of Legacy</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Founded in 1853, Government College (Autonomous), Rajahmundry is one of South India's
            oldest and most revered institutions of higher education, having nurtured global
            scientists, statesmen, educators, and leaders across three centuries.
          </p>
          <div className="pt-2">
            <Link
              to="/about"
              className="text-xs font-semibold text-college-gold hover:underline inline-flex items-center gap-1"
            >
              Learn about our history & constitution &rarr;
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base font-display">Explore Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/directory" className="hover:text-white transition-colors">
                Alumni Directory & Search
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-white transition-colors">
                Reunions & Global Events
              </Link>
            </li>
            <li>
              <Link to="/stories" className="hover:text-white transition-colors">
                Distinguished Success Stories
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-white transition-colors">
                College News & Announcements
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-white transition-colors">
                Campus & Reunion Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact Alumni Office
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Alumni Services */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base font-display">Alumni Services</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Register as an Alumni
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Alumni Portal Login
              </Link>
            </li>
            <li>
              <Link to="/user/dashboard" className="hover:text-white transition-colors">
                My Dashboard & Events
              </Link>
            </li>
            <li>
              <Link to="/user/settings" className="hover:text-white transition-colors">
                Privacy Controls & Settings
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors inline-flex items-center gap-1 text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Access
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base font-display">Alumni Relations Office</h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-college-gold shrink-0 mt-0.5" />
              <span>{settings.contact_address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-college-gold shrink-0" />
              <span>{settings.contact_phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-college-gold shrink-0" />
              <span>{settings.contact_email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="fluid-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} Government College (Autonomous), Rajahmundry. All
            Rights Reserved.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center gap-1">
              Built for <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> Godavari Alumni Community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
