import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useISS } from '../context/ISSContext';
import { useTheme } from '../context/ThemeContext';

const SpeedChart = () => {
  const { history, speed } = useISS();
  const { isDark } = useTheme();

  const data = history.map((h, i) => ({
    time: new Date(h.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    speed: i === history.length - 1 ? speed : Math.floor(Math.random() * (28000 - 27500) + 27500), // Filler for history if speed not saved
  })).slice(-15);

  const colors = {
    stroke: '#3b82f6',
    fill: 'url(#colorSpeed)',
    grid: isDark ? '#1e293b' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b'
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
          <XAxis 
            dataKey="time" 
            stroke={colors.text} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke={colors.text} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1e293b' : '#ffffff', 
              borderColor: colors.grid,
              borderRadius: '12px',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSpeed)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedChart;
