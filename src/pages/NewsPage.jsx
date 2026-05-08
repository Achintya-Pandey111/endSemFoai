import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Search, 
  RefreshCcw, 
  TrendingUp,
  Tag,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import NewsChart from '../charts/NewsChart';
import { cn } from '../utils/cn';

const NewsPage = () => {
  const { articles, loading, refresh } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredNews = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || a.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header Section */}
      <div className="p-8 lg:p-12 border-b border-foreground/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-4xl">
            <span className="t11-label">Intelligence Network</span>
            <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.9] mb-6">
              Global<br/>Intel Feed
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold max-w-xl leading-relaxed">
              Real-time orbital intelligence aggregated from the Spaceflight News Network. Updated every 60 seconds.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={refresh}
              disabled={loading}
              className="t11-button flex items-center gap-3 !py-4 !px-8 hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              <RefreshCcw size={16} className={cn(loading && "animate-spin")} />
              Sync Network
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Filters & Search - Architectural bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-foreground/10 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="lg:col-span-3 border-r border-foreground/10 p-6 flex items-center gap-4">
            <Search size={16} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="SEARCH ORBITAL KEYWORDS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-[11px] font-bold tracking-widest text-foreground focus:outline-none placeholder:text-muted-foreground/30 uppercase"
            />
          </div>
          <div className="lg:col-span-1 flex items-center justify-center p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Sector: Orbital
            </span>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="t11-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="t11-grid-item h-[500px] animate-pulse bg-foreground/5" />
            ))}
          </div>
        ) : (
          <div className="t11-grid">
            {filteredNews.map((article, i) => (
              <NewsCard key={article.url} article={article} index={i} />
            ))}
            {filteredNews.length === 0 && (
              <div className="col-span-full py-40 text-center border-b border-foreground/10">
                <span className="t11-label">Warning</span>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Sector Dark // No Intel Found</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Try recalibrating search parameters</p>
              </div>
            )}
          </div>
        )}

        <footer className="p-12 border-t border-foreground/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Network Operational</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-black">
            OrbitScope Intelligence // Classification: UNCLASSIFIED
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">V.4.0.1</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">© 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NewsPage;
