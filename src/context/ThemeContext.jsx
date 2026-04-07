import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  default: {
    name: 'Default (Black/White)',
    colors: {
      bg: '#000000',
      text: '#ffffff',
      primary: '#ffffff',
      secondary: '#1a1a1a',
      accent: '#333333',
    },
  },
  light: {
    name: 'Light',
    colors: {
      bg: '#ffffff',
      text: '#000000',
      primary: '#000000',
      secondary: '#f0f0f0',
      accent: '#e0e0e0',
    },
  },
  midnight: {
    name: 'Midnight',
    colors: {
      bg: '#0f172a',
      text: '#e2e8f0',
      primary: '#38bdf8',
      secondary: '#1e293b',
      accent: '#0ea5e9',
    },
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('isu-theme');
      return saved && THEMES[saved] ? THEMES[saved] : THEMES.default;
    } catch {
      return THEMES.default;
    }
  });

  const [customColors, setCustomColors] = useState(null);

  useEffect(() => {
    const colors = customColors || currentTheme.colors;
    const root = document.documentElement;

    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);

    // Dynamically generate and apply the Favicon SVG
    const svgIcon = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <rect width='100' height='100' rx='22' fill='${colors.bg}'/>
        <text y='68' x='50' font-size='43' font-weight='900' font-family='sans-serif' fill='${colors.primary}' text-anchor='middle'>ISU</text>
      </svg>
    `.replace(/#/g, '%23').replace(/\n/g, '').replace(/\s+/g, ' ').trim();

    const iconUri = `data:image/svg+xml,${svgIcon}`;
    let link = document.querySelector("link[rel~='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    link.href = iconUri;

  }, [currentTheme, customColors]);

  const applyTheme = (themeKey) => {
    setCustomColors(null);
    setCurrentTheme(THEMES[themeKey]);
    try {
      localStorage.setItem('isu-theme', themeKey);
    } catch {}
  };

  const applyCustomColor = (colorKey, value) => {
    setCustomColors((prev) => {
      const base = prev || currentTheme.colors;
      return { ...base, [colorKey]: value };
    });
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, customColors, applyTheme, applyCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
