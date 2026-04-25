'use client';

import { useEffect, useState } from 'react';
import { userDB } from '@/lib/supabase';
import { Users, UserCheck, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    paidSubscriptions: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await userDB.getAllUsers();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(user => {
          const lastActive = new Date(user.last_active);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastActive > sevenDaysAgo;
        }).length;

        const paidSubscriptions = users.filter(user => 
          user.subscription_plan && user.subscription_plan !== 'free'
        ).length;

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersThisMonth = users.filter(user => 
          new Date(user.created_at) >= firstDayOfMonth
        ).length;

        setStats({
          totalUsers,
          activeUsers,
          paidSubscriptions,
          newUsersThisMonth
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-gray-800'
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: UserCheck,
      bgColor: 'bg-gray-800'
    },
    {
      title: 'Paid Subscriptions',
      value: stats.paidSubscriptions,
      icon: CreditCard,
      bgColor: 'bg-gray-800'
    },
    {
      title: 'New Users (This Month)',
      value: stats.newUsersThisMonth,
      icon: TrendingUp,
      bgColor: 'bg-gray-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-black rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
          </div>
        );
      })}
    </div>
  );
}
