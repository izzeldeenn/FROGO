'use client';

import { useEffect, useState } from 'react';
import { userDB } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function UserDistributionChart() {
  const [data, setData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await userDB.getAllUsers();
        
        // Group users by country
        const countryCounts: Record<string, number> = {};
        users.forEach(user => {
          const country = user.country || 'Unknown';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
        
        // Sort by count and take top 5
        const sortedCountries = Object.entries(countryCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        
        const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
        
        const chartData = sortedCountries.map(([country, count], index) => ({
          name: country,
          value: count,
          color: colors[index % colors.length]
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error loading user distribution data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black rounded-lg p-4 border border-gray-800">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-800 rounded w-1/4" />
          <div className="h-48 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg p-4 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Users by Country (Top 5)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              color: '#fff'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
