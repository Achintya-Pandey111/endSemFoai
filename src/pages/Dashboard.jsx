import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Orbit, 
  Users, 
  Zap, 
  Map as MapIcon, 
  TrendingUp, 
  Newspaper, 
  RefreshCcw,
  Search,
  Filter
} from 'lucide-react';
import { useISS } from '../context/ISSContext';
import { useNews } from '../context/NewsContext';
import StatCard from '../components/StatCard';
import ISSMap from '../components/ISSMap';
import NewsCard from '../components/NewsCard';
import SpeedChart from '../charts/SpeedChart';
import NewsChart from '../charts/NewsChart';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { location, speed, address, people, refresh: refreshISS, loading: issLoading } = useISS();
  const { articles, loading: newsLoading, refresh: refreshNews } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [newsFilter, setNewsFilter] = useState('all');

  const filteredNews = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = newsFilter === 'all' || a.category === newsFilter;
    return matchesSearch && matchesFilter;
  }).slice(0, 10);

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header Section */}
      <div id="dash" className="p-8 lg:p-12 border-b border-foreground/10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <span className="t11-label">Mission Control</span>
          <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
            Orbital<br/>Command
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-6 max-w-md">
            Real-time orbital tracking and planetary intelligence network. Sector: LEO // Status: ACTIVE
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button 
            onClick={() => { refreshISS(); refreshNews(); }}
            className="t11-button flex items-center justify-center gap-3 !py-4 !px-8 hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            <RefreshCcw size={16} className={cn((issLoading || newsLoading) && "animate-spin")} />
            Sync Data
          </button>
          <div className="flex items-center justify-center gap-3 px-8 py-4 border border-foreground text-[10px] font-black uppercase tracking-widest bg-foreground text-background">
            <div className="w-1.5 h-1.5 bg-background rounded-full animate-pulse" />
            System Live
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats Grid - Using t11 grid style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-foreground/10">
          <StatCard 
            title="ISS Velocity"
            value={speed.toFixed(0)}
            unit="km/h"
            icon={Zap}
            color="text-foreground"
            description="Orbital mechanics verified"
          />
          <StatCard 
            title="Current Position"
            value={location ? `${location.lat.toFixed(1)}° ${location.lng.toFixed(1)}°` : '0.0° 0.0°'}
            icon={MapIcon}
            color="text-foreground"
            description={address || "Scanning surface..."}
          />
          <StatCard 
            title="People in Space"
            value={people.length}
            unit="Personnel"
            icon={Users}
            color="text-foreground"
            description="Active duty crew"
          />
          <StatCard 
            title="Intel Sources"
            value={articles.length}
            unit="Streams"
            icon={TrendingUp}
            color="text-foreground"
            description="Space Intelligence"
          />
        </div>

        {/* Map & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-foreground/10">
          <div className="lg:col-span-2 border-r border-foreground/10 p-0 min-h-[500px]">
            <ISSMap />
          </div>
          <div className="grid grid-rows-2">
            <div className="p-8 border-b border-foreground/10 flex flex-col">
              <span className="t11-label">Velocity Analytics</span>
              <div className="flex-1 min-h-[150px]">
                <SpeedChart />
              </div>
            </div>
            <div className="p-8 flex flex-col">
              <span className="t11-label">Intel Distribution</span>
              <div className="flex-1 min-h-[150px]">
                <NewsChart />
              </div>
            </div>
          </div>
        </div>

        {/* People in Space List */}
        <div className="p-12 border-b border-foreground/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="t11-label">Personnel Overview</span>
              <h3 className="text-4xl font-black text-foreground uppercase tracking-tighter">Active Crew Aboard ISS</h3>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
              Verified via Open Notify Protocol // {people.length} Active
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-l border-foreground/10">
            {people.map((person, idx) => (
              <motion.div 
                key={person.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 border-r border-b border-foreground/10 flex flex-col items-center text-center group hover:bg-foreground hover:text-background transition-colors"
              >
                <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center mb-4 group-hover:border-background/30">
                  <User size={16} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest mb-1">{person.name}</p>
                <p className="text-[9px] font-bold text-muted-foreground group-hover:text-background/50 uppercase tracking-[0.2em]">{person.craft}</p>
              </motion.div>
            ))}
            {people.length === 0 && (
              <div className="col-span-full py-12 text-center border-r border-b border-foreground/10">
                <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Establishing personnel link...</span>
              </div>
            )}
          </div>
        </div>

        {/* News Section */}
        <div id="news" className="bg-background">
          <div className="p-12 border-b border-foreground/10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <span className="t11-label">Intelligence Feed</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter">Latest Planetary Intel</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-foreground/20 p-1">
                <div className="relative border-r border-foreground/20 px-4 py-3 flex items-center gap-3 min-w-[250px]">
                  <Search size={14} className="text-foreground/40" />
                  <input 
                    type="text" 
                    placeholder="SEARCH INTEL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold tracking-widest text-foreground focus:outline-none placeholder:text-foreground/20 uppercase w-full"
                  />
                </div>
                <select 
                  value={newsFilter}
                  onChange={(e) => setNewsFilter(e.target.value)}
                  className="bg-transparent px-4 py-3 text-[10px] font-bold tracking-widest text-foreground uppercase focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-background text-foreground">All Sectors</option>
                </select>
              </div>
            </div>
          </div>

          <div className="t11-grid border-foreground/10">
            {newsLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="t11-grid-item h-80 animate-pulse bg-background/5" />
              ))
            ) : (
              filteredNews.map((article, i) => (
                <NewsCard key={article.url} article={article} index={i} />
              ))
            )}
            {filteredNews.length === 0 && !newsLoading && (
              <div className="col-span-full py-20 text-center border-b border-background/10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">No intelligence matches in this sector</p>
              </div>
            )}
          </div>
        </div>

        <footer className="p-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
            OrbitScope — Distributed Planetary Intelligence Network
          </p>
        </footer>
      </div>
    </div>
  );
};

// Simple User icon for crew
const User = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default Dashboard;
