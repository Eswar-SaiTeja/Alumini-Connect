import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  ArrowRight,
  Sparkles,
  Award,
  Globe2,
  Calendar,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  const { settings } = useSiteSettings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/80 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-200">
      {/* Subtle institutional decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-college-navy-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-college-gold-100/40 blur-3xl pointer-events-none" />

      <div className="fluid-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-college-navy-50 border border-college-navy-200 shadow-subtle text-college-navy-800 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-college-gold fill-college-gold" />
              <span>{settings.hero_badge || 'Estd. 1853 • Autonomous • NAAC A++ (3.72 CGPA)'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-college-navy font-display tracking-tight leading-[1.1]">
              Connecting Generations.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-college-gold-600 via-amber-600 to-amber-700">
                Inspiring Futures.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {settings.hero_subtitle ||
                'Welcome to the official alumni platform of Government College (Autonomous), Rajahmundry. Discover lifelong connections, mentor current students, explore global networks, and celebrate our shared 173-year legacy.'}
            </p>

            {/* Quick Directory Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-card border border-slate-200 flex flex-col sm:flex-row items-center gap-2 max-w-xl"
            >
              <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search alumni by name, company, batch, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none py-1"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto font-bold shrink-0">
                Find Alumni
              </Button>
            </form>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={() => navigate('/register')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold shadow-md hover:shadow-lg"
                  >
                    Join Alumni Network
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/directory')}
                    leftIcon={<Users className="w-4 h-4 text-college-navy" />}
                    className="font-semibold"
                  >
                    Explore Directory
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/user/dashboard')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold"
                  >
                    Go to My Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/directory')}
                    leftIcon={<Users className="w-4 h-4 text-college-navy" />}
                    className="font-semibold"
                  >
                    Browse 50,000+ Alumni
                  </Button>
                </>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-xl text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Global Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Live Sync</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Campus & Heritage Visual Card */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative rounded-3xl bg-white p-3 sm:p-4 shadow-elevated border border-slate-200 w-full">
              <div className="relative h-72 sm:h-96 md:h-[420px] lg:h-[440px] xl:h-[480px] rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200"
                  alt="Government College Rajahmundry Campus Quadrangle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-college-navy-900/90 via-college-navy-900/30 to-transparent" />

                {/* Floating Heritage Info Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-white/60">
                  <p className="text-[11px] font-bold text-college-navy">🏛️ Historic Campus</p>
                  <p className="text-[10px] text-slate-500">Rajamahendravaram, AP</p>
                </div>

                {/* Bottom Card Overlay Content */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white text-left space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-college-gold/90 text-college-navy-900 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" /> 173rd Year of Excellence
                  </div>
                  <h3 className="text-lg sm:text-xl xl:text-2xl font-bold font-display leading-tight">
                    Government College (Autonomous), Rajahmundry
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    Established in 1853 on the banks of River Godavari — nurturing visionaries,
                    scientists, civil servants, and leaders worldwide.
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Milestone Card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3.5 shadow-elevated border border-slate-200 flex items-center space-x-3 max-w-[260px] text-left hidden sm:flex">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg border border-amber-200">
                  1853
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Founding Heritage</h5>
                  <p className="text-[10px] text-slate-500">One of South India's oldest colleges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
