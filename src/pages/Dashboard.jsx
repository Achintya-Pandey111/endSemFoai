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
    <div className="flex-1 p-4 lg:p-8 space-y-8 overflow-y-auto scroll-smooth">
      {/* Header Section */}
      <div id="dash" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h2>
          <p className="text-muted-foreground">Real-time orbital tracking and planetary intelligence dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { refreshISS(); refreshNews(); }}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-foreground hover:bg-secondary/80 transition-all font-medium border border-border"
          >
            <RefreshCcw size={18} className={cn((issLoading || newsLoading) && "animate-spin")} />
            Sync Data
          </button>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 font-medium">
            <Zap size={18} />
            System Live
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="ISS Velocity"
          value={speed.toFixed(0)}
          unit="km/h"
          icon={Zap}
          color="text-yellow-500"
          description="Average orbital speed: 27,600 km/h"
        />
        <StatCard 
          title="Current Position"
          value={location ? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°` : 'Tracking...'}
          icon={MapIcon}
          color="text-blue-500"
          description={address}
        />
        <StatCard 
          title="People in Space"
          value={people.length}
          unit="Astronauts"
          icon={Users}
          color="text-purple-500"
          description={`Tracked via Open Notify API`}
        />
        <StatCard 
          title="Intel Sources"
          value={articles.length}
          unit="Articles"
          icon={TrendingUp}
          color="text-green-500"
          description="Science & Tech Headlines"
        />
      </div>

      {/* Map & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-1 min-h-[500px]">
          <ISSMap />
        </div>
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl flex flex-col h-[240px]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Velocity Analytics</h3>
            <SpeedChart />
          </div>
          <div className="glass p-6 rounded-3xl flex flex-col h-[240px]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Intel Distribution</h3>
            <NewsChart />
          </div>
        </div>
      </div>

      {/* People in Space List */}
      <div className="glass p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold">Crew Members Aboard ISS</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {people.map((person, idx) => (
            <motion.div 
              key={person.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-secondary/50 border border-border rounded-2xl flex flex-col items-center text-center group hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <p className="font-bold text-sm truncate w-full">{person.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{person.craft}</p>
            </motion.div>
          ))}
          {people.length === 0 && <p className="col-span-full text-center text-muted-foreground italic">Fetching crew data...</p>}
        </div>
      </div>

      {/* News Section */}
      <div id="news" className="space-y-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <Newspaper size={24} />
            </div>
            <h3 className="text-xl font-bold">Global Intelligence</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search intel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full md:w-64"
              />
            </div>
            <select 
              value={newsFilter}
              onChange={(e) => setNewsFilter(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="all">All Intel</option>
              <option value="technology">Tech</option>
              <option value="science">Science</option>
            </select>
          </div>
        </div>

        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass h-80 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredNews.map((article, i) => (
              <NewsCard key={article.url} article={article} index={i} />
            ))}
            {filteredNews.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <Search size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No intel found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="pt-10 pb-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          OrbitScope — Real-Time ISS & News Dashboard. Powered by Open Notify, NewsAPI, and Hugging Face.
        </p>
      </footer>
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
