import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User, Tag } from 'lucide-react';
import { cn } from '../utils/cn';

const NewsCard = ({ article, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass overflow-hidden rounded-3xl group flex flex-col h-full hover:border-primary/30 transition-colors"
    >
      <div className="relative h-48 overflow-hidden">
        {article.urlToImage ? (
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Tag size={40} className="text-muted-foreground opacity-20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md",
            article.category === 'technology' ? "bg-blue-500/80" : "bg-purple-500/80"
          )}>
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-1 truncate max-w-[120px]">
            <User size={14} />
            {article.author || article.source.name}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
          {article.description || "No description available for this article."}
        </p>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground truncate max-w-[100px]">
            {article.source.name}
          </span>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all"
          >
            READ MORE <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
