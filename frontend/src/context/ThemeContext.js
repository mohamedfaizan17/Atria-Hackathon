import React, { createContext, useState, useContext, useEffect } from 'react';
import { aiAPI } from '../utils/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  const [aiMode, setAiMode] = useState(() => {
    const saved = localStorage.getItem('aiMode');
    return saved === 'true';
  });

  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('customTheme');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (customTheme) {
      applyCustomTheme(customTheme);
      localStorage.setItem('customTheme', JSON.stringify(customTheme));
    }
  }, [customTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAiMode = async () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    localStorage.setItem('aiMode', newAiMode);

    if (newAiMode) {
      await generateAITheme();
    } else {
      setCustomTheme(null);
      localStorage.removeItem('customTheme');
      removeCustomTheme();
    }
  };

  const generateAITheme = async () => {
    try {
      const hour = new Date().getHours();
      const response = await aiAPI.themeRecommendation({
        time: new Date().toISOString(),
        industry: 'technology',
        mood: 'professional'
      });

      if (response.data.success) {
        const aiTheme = response.data.data;
        setCustomTheme(aiTheme);
        setTheme(aiTheme.mode);
      }
    } catch (error) {
      console.error('Failed to generate AI theme:', error);
    }
  };

  const applyCustomTheme = (themeData) => {
    const root = window.document.documentElement;
    
    if (themeData.primary) {
      root.style.setProperty('--color-primary', themeData.primary);
    }
    if (themeData.secondary) {
      root.style.setProperty('--color-secondary', themeData.secondary);
    }
    if (themeData.accent) {
      root.style.setProperty('--color-accent', themeData.accent);
    }
  };

  const removeCustomTheme = () => {
    const root = window.document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-accent');
  };

  const value = {
    theme,
    toggleTheme,
    aiMode,
    toggleAiMode,
    customTheme,
    setCustomTheme,
    generateAITheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
