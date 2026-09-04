export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'ALUMNI';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type PrivacySetting = 'PUBLIC' | 'ALUMNI_ONLY' | 'PRIVATE';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  profile?: AlumniProfile;
  registrations?: EventRegistration[];
  notifications?: Notification[];
}

export interface WorkExperience {
  id: string;
  alumniId: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Education {
  id: string;
  alumniId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear: number;
  endYear?: number;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  fullName: string;
  graduationYear: number;
  department: string;
  degree: string;
  studentId?: string;
  currentCompany?: string;
  currentDesignation?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  profilePhoto?: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  email?: string; // Exposed if privacy permits
  emailPrivacy: PrivacySetting;
  phonePrivacy: PrivacySetting;
  companyPrivacy: PrivacySetting;
  isFeatured: boolean;
  isVerified: boolean;
  skills?: string[] | { id: string; name: string }[];
  experiences?: WorkExperience[];
  educations?: Education[];
  createdAt?: string;
  memberSince?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'REUNION' | 'WEBINAR' | 'WORKSHOP' | 'CAREER' | 'CULTURAL' | 'SPORTS';
  bannerImage?: string;
  eventDate: string;
  time: string;
  venue: string;
  isOnline: boolean;
  onlineLink?: string;
  speaker?: string;
  organizer: string;
  capacity: number;
  registrationDeadline?: string;
  isPublished: boolean;
  registeredCount?: number;
  isUserRegistered?: boolean;
  userRegistration?: EventRegistration;
  createdAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  alumniName: string;
  alumniEmail: string;
  alumniPhone?: string;
  ticketNumber: string;
  attendanceStatus: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
  createdAt: string;
  event?: Event;
  user?: User;
}

export interface NewsAnnouncement {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: 'COLLEGE_NEWS' | 'ALUMNI_NEWS' | 'ANNOUNCEMENT' | 'ACHIEVEMENT' | 'CAREER' | 'COMMUNITY';
  featuredImage?: string;
  author: string;
  tags?: string;
  isPublished: boolean;
  publishDate: string;
  createdAt?: string;
}

export interface SuccessStory {
  id: string;
  alumniName: string;
  batch: number;
  department: string;
  achievementTitle: string;
  story: string;
  careerInfo?: string;
  photoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'CAMPUS' | 'ALUMNI_MEETS' | 'EVENTS' | 'REUNIONS' | 'ACHIEVEMENTS' | 'ACTIVITIES';
  imageUrl: string;
  videoUrl?: string;
  caption?: string;
  isPublished: boolean;
  orderIndex: number;
  createdAt?: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'EVENT' | 'ANNOUNCEMENT' | 'ALUMNI' | 'SYSTEM' | 'MESSAGE';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  replyNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SiteSettings {
  college_name: string;
  college_short_name: string;
  college_estd: string;
  tagline: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
  stats_total_alumni?: string;
  stats_countries?: string;
  stats_chapters?: string;
  stats_companies?: string;
  [key: string]: string | undefined;
}

export interface RealtimeUpdatePayload {
  type: string;
  payload: any;
  timestamp: string;
}
