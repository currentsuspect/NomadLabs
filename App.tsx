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
import { ComingSoonView } from './views/ComingSoonView';
import { AuthProvider } from './components/AuthProvider';
import { NotificationProvider } from './components/NotificationProvider';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // Ignore scroll errors in strict sandboxed environments
    }
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MemoryRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/explore" element={<ExploreView />} />
              <Route path="/lab" element={<LabView />} />
              <Route path="/lab/new" element={<EditorView />} />
              <Route path="/read/:slug" element={<ArticleView />} />
              <Route path="/admin" element={<AdminView />} />
              <Route path="/about" element={<AboutView />} />
              
              {/* Placeholder Routes */}
              <Route path="/guidelines" element={<ComingSoonView />} />
              <Route path="/submit-research" element={<ComingSoonView />} />
              <Route path="/fellowships" element={<ComingSoonView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </MemoryRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;