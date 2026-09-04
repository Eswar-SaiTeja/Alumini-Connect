import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  GraduationCap,
  Award,
  History,
  Target,
  Users,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();

  const leadership = [
    {
      role: 'Chief Patron',
      name: 'Dr. R. Ramachandra Murthy, M.Sc., Ph.D.',
      title: 'Principal, Government College (Autonomous), Rajahmundry',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    },
    {
      role: 'President, Alumni Association',
      name: 'Sri S. N. Murthy, IAS (Retd.)',
      title: 'Former Principal Secretary, Govt of AP (Batch of 1982)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    },
    {
      role: 'Secretary & Dean of Alumni Affairs',
      name: 'Prof. K. Venkateswara Rao',
      title: 'Professor of Physics & Alumnus (Batch of 1988)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    {
      role: 'Vice President (Global Chapters)',
      name: 'Dr. Kavitha Reddy',
      title: 'Senior VP, Dr. Reddy’s Laboratories (Batch of 1999)',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const milestones = [
    { year: '1853', title: 'Founding as Zilla School', desc: 'Established as a provincial school on the banks of River Godavari by the Madras Presidency administration.' },
    { year: '1873', title: 'Elevation to Degree College', desc: 'Upgraded to a full-fledged arts and science degree college affiliated to the University of Madras.' },
    { year: '1971', title: 'Grant of Autonomy', desc: 'Conferred Autonomous status by the UGC and Government of Andhra Pradesh for academic freedom and curriculum excellence.' },
    { year: '2023', title: 'NAAC A++ Accreditation', desc: 'Awarded the highest national grade of A++ (3.72 CGPA) recognizing research, infrastructure, and alumni outcomes.' },
    { year: '2026', title: '173rd Anniversary & Digital Connect', desc: 'Launching the unified global alumni platform connecting 50,000+ graduates worldwide.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="fluid-container space-y-16 text-left">
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold">
              <History className="w-3.5 h-3.5" /> Institutional Heritage
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-college-navy font-display tracking-tight leading-tight">
              A Legacy of 173 Years on the Banks of River Godavari
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Government College (Autonomous), Rajahmundry is one of the premier institutions of
              higher learning in South India. Founded in 1853, the college has shaped generations of
              scholars, leaders, civil servants, and scientists who have played instrumental roles in
              building independent India and contributing to global progress.
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:flex items-center justify-center">
            <GraduationCap className="w-80 h-80 text-college-navy" />
          </div>
        </div>

        {/* Mission & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-college-navy-50 text-college-navy flex items-center justify-center border border-college-navy-200">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To foster lifelong connections between alumni and their alma mater, support current
              students through mentorship and scholarships, preserve the college's historic heritage,
              and mobilize global alumni resources for modern campus infrastructure and scientific research.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Facilitate global alumni networking and career collaboration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Award annual merit-cum-means scholarships to deserving students</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Upgrade laboratories, digital libraries, and smart seminar halls</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Association Objectives</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The Government College Rajahmundry Alumni Association operates under a registered
              charitable constitution governed by elected alumni representatives and college academic
              leadership.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Organize annual conventions and batch silver/golden jubilee reunions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Conduct career mentorship, UPSC guidance, and tech masterclasses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Maintain an active, verified, privacy-respecting alumni registry</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Historical Timeline */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold" size="md">Historic Journey</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-college-navy font-display">
              Milestones Across Three Centuries
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Key moments that defined our 173-year pursuit of educational excellence
            </p>
          </div>

          <div className="relative border-l-2 border-college-navy-200 ml-4 sm:ml-32 space-y-8 py-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-college-navy group-hover:scale-125 transition-transform" />
                <span className="sm:absolute sm:-left-28 sm:text-right font-display font-extrabold text-base text-college-gold-700 block mb-1 sm:mb-0">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display">{m.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Executive Committee */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary" size="md">Executive Council</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-college-navy font-display">
              Alumni Association Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dedicated stewards guiding the association’s global programs and campus initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card text-center space-y-3"
              >
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-college-gold/30 shadow-md"
                />
                <div>
                  <Badge variant="gold" size="sm" className="mb-1">
                    {leader.role}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-900 font-display mt-1">
                    {leader.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{leader.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
