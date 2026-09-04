import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { StatsCounter } from '../components/home/StatsCounter';
import { FeaturedAlumni } from '../components/home/FeaturedAlumni';
import { UpcomingEvents } from '../components/home/UpcomingEvents';
import { SuccessStoriesHome } from '../components/home/SuccessStoriesHome';
import { NewsAnnouncementsHome } from '../components/home/NewsAnnouncementsHome';
import { WorldMapSection } from '../components/home/WorldMapSection';
import { CtaSection } from '../components/home/CtaSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsCounter />
      <FeaturedAlumni />
      <UpcomingEvents />
      <SuccessStoriesHome />
      <NewsAnnouncementsHome />
      <WorldMapSection />
      <CtaSection />
    </div>
  );
};
