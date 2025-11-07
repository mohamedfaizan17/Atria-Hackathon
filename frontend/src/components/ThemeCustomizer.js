import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Palette, Sparkles, Sun, Moon, Zap, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const {
    theme,
    autoTimeTheme,
    toggleAutoTimeTheme,
    industry,
    changeIndustry,
    aiMode,
    toggleAiMode,
    getTimeBasedInfo,
    INDUSTRY_THEMES,
  } = useTheme();

  const [timeInfo, setTimeInfo] = useState(getTimeBasedInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeBasedInfo());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [getTimeBasedInfo]);

  const handleIndustryChange = (newIndustry) => {
    changeIndustry(newIndustry);
    toast.success(`Theme changed to ${INDUSTRY_THEMES[newIndustry].name}`);
  };

  const handleAutoTimeToggle = () => {
    toggleAutoTimeTheme();
    toast.success(autoTimeTheme ? 'Auto time theme disabled' : 'Auto time theme enabled');
  };

  const handleAiModeToggle = () => {
    toggleAiMode();
    toast.success(aiMode ? 'AI mode disabled' : 'AI mode enabled');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI Theme Customizer
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Personalize your experience with intelligent themes
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Time-Based Auto Theme */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Auto Time-Based Theme
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically switch between light and dark modes
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAutoTimeToggle}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      autoTimeTheme ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: autoTimeTheme ? 28 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>
                
                {/* Time Info */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {timeInfo.hour}:00
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current Time</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {timeInfo.timeOfDay}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Time of Day</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center flex flex-col items-center justify-center">
                    {timeInfo.isDaytime ? (
                      <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Moon className="w-6 h-6 text-indigo-500" />
                    )}
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {timeInfo.isDaytime ? 'Day Mode' : 'Night Mode'}
                    </div>
                  </div>
                </div>

                {autoTimeTheme && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                  >
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      Auto theme is active: Light mode (6 AM - 6 PM) • Dark mode (6 PM - 6 AM)
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Industry-Based Themes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Industry Themes
                    </h3>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {INDUSTRY_THEMES[industry].name}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(INDUSTRY_THEMES).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleIndustryChange(key)}
                      className={`relative card p-4 cursor-pointer transition-all ${
                        industry === key
                          ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:shadow-lg'
                      }`}
                    >
                      {industry === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      <div 
                        className={`w-full h-16 rounded-lg bg-gradient-to-r ${theme.gradient} mb-3 shadow-md`}
                      />
                      <h4 className="font-bold text-gray-900 dark:text-white text-center">
                        {theme.name}
                      </h4>
                      <div className="flex justify-center space-x-1 mt-2">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* AI Enhanced Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        AI-Enhanced Themes
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let AI generate personalized color schemes
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAiModeToggle}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      aiMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: aiMode ? 28 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>

                {aiMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <p className="text-sm text-purple-800 dark:text-purple-300 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        AI will enhance your selected theme with intelligent color suggestions
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-semibold mb-2">AI considers:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Current time of day</li>
                          <li>• Selected industry</li>
                          <li>• Color psychology</li>
                          <li>• Accessibility standards</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Changes are saved automatically
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn-primary"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeCustomizer;
