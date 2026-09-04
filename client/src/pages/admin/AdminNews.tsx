import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { NewsAnnouncement } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { BellRing, Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';

export const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('COLLEGE_NEWS');
  const [featuredImage, setFeaturedImage] = useState('');
  const [author, setAuthor] = useState('College Administration');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const { subscribe } = useSocket();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news');
      setNews(res.data.news || []);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const unsub = subscribe('*', () => fetchNews());
    return () => unsub();
  }, [subscribe]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setContent('');
    setCategory('COLLEGE_NEWS');
    setFeaturedImage('');
    setAuthor('College Administration');
    setTags('College, Notice');
    setIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: NewsAnnouncement) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setContent(item.content);
    setCategory(item.category);
    setFeaturedImage(item.featuredImage || '');
    setAuthor(item.author);
    setTags(item.tags || '');
    setIsPublished(item.isPublished);
    setModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        subtitle,
        content,
        category,
        featuredImage,
        author,
        tags,
        isPublished,
      };

      if (editingId) {
        await api.put(`/news/${editingId}`, payload);
      } else {
        await api.post('/news', payload);
      }

      setModalOpen(false);
      fetchNews();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save announcement.');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      alert('Failed to delete news.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            News & Bulletins CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish college milestones, NAAC notices, alumni announcements, and career bulletins.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs shadow-sm"
        >
          Create Announcement
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Title & Subtitle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading articles...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No articles found.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 max-w-sm">
                      <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.subtitle}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.author}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(item.publishDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.isPublished ? 'success' : 'default'} size="sm">
                        {item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-college-navy rounded-lg hover:bg-slate-100"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Announcement' : 'Publish New Announcement'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveNews} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Subtitle / Lead Summary
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
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
                  <option value="COLLEGE_NEWS">College Milestones</option>
                  <option value="ALUMNI_NEWS">Alumni Network</option>
                  <option value="ANNOUNCEMENT">Official Announcement</option>
                  <option value="ACHIEVEMENT">Accreditation & Awards</option>
                  <option value="CAREER">Mentorship & Placement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Author Byline
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="NAAC, Heritage, Science"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Article Content *
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <span>Publish immediately to all live users (Real-time broadcast)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                {editingId ? 'Save Changes' : 'Publish Bulletin'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
