import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/api';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState(() => storage.get('news_cache') || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => storage.get('news_last_updated') || 0);

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  const updateNews = useCallback(async (force = false) => {
    // Cache for 15 minutes
    const now = Date.now();
    if (!force && articles.length > 0 && now - lastUpdated < 15 * 60 * 1000) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error('News API key missing');
      }

      const [tech, science] = await Promise.all([
        fetchNews('technology', apiKey),
        fetchNews('science', apiKey)
      ]);

      const techArticles = tech.map(a => ({ ...a, category: 'technology' }));
      const scienceArticles = science.map(a => ({ ...a, category: 'science' }));
      
      const allArticles = [...techArticles, ...scienceArticles];
      setArticles(allArticles);
      setLastUpdated(now);
      
      storage.set('news_cache', allArticles, 15); // 15 mins TTL
      storage.set('news_last_updated', now);
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to fetch news');
      if (articles.length === 0) {
        toast.error('News update failed. Check your API key.');
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, articles.length, lastUpdated]);

  useEffect(() => {
    updateNews();
  }, [updateNews]);

  return (
    <NewsContext.Provider value={{ articles, loading, error, refresh: () => updateNews(true) }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
