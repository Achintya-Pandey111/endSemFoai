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
    <div className="flex-1 p-4 lg:p-8 space-y-8 overflow-y-auto bg-background/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-2">Global Intel</h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time planetary intelligence feed. Aggregated from global scientific journals and technology journals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-bold"
          >
            <RefreshCcw size={20} className={cn(loading && "animate-spin")} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">Intel Overview</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-secondary/50 rounded-3xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Intel</p>
              <p className="text-3xl font-black text-foreground">{articles.length}</p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-3xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tech Feed</p>
              <p className="text-3xl font-black text-blue-500">{articles.filter(a => a.category === 'technology').length}</p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-3xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Science Feed</p>
              <p className="text-3xl font-black text-purple-500">{articles.filter(a => a.category === 'science').length}</p>
            </div>
          </div>
        </div>
        <div className="glass p-8 rounded-[2.5rem]">
           <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">Category Split</h3>
           <NewsChart />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search intelligence keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-2xl border border-border w-full md:w-auto">
          {['all', 'technology', 'science'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all",
                category === cat 
                  ? "bg-background text-primary shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass h-[450px] rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredNews.map((article, i) => (
            <NewsCard key={article.url} article={article} index={i} />
          ))}
          {filteredNews.length === 0 && (
            <div className="col-span-full py-32 text-center glass rounded-[2.5rem] border-dashed">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      )}

      <footer className="pt-20 pb-10 text-center opacity-50">
        <p className="text-sm font-medium">OrbitScope Global Intelligence Network</p>
        <p className="text-[10px] uppercase tracking-widest mt-2 font-bold">Classification: UNCLASSIFIED // OPEN SOURCE</p>
      </footer>
    </div>
  );
};

export default NewsPage;
