import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { Event, EventRegistration } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Users,
  Download,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'REUNION' | 'WEBINAR' | 'CAREER' | 'CULTURAL' | 'SPORTS'>('REUNION');
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [onlineLink, setOnlineLink] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [capacity, setCapacity] = useState('200');
  const [bannerImage, setBannerImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Registrations inspection modal
  const [regModalEvent, setRegModalEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  const { subscribe } = useSocket();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?type=all');
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const unsub = subscribe('*', () => fetchEvents());
    return () => unsub();
  }, [subscribe]);

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setCategory('REUNION');
    setEventDate('2026-11-14');
    setTime('09:30 AM - 05:00 PM IST');
    setVenue('Government College (Autonomous), Rajahmundry');
    setIsOnline(false);
    setOnlineLink('');
    setSpeaker('');
    setCapacity('250');
    setBannerImage('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000');
    setIsPublished(true);
    setEventModalOpen(true);
  };

  const handleOpenEdit = (evt: Event) => {
    setEditingEventId(evt.id);
    setTitle(evt.title);
    setDescription(evt.description);
    setCategory(evt.category as any);
    setEventDate(evt.eventDate);
    setTime(evt.time);
    setVenue(evt.venue);
    setIsOnline(evt.isOnline);
    setOnlineLink(evt.onlineLink || '');
    setSpeaker(evt.speaker || '');
    setCapacity(evt.capacity.toString());
    setBannerImage(evt.bannerImage || '');
    setIsPublished(evt.isPublished);
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        category,
        eventDate,
        time,
        venue,
        isOnline,
        onlineLink,
        speaker,
        capacity: parseInt(capacity, 10),
        bannerImage,
        isPublished,
      };

      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, payload);
      } else {
        await api.post('/events', payload);
      }

      setEventModalOpen(false);
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save event.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? All attendee registrations will also be removed.')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      alert('Failed to delete event.');
    }
  };

  const handleInspectRegistrations = async (evt: Event) => {
    setRegModalEvent(evt);
    setRegLoading(true);
    try {
      const res = await api.get(`/events/${evt.id}/registrations`);
      setRegistrations(res.data.registrations || []);
    } catch (error) {
      alert('Failed to fetch registrations.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleAttendanceChange = async (regId: string, status: string) => {
    try {
      await api.patch(`/events/registrations/${regId}/attendance`, { attendanceStatus: status });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, attendanceStatus: status as any } : r))
      );
    } catch (error) {
      alert('Failed to update attendance.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Events & Reunions CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, and publish reunions, webinars, and export registered participant rosters.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs shadow-sm"
        >
          Create New Event
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No events created yet.
                  </td>
                </tr>
              ) : (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{evt.title}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{evt.venue}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="gold" size="sm">
                        {evt.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{evt.eventDate}</span>
                      <span className="text-[10px] text-slate-500">{evt.time}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleInspectRegistrations(evt)}
                        className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs inline-flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {evt.registeredCount || 0} / {evt.capacity}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={evt.isPublished ? 'success' : 'default'} size="sm">
                        {evt.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 text-slate-600 hover:text-college-navy rounded-lg hover:bg-slate-100"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                        title="Delete Event"
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
      {eventModalOpen && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          title={editingEventId ? 'Edit Event' : 'Create New Event'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEvent} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
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
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="REUNION">Batch Reunion</option>
                  <option value="WEBINAR">Tech / Career Webinar</option>
                  <option value="CAREER">Civil Services Masterclass</option>
                  <option value="CULTURAL">Cultural & Heritage</option>
                  <option value="SPORTS">Sports Championship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Date (YYYY-MM-DD) *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Time *
                </label>
                <input
                  type="text"
                  required
                  placeholder="09:30 AM - 05:00 PM IST"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keynote Speaker(s)
                </label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description & Agenda *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none font-serif"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <span>Publish immediately to live public site</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="w-4 h-4 text-college-navy rounded"
                />
                <span>Online / Hybrid Webinar</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEventModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                {editingEventId ? 'Save Changes' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Registrations Inspection Modal */}
      {regModalEvent && (
        <Modal
          isOpen={!!regModalEvent}
          onClose={() => setRegModalEvent(null)}
          title={`Attendees for ${regModalEvent.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Total Registrations: {registrations.length}
              </span>
              <a
                href={`/api/events/${regModalEvent.id}/export-csv`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-college-navy inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Attendee CSV
              </a>
            </div>

            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Ticket #</th>
                    <th className="py-2.5 px-3">Attendee</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No registrations yet.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-college-navy">
                          {r.ticketNumber}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{r.alumniName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{r.alumniEmail}</td>
                        <td className="py-2.5 px-3">
                          <select
                            value={r.attendanceStatus}
                            onChange={(e) => handleAttendanceChange(r.id, e.target.value)}
                            className="px-2 py-0.5 rounded border border-slate-300 text-[11px] font-bold"
                          >
                            <option value="REGISTERED">REGISTERED</option>
                            <option value="ATTENDED">ATTENDED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
