'use client';

import { useEffect, useState } from 'react';
import { userDB, UserAccountFrontend } from '@/lib/supabase';
import { Search, MoreVertical, Mail, Calendar, Shield, Ban, Filter } from 'lucide-react';
import UserManagementModal from './UserManagementModal';

export default function AdminUsersList() {
  const [users, setUsers] = useState<UserAccountFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccountFrontend | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'moderator' | 'admin'>('all');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await userDB.getAllUsers();
        setUsers(allUsers.map(user => ({
          id: user.id,
          accountId: user.account_id,
          username: user.username,
          email: user.email,
          hashKey: user.hash_key,
          avatar: user.avatar,
          referralCode: user.referral_code,
          country: user.country,
          browserId: user.browser_id,
          deviceId: user.device_id,
          createdAt: user.created_at,
          lastActive: user.last_active,
          role: user.role,
          status: user.status,
          bannedUntil: user.banned_until,
          banReason: user.ban_reason,
          adminNotes: user.admin_notes
        })));
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">Active</span>;
      case 'inactive':
        return <span className="px-2 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded-full">Inactive</span>;
      case 'banned':
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full">Banned</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded-full">Unknown</span>;
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">Admin</span>;
      case 'moderator':
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">Moderator</span>;
      case 'user':
        return <span className="px-2 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded-full">User</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded-full">User</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg p-4 border border-gray-800">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-800 rounded w-1/4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-black rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors"
              title="Filters"
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent text-sm w-48"
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 p-3 bg-gray-800 rounded-md space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white text-xs focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white text-xs focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.accountId}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-all duration-150"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{user.username}</h3>
                    {getStatusBadge(user.status)}
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 text-xs flex-shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(user.lastActive).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-1.5 hover:bg-gray-600 rounded-md transition-colors"
                  title="Manage user"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-gray-400 text-xs">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {selectedUser && (
        <UserManagementModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => {
            loadUsers();
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );

  async function loadUsers() {
    try {
      const allUsers = await userDB.getAllUsers();
      setUsers(allUsers.map(user => ({
        id: user.id,
        accountId: user.account_id,
        username: user.username,
        email: user.email,
        hashKey: user.hash_key,
        avatar: user.avatar,
        referralCode: user.referral_code,
        country: user.country,
        browserId: user.browser_id,
        deviceId: user.device_id,
        createdAt: user.created_at,
        lastActive: user.last_active,
        role: user.role,
        status: user.status,
        bannedUntil: user.banned_until,
        banReason: user.ban_reason,
        adminNotes: user.admin_notes
      })));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
}
