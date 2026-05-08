import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNews } from '../context/NewsContext';
import { useTheme } from '../context/ThemeContext';

const NewsChart = () => {
  const { articles } = useNews();
  const { isDark } = useTheme();

  const techCount = articles.filter(a => a.category === 'technology').length;
  const scienceCount = articles.filter(a => a.category === 'science').length;

  const data = [
    { name: 'Technology', value: techCount },
    { name: 'Science', value: scienceCount },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              backgroundColor: isDark ? '#1e293b' : '#ffffff', 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NewsChart;
