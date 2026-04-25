'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminDB, AdminAccount, AdminAccountFrontend } from '@/lib/supabase';
import { verifyPassword, hashPassword, validatePasswordStrength } from '@/utils/password';

// Convert Supabase DB format to frontend format
const convertToAdminAccountFrontend = (dbAdmin: AdminAccount): AdminAccountFrontend => ({
  id: dbAdmin.id,
  adminId: dbAdmin.admin_id,
  username: dbAdmin.username,
  email: dbAdmin.email,
  avatar: dbAdmin.avatar,
  role: dbAdmin.role,
  isSuperAdmin: dbAdmin.is_super_admin,
  createdAt: dbAdmin.created_at,
  lastActive: dbAdmin.last_active
});

// Convert frontend format to Supabase DB format
const convertToAdminAccount = (admin: AdminAccountFrontend): AdminAccount => ({
  id: admin.id,
  admin_id: admin.adminId,
  username: admin.username,
  email: admin.email,
  password: '', // Password should never be sent to frontend
  avatar: admin.avatar,
  role: admin.role,
  is_super_admin: admin.isSuperAdmin,
  created_at: admin.createdAt,
  last_active: admin.lastActive
});

interface AdminContextType {
  currentAdmin: AdminAccountFrontend | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAdminProfile: (username?: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  getAllAdmins: () => Promise<AdminAccountFrontend[]>;
  deleteAdmin: (adminId: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccountFrontend | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const initializeAdminSession = async () => {
      if (typeof window !== 'undefined') {
        const savedAdminId = localStorage.getItem('adminId');
        const savedLoginState = localStorage.getItem('adminLoggedIn') === 'true';

        console.log('Initializing admin session:', { savedAdminId, savedLoginState });

        if (savedAdminId && savedLoginState) {
          // Verify that admin still exists in database
          try {
            const admin = await adminDB.getAdminByAdminId(savedAdminId);
            console.log('Admin from DB:', admin);
            if (admin) {
              setCurrentAdmin(convertToAdminAccountFrontend(admin));
              setIsLoggedIn(true);
              // Update last active
              await adminDB.updateAdminLastActive(savedAdminId);
            } else {
              console.log('Admin not found in DB, clearing session');
              localStorage.removeItem('adminId');
              localStorage.removeItem('adminLoggedIn');
            }
          } catch (error) {
            console.error('Error loading admin session:', error);
            localStorage.removeItem('adminId');
            localStorage.removeItem('adminLoggedIn');
          }
        }
      }
      setIsLoading(false);
    };

    initializeAdminSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Find admin by email
      const admin = await adminDB.getAdminByEmail(email);

      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }

      // Verify password using bcrypt
      const isPasswordValid = await verifyPassword(password, admin.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid password' };
      }

      console.log('Login successful, admin:', admin.admin_id);

      // Set current admin and mark as logged in
      setCurrentAdmin(convertToAdminAccountFrontend(admin));
      setIsLoggedIn(true);

      // Update last active
      await adminDB.updateAdminLastActive(admin.admin_id);

      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminId', admin.admin_id);
        localStorage.setItem('adminLoggedIn', 'true');
        console.log('Session saved to localStorage:', admin.admin_id);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    // Clear session
    setCurrentAdmin(null);
    setIsLoggedIn(false);

    // Clear session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminLoggedIn');
    }
  };

  const updateAdminProfile = async (
    username?: string,
    avatar?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!currentAdmin) {
        return { success: false, error: 'No admin logged in' };
      }

      const updateData: Partial<AdminAccount> = {};
      if (username) updateData.username = username;
      if (avatar) updateData.avatar = avatar;

      const result = await adminDB.updateAdminByAdminId(currentAdmin.adminId, updateData);

      if (result) {
        // Update local state
        setCurrentAdmin(prev => prev ? { ...prev, ...convertToAdminAccountFrontend(result) } : null);
        return { success: true };
      } else {
        return { success: false, error: 'Profile update failed' };
      }
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  const getAllAdmins = async (): Promise<AdminAccountFrontend[]> => {
    try {
      const admins = await adminDB.getAllAdmins();
      return admins.map(admin => convertToAdminAccountFrontend(admin));
    } catch (error) {
      return [];
    }
  };

  const deleteAdmin = async (adminId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if current user is super admin
      if (!currentAdmin || !currentAdmin.isSuperAdmin) {
        return { success: false, error: 'Only super admins can delete admins' };
      }

      // Prevent deleting yourself
      if (adminId === currentAdmin.adminId) {
        return { success: false, error: 'Cannot delete yourself' };
      }

      const result = await adminDB.deleteAdminByAdminId(adminId);

      if (result) {
        return { success: true };
      } else {
        return { success: false, error: 'Admin deletion failed' };
      }
    } catch (error) {
      return { success: false, error: 'Admin deletion failed' };
    }
  };

  return (
    <AdminContext.Provider value={{
      currentAdmin,
      isLoggedIn,
      isLoading,
      login,
      logout,
      updateAdminProfile,
      getAllAdmins,
      deleteAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Export the context directly for components that need it
export { AdminContext };
