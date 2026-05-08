import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const StatCard = ({ title, value, unit, icon: Icon, color, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 border border-foreground/10 bg-background flex flex-col justify-between group hover:bg-foreground/5 transition-colors"
    >
      <div className="flex items-start justify-between mb-8">
        <span className="t11-label !mb-0">{title}</span>
        <div className={cn("text-foreground opacity-20", color)}>
          <Icon size={16} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">{value}</h3>
          {unit && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{unit}</span>}
        </div>
        {description && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mt-4 line-clamp-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-foreground/5">
        <div className="w-full h-0.5 bg-foreground/10 overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-full bg-foreground/20"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
