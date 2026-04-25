'use client';

import { useEffect, useState } from 'react';
import { userDB } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserGrowthChart() {
  const [data, setData] = useState<Array<{ date: string; users: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await userDB.getAllUsers();
        
        // Group users by date (last 30 days)
        const userCounts: Record<string, number> = {};
        const today = new Date();
        
        // Initialize last 30 days with 0
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          userCounts[dateStr] = 0;
        }
        
        // Count users per date
        users.forEach(user => {
          const createdDate = new Date(user.created_at).toISOString().split('T')[0];
          if (userCounts.hasOwnProperty(createdDate)) {
            userCounts[createdDate]++;
          }
        });
        
        // Convert to array and calculate cumulative
        const sortedDates = Object.keys(userCounts).sort();
        let cumulative = 0;
        const chartData = sortedDates.map(date => {
          cumulative += userCounts[date];
          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            users: cumulative
          };
        });
        
        setData(chartData);
      } catch (error) {
        console.error('Error loading user growth data:', error);
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
      <h3 className="text-lg font-semibold text-white mb-4">User Growth (30 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              color: '#fff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
