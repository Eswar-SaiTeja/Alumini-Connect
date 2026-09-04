import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { GalleryItem } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Image as ImageIcon, Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CAMPUS');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [orderIndex, setOrderIndex] = useState('0');

  const { subscribe } = useSocket();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      setItems(res.data.gallery || []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    const unsub = subscribe('*', () => fetchGallery());
    return () => unsub();
  }, [subscribe]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/gallery', {
        title,
        category,
        imageUrl,
        caption,
        orderIndex: parseInt(orderIndex, 10),
      });
      setModalOpen(false);
      setTitle('');
      setImageUrl('');
      setCaption('');
      fetchGallery();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload gallery item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (error) {
      alert('Failed to delete media.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Campus & Reunion Gallery CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage photo collections, batch reunion albums, and campus heritage photos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs shadow-sm"
        >
          Add Photo to Gallery
        </Button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-display">No gallery items uploaded</h3>
          <p className="text-xs text-slate-500">Click "Add Photo to Gallery" to publish your first album.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge variant="gold" size="sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 font-display line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">Order: #{item.orderIndex}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Photo to Gallery"
          maxWidth="md"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Photo Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Historic Main Quadrangle & Victorian Clock Tower"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="CAMPUS">Historic Campus & Labs</option>
                  <option value="ALUMNI_MEETS">Grand Alumni Conventions</option>
                  <option value="REUNIONS">Batch Reunions</option>
                  <option value="ACHIEVEMENTS">Awards & Convocations</option>
                  <option value="ACTIVITIES">Sports & Cultural Activities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Image Web URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Caption / Description
              </label>
              <textarea
                rows={3}
                placeholder="Add a historical note or event description..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                Upload to Gallery
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
