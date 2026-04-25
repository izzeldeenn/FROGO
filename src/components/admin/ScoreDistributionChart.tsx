'use client';

import { useEffect, useState } from 'react';
import { userDB } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScoreDistributionChart() {
  const [data, setData] = useState<Array<{ plan: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await userDB.getAllUsers();
        
        // Group users by subscription plan
        const planCounts: Record<string, number> = {
          'Free': 0,
          'Monthly': 0,
          'Yearly': 0
        };
        
        users.forEach(user => {
          const plan = user.subscription_plan || 'free';
          const planKey = plan.charAt(0).toUpperCase() + plan.slice(1);
          if (planCounts.hasOwnProperty(planKey)) {
            planCounts[planKey]++;
          }
        });
        
        const distribution = Object.entries(planCounts).map(([plan, count]) => ({
          plan,
          count
        }));
        
        setData(distribution);
      } catch (error) {
        console.error('Error loading subscription distribution data:', error);
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
      <h3 className="text-lg font-semibold text-white mb-4">Subscription Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="plan" 
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
          <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
