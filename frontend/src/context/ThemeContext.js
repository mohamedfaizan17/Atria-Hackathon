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

// Industry color schemes
const INDUSTRY_THEMES = {
  healthcare: {
    name: 'Healthcare',
    primary: '#0ea5e9', // Sky Blue
    secondary: '#06b6d4', // Cyan
    accent: '#22c55e',
    gradient: 'from-sky-500 to-cyan-500'
  },
  tech: {
    name: 'Technology',
    primary: '#8b5cf6', // Purple
    secondary: '#a855f7',
    accent: '#ec4899',
    gradient: 'from-purple-500 to-pink-500'
  },
  creative: {
    name: 'Creative',
    primary: '#ec4899', // Pink
    secondary: '#f472b6',
    accent: '#fbbf24',
    gradient: 'from-pink-500 to-yellow-500'
  },
  finance: {
    name: 'Finance',
    primary: '#10b981', // Emerald
    secondary: '#059669',
    accent: '#3b82f6',
    gradient: 'from-emerald-500 to-blue-500'
  },
  education: {
    name: 'Education',
    primary: '#f59e0b', // Amber
    secondary: '#f97316',
    accent: '#ef4444',
    gradient: 'from-amber-500 to-red-500'
  },
  default: {
    name: 'Default',
    primary: '#2563eb', // Blue
    secondary: '#9333ea', // Purple
    accent: '#06b6d4',
    gradient: 'from-blue-500 to-purple-500'
  }
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

  const [autoTimeTheme, setAutoTimeTheme] = useState(() => {
    const saved = localStorage.getItem('autoTimeTheme');
    return saved === 'true' || false;
  });

  const [industry, setIndustry] = useState(() => {
    const saved = localStorage.getItem('industry');
    return saved || 'default';
  });

  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('customTheme');
    return saved ? JSON.parse(saved) : null;
  });

  // Auto time-based theme switching
  useEffect(() => {
    if (!autoTimeTheme) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      // 6 AM to 6 PM = Light mode, 6 PM to 6 AM = Dark mode
      const shouldBeDark = hour < 6 || hour >= 18;
      const newTheme = shouldBeDark ? 'dark' : 'light';
      
      if (theme !== newTheme) {
        setTheme(newTheme);
      }
    };

    checkTime(); // Check immediately
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [autoTimeTheme, theme]);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply industry-based theme
  useEffect(() => {
    const industryTheme = INDUSTRY_THEMES[industry];
    if (industryTheme) {
      applyIndustryTheme(industryTheme);
      localStorage.setItem('industry', industry);
    }
  }, [industry]);

  // Apply custom AI theme
  useEffect(() => {
    if (customTheme) {
      applyCustomTheme(customTheme);
      localStorage.setItem('customTheme', JSON.stringify(customTheme));
    }
  }, [customTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    // Disable auto time theme when manually toggling
    if (autoTimeTheme) {
      setAutoTimeTheme(false);
      localStorage.setItem('autoTimeTheme', 'false');
    }
  };

  const toggleAutoTimeTheme = () => {
    const newValue = !autoTimeTheme;
    setAutoTimeTheme(newValue);
    localStorage.setItem('autoTimeTheme', String(newValue));
    
    if (newValue) {
      // Apply time-based theme immediately
      const hour = new Date().getHours();
      const shouldBeDark = hour < 6 || hour >= 18;
      setTheme(shouldBeDark ? 'dark' : 'light');
    }
  };

  const changeIndustry = (newIndustry) => {
    setIndustry(newIndustry);
    if (aiMode) {
      generateAITheme(newIndustry);
    }
  };

  const toggleAiMode = async () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    localStorage.setItem('aiMode', newAiMode);

    if (newAiMode) {
      await generateAITheme(industry);
    } else {
      setCustomTheme(null);
      localStorage.removeItem('customTheme');
      removeCustomTheme();
    }
  };

  const generateAITheme = async (selectedIndustry = industry) => {
    try {
      const hour = new Date().getHours();
      const timeOfDay = hour >= 6 && hour < 12 ? 'morning' : 
                       hour >= 12 && hour < 18 ? 'afternoon' : 
                       hour >= 18 && hour < 22 ? 'evening' : 'night';
      
      const response = await aiAPI.themeRecommendation({
        time: new Date().toISOString(),
        timeOfDay,
        industry: selectedIndustry,
        mood: 'professional',
        currentTheme: theme
      });

      if (response.data.success) {
        const aiTheme = response.data.data;
        setCustomTheme(aiTheme);
        if (aiTheme.mode) {
          setTheme(aiTheme.mode);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI theme:', error);
      // Fallback to industry theme
      const industryTheme = INDUSTRY_THEMES[selectedIndustry];
      if (industryTheme) {
        applyIndustryTheme(industryTheme);
      }
    }
  };

  const applyIndustryTheme = (industryTheme) => {
    const root = window.document.documentElement;
    
    // Apply CSS custom properties for industry theme
    root.style.setProperty('--color-primary', industryTheme.primary);
    root.style.setProperty('--color-secondary', industryTheme.secondary);
    root.style.setProperty('--color-accent', industryTheme.accent);
    
    // Store gradient for use in components
    root.setAttribute('data-gradient', industryTheme.gradient);
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
    if (themeData.gradient) {
      root.setAttribute('data-gradient', themeData.gradient);
    }
  };

  const removeCustomTheme = () => {
    const root = window.document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-accent');
    root.removeAttribute('data-gradient');
  };

  const getTimeBasedInfo = () => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    const timeOfDay = hour >= 6 && hour < 12 ? 'morning' : 
                     hour >= 12 && hour < 18 ? 'afternoon' : 
                     hour >= 18 && hour < 22 ? 'evening' : 'night';
    return { isDaytime, timeOfDay, hour };
  };

  const value = {
    theme,
    toggleTheme,
    aiMode,
    toggleAiMode,
    autoTimeTheme,
    toggleAutoTimeTheme,
    industry,
    changeIndustry,
    customTheme,
    setCustomTheme,
    generateAITheme,
    getTimeBasedInfo,
    INDUSTRY_THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
