import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { GalleryItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { subscribe } = useSocket();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'ALL') params.set('category', category);
      const res = await api.get(`/gallery?${params.toString()}`);
      setItems(res.data.gallery || []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [category]);

  useEffect(() => {
    const unsub = subscribe('GALLERY_UPDATED', () => fetchGallery());
    return () => unsub();
  }, [subscribe, category]);

  const categories = [
    { id: 'ALL', label: 'All Photos & Media' },
    { id: 'CAMPUS', label: 'Historic Campus & Labs' },
    { id: 'ALUMNI_MEETS', label: 'Grand Alumni Conventions' },
    { id: 'REUNIONS', label: 'Batch Reunions' },
    { id: 'ACHIEVEMENTS', label: 'Awards & Convocations' },
    { id: 'ACTIVITIES', label: 'Sports & Cultural Activities' },
  ];

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % items.length);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold mb-2">
                <ImageIcon className="w-3.5 h-3.5" /> Visual Heritage
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-college-navy font-display">
                Campus & Reunion Gallery
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Visual memories of our historic red-brick quadrangle, batch silver jubilees, annual
                conventions, and campus milestones.
              </p>
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

        {/* Gallery Masonry / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 font-display">No gallery items found</h3>
            <p className="text-xs text-slate-500">Check other categories or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold inline-flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4" /> Expand Fullscreen
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="gold" size="sm" className="shadow-sm">
                      {item.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 text-left">
                  <h3 className="text-sm font-bold text-slate-900 font-display line-clamp-1 group-hover:text-college-navy transition-colors">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && items[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full text-center space-y-4">
              <div className="max-h-[75vh] flex items-center justify-center">
                <img
                  src={items[lightboxIndex].imageUrl}
                  alt={items[lightboxIndex].title}
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                />
              </div>
              <div className="text-white space-y-1">
                <Badge variant="gold" size="sm">
                  {items[lightboxIndex].category.replace('_', ' ')}
                </Badge>
                <h3 className="text-lg font-bold font-display">{items[lightboxIndex].title}</h3>
                {items[lightboxIndex].caption && (
                  <p className="text-xs text-slate-300 max-w-xl mx-auto">
                    {items[lightboxIndex].caption}
                  </p>
                )}
                <span className="text-[11px] text-slate-500 block">
                  {lightboxIndex + 1} of {items.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
