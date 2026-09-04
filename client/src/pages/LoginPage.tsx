import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const from = (location.state as any)?.from?.pathname || '/user/dashboard';
      navigate(from);
    } else {
      setErrorMessage(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleDemo = async (role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'ALUMNI') => {
    setLoading(true);
    await demoLogin(role);
    setLoading(false);
    if (role === 'SUPER_ADMIN' || role === 'CONTENT_MANAGER') {
      navigate('/admin');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-md w-full space-y-6">
        {/* Top Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-college-navy text-college-gold flex items-center justify-center mx-auto shadow-md border-2 border-college-gold/30">
            <GraduationCap className="w-9 h-9 text-college-gold" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-college-navy font-display">
            Alumni & Admin Sign In
          </h2>
          <p className="text-xs text-slate-500">
            Government College (Autonomous), Rajahmundry
          </p>
        </div>

        {/* Demo Fast Login Switcher */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-college-gold" /> One-Click Quick Demo Login
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('SUPER_ADMIN')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-center transition-colors"
            >
              <span className="block text-[11px] font-bold">Super Admin</span>
              <span className="block text-[9px] text-amber-700">Full Access</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('CONTENT_MANAGER')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-center transition-colors"
            >
              <span className="block text-[11px] font-bold">Content Editor</span>
              <span className="block text-[9px] text-blue-700">Events & News</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('ALUMNI')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-center transition-colors"
            >
              <span className="block text-[11px] font-bold">Alumni Member</span>
              <span className="block text-[9px] text-slate-500">Class of '94</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@gcrjy.ac.in or personal email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setResetSent(false);
                  }}
                  className="text-xs text-college-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full font-bold shadow-md"
            >
              Sign In to Account
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an alumni account yet?{' '}
            <Link to="/register" className="font-bold text-college-blue-600 hover:underline">
              Join the Network
            </Link>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <Modal
            isOpen={forgotModalOpen}
            onClose={() => setForgotModalOpen(false)}
            title="Password Recovery"
            maxWidth="sm"
          >
            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Password Reset Link Sent</h4>
                <p className="text-xs text-slate-600">
                  If an account is associated with {resetEmail}, you will receive a secure password reset link.
                </p>
                <Button variant="primary" size="sm" onClick={() => setForgotModalOpen(false)} className="w-full">
                  Close
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSent(true);
                }}
                className="space-y-3 text-left"
              >
                <p className="text-xs text-slate-600">
                  Enter your registered alumni email address to receive password reset instructions.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setForgotModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Send Reset Link
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
