import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  GraduationCap,
  User,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [graduationYear, setGraduationYear] = useState('2024');
  const [department, setDepartment] = useState('Computer Science');
  const [degree, setDegree] = useState('B.Sc Computer Science');
  const [studentId, setStudentId] = useState('');

  const [currentCompany, setCurrentCompany] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [city, setCity] = useState('Rajahmundry');
  const [state, setState] = useState('Andhra Pradesh');
  const [country, setCountry] = useState('India');
  const [linkedIn, setLinkedIn] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  const departments = [
    'Computer Science',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Botany',
    'Zoology',
    'Commerce',
    'Economics',
    'History',
    'Telugu',
    'English',
  ];

  const degrees = [
    'B.Sc Computer Science',
    'B.Sc Physics',
    'B.Sc Chemistry',
    'B.Sc Mathematics',
    'B.Sc Botany',
    'B.Sc Zoology',
    'B.Com General',
    'B.Com Computers',
    'B.A. Economics',
    'B.A. History',
    'M.Sc Physics',
    'M.Sc Chemistry',
    'M.A. Telugu Literature',
    'M.A. English Literature',
  ];

  const industries = [
    'Information Technology',
    'Pharmaceuticals & Biotechnology',
    'Civil Services & Public Policy',
    'Investment Banking & Finance',
    'Higher Education & Research',
    'Healthcare & Medicine',
    'Aerospace & Space Technology',
    'Agriculture & Food Processing',
    'Law & Judiciary',
    'Other',
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (step === 1) {
      if (!fullName || !email || !graduationYear || !department || !degree) {
        setErrorMessage('Please fill in all mandatory academic fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName,
      email,
      phone,
      graduationYear: parseInt(graduationYear, 10),
      department,
      degree,
      studentId,
      currentCompany,
      currentDesignation,
      industry,
      city,
      state,
      country,
      linkedIn,
      password,
      bio,
      profilePhoto:
        profilePhoto ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    });

    setLoading(false);

    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/user/dashboard');
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-xl w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-college-navy text-college-gold flex items-center justify-center mx-auto shadow-md border-2 border-college-gold/30">
            <GraduationCap className="w-9 h-9 text-college-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-college-navy font-display">
            Join the GCRJY Alumni Network
          </h1>
          <p className="text-xs text-slate-500">
            Government College (Autonomous), Rajahmundry • Estd. 1853
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div
            className={`flex items-center gap-2 text-xs font-bold ${
              step >= 1 ? 'text-college-navy' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? 'bg-college-navy text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </span>
            <span>Academic Info</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 text-xs font-bold ${
              step >= 2 ? 'text-college-navy' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? 'bg-college-navy text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
            <span>Career Info</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 text-xs font-bold ${
              step >= 3 ? 'text-college-navy' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 3 ? 'bg-college-navy text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </span>
            <span>Security & Bio</span>
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

          {/* STEP 1: Academic & Personal Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Step 1: Academic & Contact Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Graduation Year *
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  >
                    {Array.from({ length: 60 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={y}>
                        Class of {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree *
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                  >
                    {degrees.map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Roll / Registration ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20CS104"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold shadow-md mt-4"
              >
                Continue to Career Details
              </Button>
            </form>
          )}

          {/* STEP 2: Career & Location Info */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Step 2: Professional & Location Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Company / Employer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft, AP State Govt, TCS"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Designation / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Industry / Domain
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-college-navy-500 focus:outline-none"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Andhra Pradesh"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn Profile URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-2/3 font-bold shadow-md"
                >
                  Continue to Security
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Security & Bio */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Step 3: Security, Bio & Profile Photo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Bio / Memories at GCRJY
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short summary of your background, favorite college memories, or areas where you can mentor students..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-college-navy-500 focus:outline-none bg-slate-50/50 font-serif"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
                🔒 <strong>Privacy Assurance:</strong> You can adjust visibility of your phone, email, and company inside your settings anytime.
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  isLoading={loading}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="w-2/3 font-bold shadow-md text-college-navy-900"
                >
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-college-blue-600 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
