
import React, { useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { ArticleView } from './views/ArticleView';
import { LabView } from './views/LabView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { EditorView } from './views/EditorView';
import { UserProfileView } from './views/UserProfileView';
import { AuthView } from './views/AuthView';
import { GuidelinesView, FellowshipsView, SubmitResearchView } from './views/StaticViews';
import { AuthProvider } from './components/AuthProvider';
import { NotificationProvider } from './components/NotificationProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { api } from './services/api';
import { UserRole } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // Ignore scroll errors
    }
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    api.init();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <MemoryRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeView />} />
              <Route path="/auth" element={<AuthView />} />
              <Route path="/explore" element={<ExploreView />} />
              <Route path="/lab" element={<LabView />} />
              <Route path="/read/:slug" element={<ArticleView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/guidelines" element={<GuidelinesView />} />
              <Route path="/submit-research" element={<SubmitResearchView />} />
              <Route path="/fellowships" element={<FellowshipsView />} />
              <Route path="/profile/:userId" element={<UserProfileView />} />

              {/* Authenticated Routes */}
              <Route 
                path="/lab/new" 
                element={
                  <ProtectedRoute>
                    <EditorView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfileView />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes (Impenetrable) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminView />
                  </ProtectedRoute>
                } 
              />

              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </MemoryRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
