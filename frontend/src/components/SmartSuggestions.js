import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, X, RefreshCw, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const SmartSuggestions = ({ 
  type = 'skills', // 'skills' or 'achievements'
  jobRole,
  experienceLevel,
  industry,
  context,
  onSelect,
  selectedItems = [],
  maxSelections = 10
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (jobRole && showSuggestions) {
      fetchSuggestions();
    }
  }, [jobRole, experienceLevel, industry, type, showSuggestions]);

  const fetchSuggestions = async () => {
    if (!jobRole) {
      toast.error('Please specify a job role first');
      return;
    }

    setLoading(true);
    try {
      const endpoint = type === 'skills' ? '/suggestions/skills' : '/suggestions/achievements';
      const response = await api.post(endpoint, {
        jobRole,
        experienceLevel,
        industry,
        context
      });

      setSuggestions(response.data[type] || []);
      setSource(response.data.source);
      
      if (response.data.source === 'ai') {
        toast.success('AI-powered suggestions loaded!');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      // Remove if already selected
      onSelect(selectedItems.filter(i => i !== item));
      toast.success('Removed');
    } else {
      // Add if not selected
      if (selectedItems.length >= maxSelections) {
        toast.error(`Maximum ${maxSelections} items can be selected`);
        return;
      }
      onSelect([...selectedItems, item]);
      toast.success('Added!');
    }
  };

  const handleSelectAll = () => {
    const unselectedItems = suggestions.filter(item => !selectedItems.includes(item));
    const itemsToAdd = unselectedItems.slice(0, maxSelections - selectedItems.length);
    onSelect([...selectedItems, ...itemsToAdd]);
    toast.success(`Added ${itemsToAdd.length} items`);
  };

  const isSelected = (item) => selectedItems.includes(item);

  if (!showSuggestions) {
    return (
      <button
        onClick={() => setShowSuggestions(true)}
        className="btn-outline w-full flex items-center justify-center space-x-2 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Get AI Suggestions</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Smart Suggestions
          </h3>
          {source === 'ai' && (
            <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
              AI-Powered
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowSuggestions(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Hide suggestions"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Generating smart suggestions...
          </p>
        </div>
      )}

      {/* Suggestions */}
      {!loading && suggestions.length > 0 && (
        <>
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>{suggestions.length} suggestions found</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{selectedItems.length}/{maxSelections} selected</span>
            </div>
          </div>

          {/* Select All Button */}
          {selectedItems.length < maxSelections && (
            <button
              onClick={handleSelectAll}
              className="btn-outline w-full text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add All Suggestions
            </button>
          )}

          {/* Suggestions Grid */}
          <div className={`grid gap-2 ${type === 'skills' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {suggestions.map((item, index) => {
                const selected = isSelected(item);
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(item)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selected
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-sm ${
                        selected
                          ? 'text-primary-900 dark:text-primary-100 font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item}
                      </span>
                      {selected && (
                        <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    {type === 'achievements' && !selected && (
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>Click to add</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Pro Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                  {type === 'skills' ? (
                    <>
                      <li>Select skills you genuinely possess</li>
                      <li>Mix technical and soft skills</li>
                      <li>Include industry-specific skills</li>
                    </>
                  ) : (
                    <>
                      <li>Replace "X" with actual numbers</li>
                      <li>Customize achievements to your experience</li>
                      <li>Focus on measurable results</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* No Suggestions */}
      {!loading && suggestions.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No suggestions available yet
          </p>
          <button onClick={fetchSuggestions} className="btn-primary">
            Generate Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
