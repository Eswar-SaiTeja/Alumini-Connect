import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { NewsAnnouncement } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { BellRing, Calendar, ArrowRight, Sparkles, User, Tag } from 'lucide-react';

export const NewsAnnouncementsHome: React.FC = () => {
  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsAnnouncement[] | null>(null);
  const [activeArticle, setActiveArticle] = useState<NewsAnnouncement | null>(null);
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      const res = await api.get('/news?limit=4');
      setNews(res.data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const unsubscribeCreated = subscribe('NEWS_PUBLISHED', () => fetchNews());
    const unsubscribeUpdated = subscribe('NEWS_UPDATED', () => fetchNews());
    const unsubscribeDeleted = subscribe('NEWS_DELETED', () => fetchNews());

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [subscribe]);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="fluid-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold mb-3">
              <BellRing className="w-3.5 h-3.5 text-college-navy" /> Live Bulletins & Updates
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-college-navy font-display tracking-tight">
              News & Campus Announcements
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Stay up to date with official college milestones, accreditation announcements, alumni
              initiatives, and career drives.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/news')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shrink-0 self-start md:self-auto"
          >
            All News & Bulletins
          </Button>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ) : news.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">No announcements published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer group text-left"
              >
                <div>
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="primary" size="sm">
                      {item.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(item.publishDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {item.subtitle || item.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate">{item.author}</span>
                  <span className="text-xs font-bold text-college-blue-600 group-hover:underline inline-flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Reader Modal */}
        {activeArticle && (
          <Modal
            isOpen={!!activeArticle}
            onClose={() => setActiveArticle(null)}
            title="College Announcement"
            maxWidth="lg"
          >
            <div className="space-y-4 text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary" size="sm">
                    {activeArticle.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Published on {new Date(activeArticle.publishDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display leading-snug">
                  {activeArticle.title}
                </h3>
                {activeArticle.subtitle && (
                  <p className="text-xs font-medium text-slate-500 mt-1 italic">
                    {activeArticle.subtitle}
                  </p>
                )}
              </div>

              {activeArticle.featuredImage && (
                <div className="rounded-2xl overflow-hidden max-h-64 bg-slate-100">
                  <img
                    src={activeArticle.featuredImage}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                  {activeArticle.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>By: {activeArticle.author}</span>
                <Button variant="primary" size="sm" onClick={() => setActiveArticle(null)}>
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
