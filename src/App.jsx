import React from 'react';
import usePageMeta from './usePageMeta';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContextMenu from './components/ContextMenu';
import MagicCursor from './components/MagicCursor';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Community from './pages/Community';
import { NotificationProvider } from './context/NotificationContext';
import DraggableNotificationContainer from './components/DraggableNotificationContainer';

// No loading screen: every page shows at once. Anything that takes a moment to appear
// (like the globe) shows a translucent "building" placeholder in its own spot instead.
const PAGES = {
  '/': { title: 'ISU Student Community · By students, for students', description: 'ISU is a student community run entirely by students: help with paperwork, housing and studies, events every week and groups for every part of student life.' },
  '/community': { title: 'Community and groups · ISU Student Community', description: 'Join ISU groups for newcomers, housing, study circles, jobs, sports, food and more. Ask, offer and find something to do on the ISU board.' },
  '/about': { title: 'About ISU · A community made of the people it helps', description: 'ISU is run by students for students. What we believe, why we exist and how you can help build it.' },
  '/login': { title: 'Sign in · ISU Student Community', description: 'Sign in to your ISU account or create one.', noindex: true },
};

function AppContent() {
  const location = useLocation();
  const page = PAGES[location.pathname] || PAGES['/'];
  usePageMeta({ ...page, path: location.pathname === '/' ? '/' : location.pathname });

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
        </Routes>

        <ContextMenu />
        <MagicCursor />
        <DraggableNotificationContainer />
      </div>
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
