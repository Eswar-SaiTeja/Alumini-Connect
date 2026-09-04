import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Users, UserPlus, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from '../common/Button';

export const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-college-navy-900 via-college-navy to-college-navy-800 text-white relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-college-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="fluid-container text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-college-gold-300 text-xs font-bold backdrop-blur-md border border-white/20">
          <HeartHandshake className="w-4 h-4" /> Lifetime Bond with Government College Rajahmundry
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
          Stay Connected With Your Alma Mater
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Whether you graduated last year or five decades ago, your story is an integral thread in the
          tapestry of Government College (Autonomous), Rajahmundry. Reconnect with batchmates, mentor
          students, and participate in our upcoming 173rd Anniversary initiatives.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {!isAuthenticated ? (
            <>
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-lg text-college-navy-900"
              >
                Join Alumni Network
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/directory')}
                leftIcon={<Users className="w-4 h-4 text-white" />}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold"
              >
                Explore Alumni Directory
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/user/settings')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-lg text-college-navy-900"
              >
                Update Your Profile
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/directory')}
                leftIcon={<Users className="w-4 h-4 text-white" />}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold"
              >
                Find Fellow Batchmates
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
