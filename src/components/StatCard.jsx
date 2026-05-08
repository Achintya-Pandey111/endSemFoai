import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const StatCard = ({ title, value, unit, icon: Icon, color, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl group relative overflow-hidden"
    >
      <div className={cn(
        "absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 duration-500",
        color
      )}>
        <Icon size={120} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-2xl bg-white/10 text-foreground", color)}>
          <Icon size={24} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-foreground truncate">{value}</h3>
          {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
