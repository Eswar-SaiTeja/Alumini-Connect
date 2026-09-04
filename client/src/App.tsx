import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { EventsPage } from './pages/EventsPage';
import { StoriesPage } from './pages/StoriesPage';
import { NewsPage } from './pages/NewsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// User Portal Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { ProfileSettings } from './pages/user/ProfileSettings';

// Admin Portal Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAlumni } from './pages/admin/AdminAlumni';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminStories } from './pages/admin/AdminStories';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminImportExport } from './pages/admin/AdminImportExport';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Guards
const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-college-navy" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isContentManager, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-college-navy" />
      </div>
    );
  }

  if (!isAuthenticated || !isContentManager) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Layout Wrapper with Navbar & Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/directory"
          element={
            <PublicLayout>
              <DirectoryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/directory/:id"
          element={
            <PublicLayout>
              <ProfileDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/events"
          element={
            <PublicLayout>
              <EventsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/stories"
          element={
            <PublicLayout>
              <StoriesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/news"
          element={
            <PublicLayout>
              <NewsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <PublicLayout>
              <GalleryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        {/* User Portal Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedUserRoute>
              <PublicLayout>
                <UserDashboard />
              </PublicLayout>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/user/settings"
          element={
            <ProtectedUserRoute>
              <PublicLayout>
                <ProfileSettings />
              </PublicLayout>
            </ProtectedUserRoute>
          }
        />

        {/* Admin Portal Protected Suite */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="alumni" element={<AdminAlumni />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="stories" element={<AdminStories />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="import-export" element={<AdminImportExport />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
