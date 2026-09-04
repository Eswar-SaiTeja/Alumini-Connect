import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from './SocketContext';
import { SiteSettings } from '../types';

const defaultSettings: SiteSettings = {
  college_name: 'Government College (Autonomous), Rajahmundry',
  college_short_name: 'GCRJY',
  college_estd: '1853',
  tagline: 'Connecting Generations. Inspiring Futures.',
  hero_badge: 'Estd. 1853 • Autonomous • NAAC A++ (3.72 CGPA)',
  hero_title: 'Connecting Generations. Inspiring Futures.',
  hero_subtitle:
    'Welcome to the official alumni platform of Government College (Autonomous), Rajahmundry. Discover lifelong connections, mentor current students, explore global networks, and celebrate our shared 173-year legacy.',
  primary_color: '#0a2540',
  secondary_color: '#c89116',
  accent_color: '#1e40af',
  contact_email: 'alumni@gcrjy.ac.in',
  contact_phone: '+91 (0883) 2475456',
  contact_address:
    'Government College (Autonomous), Katheru Road, Rajamahendravaram (Rajahmundry), East Godavari Dist, Andhra Pradesh - 533105, India',
  facebook_url: 'https://facebook.com/gcrjyalumni',
  linkedin_url: 'https://linkedin.com/school/government-college-rajahmundry',
  twitter_url: 'https://twitter.com/gcrjy_alumni',
  youtube_url: 'https://youtube.com/gcrjyofficial',
  stats_total_alumni: '52400',
  stats_countries: '42',
  stats_chapters: '18',
  stats_companies: '3800',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const { subscribe } = useSocket();

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
        }));
      }
    } catch (error) {
      console.warn('Using default site settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to real-time settings change
    const unsubscribe = subscribe('SETTINGS_CHANGED', (payload) => {
      console.log('⚡ Applying real-time settings update:', payload);
      setSettings((prev) => ({
        ...prev,
        ...payload,
      }));
    });

    return () => unsubscribe();
  }, [subscribe]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      await api.put('/settings', { settings: newSettings });
      setSettings((prev) => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error('Failed to update site settings:', error);
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
