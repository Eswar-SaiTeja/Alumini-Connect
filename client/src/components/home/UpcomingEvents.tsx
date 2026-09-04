import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Event } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Video,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [registering, setRegistering] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { subscribe } = useSocket();
  const navigate = useNavigate();

  const fetchUpcomingEvents = async () => {
    try {
      const res = await api.get('/events?type=upcoming');
      setEvents(res.data.events?.slice(0, 3) || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();

    const unsubscribeCreated = subscribe('EVENT_CREATED', () => fetchUpcomingEvents());
    const unsubscribeUpdated = subscribe('EVENT_UPDATED', () => fetchUpcomingEvents());
    const unsubscribeReg = subscribe('EVENT_REGISTERED', () => fetchUpcomingEvents());

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeReg();
    };
  }, [subscribe]);

  const handleOpenRegister = (evt: Event) => {
    setSelectedEvent(evt);
    setSuccessTicket(null);
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

      setSuccessTicket(res.data.registration.ticketNumber);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      fetchUpcomingEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="fluid-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-college-blue-800 text-xs font-bold mb-3">
              <Calendar className="w-3.5 h-3.5 text-college-blue-700" /> Reunions & Conventions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-college-navy font-display tracking-tight">
              Upcoming Alumni Events
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Reconnect with old classmates, attend thought leadership webinars, and celebrate our
              annual conventions at the historic Rajahmundry campus.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/events')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold shrink-0 self-start md:self-auto"
          >
            All Events & Meets
          </Button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 text-base font-semibold">No upcoming events scheduled right now.</p>
            <p className="text-slate-400 text-xs mt-1">Check back soon or browse past event galleries.</p>
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
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between group"
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
                        <div className="w-full h-full bg-college-navy flex items-center justify-center text-white font-bold text-lg">
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

                      {/* Category Pill */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="gold" size="sm" className="shadow-sm">
                          {evt.category}
                        </Badge>
                      </div>

                      {evt.isOnline && (
                        <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-semibold backdrop-blur-sm">
                          <Video className="w-3 h-3" /> Online / Hybrid
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-3.5 text-left">
                      <h3 className="text-lg font-bold text-slate-900 font-display line-clamp-2 group-hover:text-college-navy transition-colors">
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

                      {/* Capacity Meter */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                          <span>
                            {evt.registeredCount || 0} registered
                          </span>
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

                  {/* Action Footer */}
                  <div className="p-6 pt-0">
                    {evt.isUserRegistered ? (
                      <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You are Registered
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleOpenRegister(evt)}
                        rightIcon={<Ticket className="w-4 h-4" />}
                        className="w-full font-bold shadow-sm"
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Registration Modal */}
        {registerModalOpen && selectedEvent && (
          <Modal
            isOpen={registerModalOpen}
            onClose={() => setRegisterModalOpen(false)}
            title={successTicket ? 'Registration Confirmed!' : `Register for ${selectedEvent.title}`}
            maxWidth="md"
          >
            {successTicket ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-display">
                  You're all set for the event!
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
                  <p className="text-xs text-slate-500 font-medium">Your Official Ticket Number</p>
                  <p className="text-lg font-mono font-bold text-college-navy tracking-wider">
                    {successTicket}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Event:</strong> {selectedEvent.title}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Date & Venue:</strong> {selectedEvent.eventDate} | {selectedEvent.venue}
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
                <div className="bg-college-navy-50 p-3.5 rounded-xl border border-college-navy-100">
                  <p className="text-xs font-bold text-college-navy">{selectedEvent.title}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    📅 {selectedEvent.eventDate} • ⏰ {selectedEvent.time}
                  </p>
                  <p className="text-[11px] text-slate-600">📍 {selectedEvent.venue}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
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
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
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
    </section>
  );
};
