import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { NewsAnnouncement } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { BellRing, Calendar, Search, ArrowRight, User, Tag } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<NewsAnnouncement | null>(null);
  const { subscribe } = useSocket();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'ALL') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());
      const res = await api.get(`/news?${params.toString()}`);
      setNews(res.data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, search]);

  useEffect(() => {
    const unsub1 = subscribe('NEWS_PUBLISHED', () => fetchNews());
    const unsub2 = subscribe('NEWS_UPDATED', () => fetchNews());
    const unsub3 = subscribe('NEWS_DELETED', () => fetchNews());
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [subscribe, category, search]);

  const categories = [
    { id: 'ALL', label: 'All News & Updates' },
    { id: 'COLLEGE_NEWS', label: 'College Milestones' },
    { id: 'ALUMNI_NEWS', label: 'Alumni Network' },
    { id: 'ANNOUNCEMENT', label: 'Official Announcements' },
    { id: 'ACHIEVEMENT', label: 'Accreditation & Awards' },
    { id: 'CAREER', label: 'Mentorship & Placement' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold mb-2">
                <BellRing className="w-3.5 h-3.5" /> Official Communications
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-college-navy font-display">
                News & Announcements
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Stay updated with latest college circulars, alumni philanthropy, accreditation, and
                campus developments.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100 pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  category === c.id
                    ? 'bg-college-navy text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <BellRing className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 font-display">No articles found</h3>
            <p className="text-xs text-slate-500">Try changing the category or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {item.featuredImage && (
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
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

                    <h3 className="text-base font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.subtitle || item.content}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.author}</span>
                  <span className="text-college-blue-600 font-bold group-hover:underline inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {activeArticle && (
          <Modal
            isOpen={!!activeArticle}
            onClose={() => setActiveArticle(null)}
            title="Official Bulletin"
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
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {activeArticle.title}
                </h3>
                {activeArticle.subtitle && (
                  <p className="text-xs text-slate-500 mt-1 italic">{activeArticle.subtitle}</p>
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

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
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
    </div>
  );
};
