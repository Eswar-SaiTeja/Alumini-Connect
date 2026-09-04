import React, { useEffect, useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import { Users, Globe2, Building2, Calendar, Award, BookOpen, Layers } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const { settings } = useSiteSettings();
  const { subscribe } = useSocket();
  const [liveStats, setLiveStats] = useState({
    registeredAlumni: 16,
    totalEvents: 4,
    totalStories: 4,
    totalNews: 4,
  });

  const fetchLiveMetrics = async () => {
    try {
      const res = await api.get('/alumni?limit=1');
      if (res.data.pagination) {
        setLiveStats((prev) => ({
          ...prev,
          registeredAlumni: res.data.pagination.total,
        }));
      }
    } catch (error) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchLiveMetrics();

    // Subscribe to real-time events to update counts live
    const unsubscribeAlumni = subscribe('ALUMNI_REGISTERED', () => {
      setLiveStats((prev) => ({ ...prev, registeredAlumni: prev.registeredAlumni + 1 }));
    });
    const unsubscribeEvent = subscribe('EVENT_CREATED', () => {
      setLiveStats((prev) => ({ ...prev, totalEvents: prev.totalEvents + 1 }));
    });
    const unsubscribeStory = subscribe('STORY_PUBLISHED', () => {
      setLiveStats((prev) => ({ ...prev, totalStories: prev.totalStories + 1 }));
    });

    return () => {
      unsubscribeAlumni();
      unsubscribeEvent();
      unsubscribeStory();
    };
  }, [subscribe]);

  const statItems = [
    {
      label: 'Total Alumni Network',
      value: settings.stats_total_alumni || '52,400+',
      icon: Users,
      color: 'text-college-navy bg-college-navy-50 border-college-navy-200',
    },
    {
      label: 'Countries Worldwide',
      value: settings.stats_countries || '42',
      icon: Globe2,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      label: 'Alumni Chapters',
      value: settings.stats_chapters || '18',
      icon: Layers,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      label: 'Companies Represented',
      value: settings.stats_companies || '3,800+',
      icon: Building2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Alumni Events',
      value: `${liveStats.totalEvents}+`,
      icon: Calendar,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      label: 'Years of Legacy',
      value: '173',
      icon: Award,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-14 border-b border-slate-200">
      <div className="fluid-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-card group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 border shadow-sm transition-transform group-hover:scale-110 ${item.color}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 leading-snug">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
