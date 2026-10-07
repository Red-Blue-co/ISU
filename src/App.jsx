import React from 'react';
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
function AppContent() {
  const location = useLocation();

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
