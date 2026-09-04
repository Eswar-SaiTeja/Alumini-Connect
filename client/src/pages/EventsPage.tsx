import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Event } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Video,
  Ticket,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { subscribe } = useSocket();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Registration modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [registering, setRegistering] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', activeTab);
      if (category !== 'ALL') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get(`/events?${params.toString()}`);
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, category, search]);

  useEffect(() => {
    const unsub1 = subscribe('EVENT_CREATED', () => fetchEvents());
    const unsub2 = subscribe('EVENT_UPDATED', () => fetchEvents());
    const unsub3 = subscribe('EVENT_REGISTERED', () => fetchEvents());
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [subscribe, activeTab, category, search]);

  const handleOpenRegister = (evt: Event) => {
    setSelectedEvent(evt);
    setConfirmedTicket(null);
    if (user) {
      setGuestName(user.profile?.fullName || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.profile?.phone || '');
    }
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRegistering(true);
    try {
      const res = await api.post(`/events/${selectedEvent.id}/register`, {
        alumniName: guestName,
        alumniEmail: guestEmail,
        alumniPhone: guestPhone,
      });

      setConfirmedTicket(res.data.registration.ticketNumber);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your event registration?')) return;
    try {
      await api.post(`/events/${eventId}/cancel`);
      alert('Your registration has been cancelled.');
      fetchEvents();
      if (selectedEvent?.id === eventId) {
        setDetailModalOpen(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cancellation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 text-left">
      <div className="fluid-container space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-college-blue-800 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" /> Reunions & Masterclasses
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-college-navy font-display">
                Alumni Events & Conventions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Participate in batch reunions, annual conventions, career mentorship webinars, and
                campus heritage gatherings.
              </p>
            </div>

            {/* Upcoming / Past Tabs */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-college-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                  activeTab === 'past'
                    ? 'bg-college-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Gatherings
              </button>
            </div>
          </div>

          {/* Search & Category Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title, venue, or speaker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              >
                <option value="ALL">All Event Categories</option>
                <option value="REUNION">Batch Reunions</option>
                <option value="WEBINAR">Online Tech & Career Webinars</option>
                <option value="CAREER">Civil Services & Career Conclaves</option>
                <option value="CULTURAL">Cultural & Heritage Meets</option>
                <option value="SPORTS">Sports Days & Tournaments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 font-display">
              No events found matching your criteria
            </h3>
            <p className="text-xs text-slate-500">
              Try changing categories or check upcoming schedules.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt) => {
              const eventDateObj = new Date(evt.eventDate);
              const month = eventDateObj.toLocaleString('default', { month: 'short' });
              const day = eventDateObj.getDate();

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {evt.bannerImage ? (
                        <img
                          src={evt.bannerImage}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-college-navy flex items-center justify-center text-white font-bold text-sm">
                          GCRJY Event
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-white/80 text-center min-w-[55px]">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-college-gold-600">
                          {month}
                        </span>
                        <span className="block text-xl font-extrabold text-slate-900 leading-none">
                          {day}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <Badge variant="gold" size="sm">
                          {evt.category}
                        </Badge>
                      </div>

                      {evt.isOnline && (
                        <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-semibold backdrop-blur-sm">
                          <Video className="w-3 h-3" /> Online / Hybrid
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3 text-left">
                      <h3 className="text-base font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{evt.venue}</span>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                          <span>{evt.registeredCount || 0} registered</span>
                          <span>Cap: {evt.capacity}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-college-navy rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, ((evt.registeredCount || 0) / evt.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(evt);
                          setDetailModalOpen(true);
                        }}
                        className="w-1/2 font-bold text-xs"
                      >
                        Details
                      </Button>

                      {evt.isUserRegistered ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCancelRegistration(evt.id)}
                          className="w-1/2 font-bold text-xs text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100"
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenRegister(evt)}
                          className="w-1/2 font-bold text-xs shadow-sm"
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Event Modal */}
        {detailModalOpen && selectedEvent && (
          <Modal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            title="Event Overview"
            maxWidth="lg"
          >
            <div className="space-y-4 text-left">
              {selectedEvent.bannerImage && (
                <div className="rounded-2xl overflow-hidden h-52 bg-slate-100">
                  <img
                    src={selectedEvent.bannerImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm">
                  {selectedEvent.category}
                </Badge>
                {selectedEvent.isOnline && (
                  <Badge variant="secondary" size="sm">
                    Online / Hybrid
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-display">
                {selectedEvent.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-bold text-slate-800">
                    {selectedEvent.eventDate} • {selectedEvent.time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Venue / Platform</span>
                  <span className="font-bold text-slate-800">{selectedEvent.venue}</span>
                </div>
                {selectedEvent.speaker && (
                  <div>
                    <span className="text-slate-400 block font-medium">Keynote Speaker</span>
                    <span className="font-bold text-slate-800">{selectedEvent.speaker}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block font-medium">Organized By</span>
                  <span className="font-bold text-slate-800">{selectedEvent.organizer}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Agenda & Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 font-serif">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.onlineLink && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-blue-900">Virtual Access Link</span>
                  <a
                    href={selectedEvent.onlineLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-college-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Join Session <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                  Close
                </Button>
                {!selectedEvent.isUserRegistered && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenRegister(selectedEvent);
                    }}
                    className="font-bold"
                  >
                    Register for Event
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Registration Modal */}
        {registerModalOpen && selectedEvent && (
          <Modal
            isOpen={registerModalOpen}
            onClose={() => setRegisterModalOpen(false)}
            title={confirmedTicket ? 'Confirmed Ticket' : `Register: ${selectedEvent.title}`}
            maxWidth="md"
          >
            {confirmedTicket ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-display">
                  Registration Successful!
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <p className="text-slate-400 font-medium">Ticket Confirmation Number</p>
                  <p className="text-lg font-mono font-bold text-college-navy">
                    {confirmedTicket}
                  </p>
                  <p className="text-slate-600">
                    <strong>Event:</strong> {selectedEvent.title}
                  </p>
                  <p className="text-slate-600">
                    <strong>Date & Venue:</strong> {selectedEvent.eventDate} • {selectedEvent.venue}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setRegisterModalOpen(false)}
                  className="w-full font-bold"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                <div className="bg-college-navy-50 p-3.5 rounded-xl border border-college-navy-100 text-xs">
                  <p className="font-bold text-college-navy">{selectedEvent.title}</p>
                  <p className="text-slate-600 mt-1">
                    📅 {selectedEvent.eventDate} • ⏰ {selectedEvent.time}
                  </p>
                  <p className="text-slate-600">📍 {selectedEvent.venue}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attendee Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setRegisterModalOpen(false)}
                    className="w-1/2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={registering}
                    className="w-1/2 font-bold"
                  >
                    Confirm Registration
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};
