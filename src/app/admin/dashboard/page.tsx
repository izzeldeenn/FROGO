'use client';

import { useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AdminUsersList from '@/components/admin/AdminUsersList';
import AdminAdminsList from '@/components/admin/AdminAdminsList';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import UserDistributionChart from '@/components/admin/UserDistributionChart';
import ScoreDistributionChart from '@/components/admin/ScoreDistributionChart';

export default function AdminDashboard() {
  const { currentAdmin, isLoggedIn, isLoading, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/admin-auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || !currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Welcome back, {currentAdmin.username}!
              {currentAdmin.isSuperAdmin && (
                <span className="ml-2 px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
                  Super Admin
                </span>
              )}
            </p>
          </div>

          <div className="space-y-6">
            <AdminStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserGrowthChart />
              <UserDistributionChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreDistributionChart />
              <AdminUsersList />
            </div>

            {currentAdmin.isSuperAdmin && <AdminAdminsList />}
          </div>
        </main>
      </div>
    </div>
  );
}
