import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { SuccessStory } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Quote, ArrowRight, BookOpen, Award, Share2 } from 'lucide-react';

export const SuccessStoriesHome: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<SuccessStory | null>(null);
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const fetchStories = async () => {
    try {
      const res = await api.get('/stories?featured=true&limit=3');
      setStories(res.data.stories || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();

    const unsubscribe = subscribe('STORY_PUBLISHED', () => fetchStories());
    return () => unsubscribe();
  }, [subscribe]);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="fluid-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Quote className="w-3.5 h-3.5 text-emerald-700" /> Inspiring Legacies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-college-navy font-display tracking-tight">
              Alumni Success Stories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Chronicles of innovation, social impact, and leadership from Government College
              Rajahmundry alumni shaping communities across continents.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/stories')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shrink-0 self-start md:self-auto"
          >
            Read All Stories
          </Button>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">No success stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Alumni Avatar & Badge */}
                  <div className="flex items-center space-x-3.5 mb-5">
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
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        {story.alumniName}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="gold" size="sm">
                          Batch of {story.batch}
                        </Badge>
                        <span className="text-[11px] text-slate-500">{story.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-base font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors mb-3">
                    "{story.achievementTitle}"
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed mb-4">
                    {story.story}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {story.careerInfo ? story.careerInfo.split('|')[0] : 'Alumnus Story'}
                  </span>
                  <button
                    onClick={() => setActiveStory(story)}
                    className="text-xs font-bold text-college-blue-600 hover:text-college-blue-800 inline-flex items-center gap-1"
                  >
                    Read Story <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Reader Modal */}
        {activeStory && (
          <Modal
            isOpen={!!activeStory}
            onClose={() => setActiveStory(null)}
            title="Alumni Story Spotlight"
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
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                    {activeStory.story}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setActiveStory(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
};
