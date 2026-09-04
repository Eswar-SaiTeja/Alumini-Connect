import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { SuccessStory } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Quote, Search, Award, BookOpen, Share2 } from 'lucide-react';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<SuccessStory | null>(null);
  const { subscribe } = useSocket();

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      const res = await api.get(`/stories?${params.toString()}`);
      setStories(res.data.stories || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [search]);

  useEffect(() => {
    const unsub = subscribe('STORY_PUBLISHED', () => fetchStories());
    return () => unsub();
  }, [subscribe, search]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <Quote className="w-3.5 h-3.5" /> Alumni Achievements
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-college-navy font-display">
                Alumni Success Stories
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Celebrating outstanding accomplishments, entrepreneurial milestones, and societal
                contributions by Government College Rajahmundry alumni.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search stories by alumni, department, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200" />
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <Quote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 font-display">No stories found</h3>
            <p className="text-xs text-slate-500">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-4">
                    {story.photoUrl ? (
                      <img
                        src={story.photoUrl}
                        alt={story.alumniName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-college-gold/30 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-college-navy text-white text-lg font-bold flex items-center justify-center">
                        {story.alumniName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {story.alumniName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="gold" size="sm">
                          Batch of {story.batch}
                        </Badge>
                        <span className="text-[11px] text-slate-500">{story.department}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors mb-2">
                    "{story.achievementTitle}"
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-serif mb-4">
                    {story.story}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {story.careerInfo ? story.careerInfo.split('|')[0] : 'Inspiring Alumnus'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveStory(story)}
                    className="font-bold text-xs"
                  >
                    Read Full Story
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {activeStory && (
          <Modal
            isOpen={!!activeStory}
            onClose={() => setActiveStory(null)}
            title="Alumni Success Spotlight"
            maxWidth="lg"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
                {activeStory.photoUrl ? (
                  <img
                    src={activeStory.photoUrl}
                    alt={activeStory.alumniName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-college-gold/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-college-navy text-white text-xl font-bold flex items-center justify-center">
                    {activeStory.alumniName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {activeStory.alumniName}
                  </h3>
                  <p className="text-xs text-college-navy font-semibold">
                    Class of {activeStory.batch} • Department of {activeStory.department}
                  </p>
                  {activeStory.careerInfo && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{activeStory.careerInfo}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {activeStory.achievementTitle}
                </h4>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                    {activeStory.story}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setActiveStory(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
