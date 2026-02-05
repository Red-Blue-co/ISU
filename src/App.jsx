import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContextMenu from './components/ContextMenu';
import MagicCursor from './components/MagicCursor';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import { LoaderProvider, useLoader } from './context/LoaderContext';

import Loader from './components/Loader';

function AppContent() {
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  const { showLoader, hideLoader } = useLoader();
  const location = useLocation();

  // Synchronous route change detection to prevent "flash of content"
  // This runs during the render phase and resets opacity BEFORE painting
  const [lastPath, setLastPath] = React.useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setLoadingComplete(false);
  }

  const isFirstLoad = React.useRef(true);

  // Handle Initial Startup and Navigation Loading (Side Effects)
  useEffect(() => {
    // If we are starting up (first time), show tech message
    const message = isFirstLoad.current ? 'INITIALIZING SYSTEM' : '';
    showLoader(message);

    const timer = setTimeout(() => {
      hideLoader();
      isFirstLoad.current = false;
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname, showLoader, hideLoader]);

  return (
    <>
      <Loader onFinish={() => setLoadingComplete(true)} />

      <div style={{
        opacity: loadingComplete ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
        height: '100vh',
        overflow: loadingComplete ? 'auto' : 'hidden'
      }}>
        <Navbar />
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>

          <ContextMenu />
          <MagicCursor />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
