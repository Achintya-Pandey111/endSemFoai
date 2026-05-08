import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User, Tag } from 'lucide-react';
import { cn } from '../utils/cn';

const NewsCard = ({ article, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="t11-grid-item group flex flex-col h-full bg-background border-r border-b border-foreground/10"
    >
      <div className="relative aspect-video overflow-hidden border-b border-foreground/10">
        {article.urlToImage ? (
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
            <Tag size={32} className="text-foreground/10" />
          </div>
        )}
      </div>

      <div className="pt-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <span className="t11-label !mb-0">{article.category}</span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h3 className="text-2xl font-black text-foreground mb-4 line-clamp-2 leading-[1.1] tracking-tighter uppercase">
          {article.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-10 flex-1 leading-relaxed">
          {article.description || "The intelligence report for this sector is currently undergoing verification. Please check back for updates."}
        </p>

        <div className="mt-auto flex items-center justify-between group/link">
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
            Source: {article.source.name}
          </span>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="t11-button !px-4 !py-2 flex items-center gap-2 group-hover:bg-foreground group-hover:text-background"
          >
            Access <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
