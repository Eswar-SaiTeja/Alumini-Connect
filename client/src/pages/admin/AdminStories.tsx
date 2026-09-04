import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { SuccessStory } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Quote, Plus, Edit2, Trash2, Award, Star } from 'lucide-react';

export const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [alumniName, setAlumniName] = useState('');
  const [batch, setBatch] = useState('2000');
  const [department, setDepartment] = useState('Physics');
  const [achievementTitle, setAchievementTitle] = useState('');
  const [story, setStory] = useState('');
  const [careerInfo, setCareerInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  const { subscribe } = useSocket();

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stories');
      setStories(res.data.stories || []);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    const unsub = subscribe('*', () => fetchStories());
    return () => unsub();
  }, [subscribe]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setAlumniName('');
    setBatch('2000');
    setDepartment('Physics');
    setAchievementTitle('');
    setStory('');
    setCareerInfo('');
    setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');
    setIsFeatured(true);
    setIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: SuccessStory) => {
    setEditingId(s.id);
    setAlumniName(s.alumniName);
    setBatch(s.batch.toString());
    setDepartment(s.department);
    setAchievementTitle(s.achievementTitle);
    setStory(s.story);
    setCareerInfo(s.careerInfo || '');
    setPhotoUrl(s.photoUrl || '');
    setIsFeatured(s.isFeatured);
    setIsPublished(s.isPublished);
    setModalOpen(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        alumniName,
        batch: parseInt(batch, 10),
        department,
        achievementTitle,
        story,
        careerInfo,
        photoUrl,
        isFeatured,
        isPublished,
      };

      if (editingId) {
        await api.put(`/stories/${editingId}`, payload);
      } else {
        await api.post('/stories', payload);
      }

      setModalOpen(false);
      fetchStories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save story.');
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;
    try {
      await api.delete(`/stories/${id}`);
      fetchStories();
    } catch (error) {
      alert('Failed to delete story.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Success Stories CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase notable alumni achievements on the homepage spotlight.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs shadow-sm"
        >
          Add Success Story
        </Button>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Alumnus</th>
                <th className="py-3 px-4">Batch & Dept</th>
                <th className="py-3 px-4">Achievement Headline</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading stories...
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No stories created yet.
                  </td>
                </tr>
              ) : (
                stories.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      {s.photoUrl ? (
                        <img src={s.photoUrl} alt={s.alumniName} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-college-navy text-white font-bold flex items-center justify-center text-xs">
                          {s.alumniName.charAt(0)}
                        </div>
                      )}
                      <span>{s.alumniName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      Class of {s.batch} • {s.department}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {s.achievementTitle}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {s.isFeatured ? (
                        <span className="text-amber-600 font-bold inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Spotlight
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={s.isPublished ? 'success' : 'default'} size="sm">
                        {s.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-slate-600 hover:text-college-navy rounded-lg hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(s.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                        title="Delete"
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

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Success Story' : 'Create New Success Story'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveStory} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alumnus Name *
                </label>
                <input
                  type="text"
                  required
                  value={alumniName}
                  onChange={(e) => setAlumniName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Batch Year *
                </label>
                <input
                  type="number"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Achievement Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Leading the Frontier of Life-Saving Oncology Therapeutics"
                value={achievementTitle}
                onChange={(e) => setAchievementTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Career Highlights / Designation Line
                </label>
                <input
                  type="text"
                  placeholder="Senior VP, Dr. Reddy’s Laboratories | Ph.D. IISc"
                  value={careerInfo}
                  onChange={(e) => setCareerInfo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Narrative Story *
              </label>
              <textarea
                required
                rows={5}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none font-serif"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <span>Feature in Homepage Spotlight Carousel</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <span>Published</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                {editingId ? 'Save Changes' : 'Publish Story'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
