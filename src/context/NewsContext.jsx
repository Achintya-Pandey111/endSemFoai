import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/api';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState(() => storage.get('news_cache_v2') || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => storage.get('news_last_updated_v2') || 0);

  const updateNews = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && articles.length > 0 && now - lastUpdated < 15 * 60 * 1000) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allArticles = await fetchNews(30); // Fetch 30 latest articles
      
      setArticles(allArticles);
      setLastUpdated(now);
      
      storage.set('news_cache_v2', allArticles, 15);
      storage.set('news_last_updated_v2', now);
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to fetch orbital intelligence');
      if (articles.length === 0) {
        toast.error('Intelligence network sync failed.');
      }
    } finally {
      setLoading(false);
    }
  }, [articles.length, lastUpdated]);

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
