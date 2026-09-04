import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { ContactMessage } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Mail, Trash2, CheckCircle2, MessageSquare, Clock, Phone } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyNotes, setReplyNotes] = useState('');

  const { subscribe } = useSocket();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contact?status=${status}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [status]);

  useEffect(() => {
    const unsub = subscribe('NEW_CONTACT_MESSAGE', () => fetchMessages());
    return () => unsub();
  }, [subscribe, status]);

  const handleOpenDetail = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setReplyNotes(msg.replyNotes || '');
    if (msg.status === 'NEW') {
      try {
        await api.patch(`/contact/${msg.id}/status`, { status: 'READ' });
        fetchMessages();
      } catch (error) {
        // Ignore
      }
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedMsg) return;
    try {
      await api.patch(`/contact/${selectedMsg.id}/status`, {
        status: newStatus,
        replyNotes,
      });
      setSelectedMsg(null);
      fetchMessages();
    } catch (error) {
      alert('Failed to update inquiry status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchMessages();
    } catch (error) {
      alert('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Contact & Alumni Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Incoming communications sent from the public website contact desk.
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">New (Unread)</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sender Name</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No inquiries in this folder.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50 cursor-pointer ${
                      m.status === 'NEW' ? 'bg-blue-50/40 font-semibold' : ''
                    }`}
                    onClick={() => handleOpenDetail(m)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{m.name}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-slate-900 truncate block font-medium">{m.subject}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{m.message}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <span>{m.email}</span>
                      {m.phone && <span className="block text-[10px]">{m.phone}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          m.status === 'NEW'
                            ? 'warning'
                            : m.status === 'REPLIED'
                            ? 'success'
                            : 'default'
                        }
                        size="sm"
                      >
                        {m.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(m.id)}
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

      {/* Detail Modal */}
      {selectedMsg && (
        <Modal
          isOpen={!!selectedMsg}
          onClose={() => setSelectedMsg(null)}
          title="Inquiry Details"
          maxWidth="lg"
        >
          <div className="space-y-4 text-left">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 text-sm">{selectedMsg.name}</span>
                <span className="text-slate-400">
                  {new Date(selectedMsg.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-slate-600">
                <span>Email: </span>
                <a href={`mailto:${selectedMsg.email}`} className="text-college-blue-600 font-bold hover:underline">
                  {selectedMsg.email}
                </a>
                {selectedMsg.phone && <span> • Phone: {selectedMsg.phone}</span>}
              </div>
              <div>
                <span className="font-bold text-slate-800">Subject: {selectedMsg.subject}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Message Content
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                {selectedMsg.message}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Internal Administrative Resolution Notes
              </label>
              <textarea
                rows={3}
                placeholder="Log internal notes or action taken..."
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus('REPLIED')}
                  className="font-bold text-xs text-emerald-700 bg-emerald-50"
                >
                  Mark as Replied
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus('ARCHIVED')}
                  className="font-bold text-xs"
                >
                  Archive
                </Button>
              </div>

              <Button variant="primary" size="sm" onClick={() => setSelectedMsg(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
