'use client';

import { useState } from 'react';
import { UserAccountFrontend } from '@/lib/supabase';
import { X, Shield, Ban, Trash2, FileText, AlertTriangle } from 'lucide-react';

interface UserManagementModalProps {
  user: UserAccountFrontend;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserManagementModal({ user, onClose, onUpdate }: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'role' | 'ban' | 'notes' | 'delete'>('role');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Role management
  const [selectedRole, setSelectedRole] = useState<'user' | 'moderator' | 'admin'>(user.role as 'user' | 'moderator' | 'admin' || 'user');
  
  // Ban management
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'permanent' | '1day' | '7days' | '30days'>('permanent');
  
  // Notes management
  const [adminNotes, setAdminNotes] = useState(user.adminNotes || '');

  const handleRoleUpdate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { userDB } = await import('@/lib/supabase');
      const result = await userDB.updateUserRole(user.accountId, selectedRole as 'user' | 'moderator' | 'admin');
      
      if (result) {
        onUpdate();
        onClose();
      } else {
        setError('Failed to update role');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banReason.trim()) {
      setError('Please provide a ban reason');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { userDB } = await import('@/lib/supabase');
      
      let bannedUntil: string | undefined;
      if (banDuration !== 'permanent') {
        const now = new Date();
        const durations = {
          '1day': 1,
          '7days': 7,
          '30days': 30
        };
        now.setDate(now.getDate() + durations[banDuration]);
        bannedUntil = now.toISOString();
      }
      
      const result = await userDB.banUser(user.accountId, banReason, bannedUntil);
      
      if (result) {
        onUpdate();
        onClose();
      } else {
        setError('Failed to ban user');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { userDB } = await import('@/lib/supabase');
      const result = await userDB.unbanUser(user.accountId);
      
      if (result) {
        onUpdate();
        onClose();
      } else {
        setError('Failed to unban user');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNotesUpdate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { userDB } = await import('@/lib/supabase');
      const result = await userDB.updateAdminNotes(user.accountId, adminNotes);
      
      if (result) {
        onUpdate();
        onClose();
      } else {
        setError('Failed to update notes');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { userDB } = await import('@/lib/supabase');
      const result = await userDB.deleteUser(user.accountId);
      
      if (result) {
        onUpdate();
        onClose();
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-lg border border-gray-800 w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Manage {user.username}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('role')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'role'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Role
            </button>
            <button
              onClick={() => setActiveTab('ban')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'ban'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Ban className="w-4 h-4 inline mr-2" />
              {user.status === 'banned' ? 'Unban' : 'Ban'}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'delete'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-md p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {activeTab === 'role' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'user' | 'moderator' | 'admin')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleRoleUpdate}
                disabled={loading}
                className="w-full py-2 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          )}

          {activeTab === 'ban' && (
            <div className="space-y-4">
              {user.status === 'banned' ? (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm mb-1">User is banned</p>
                        <p className="text-gray-400 text-xs mb-2">Reason: {user.banReason || 'No reason provided'}</p>
                        {user.bannedUntil && (
                          <p className="text-gray-400 text-xs">
                            Until: {new Date(user.bannedUntil).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleUnban}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {loading ? 'Unbanning...' : 'Unban User'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ban Duration</label>
                    <select
                      value={banDuration}
                      onChange={(e) => setBanDuration(e.target.value as 'permanent' | '1day' | '7days' | '30days')}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm"
                    >
                      <option value="permanent">Permanent</option>
                      <option value="1day">1 Day</option>
                      <option value="7days">7 Days</option>
                      <option value="30days">30 Days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ban Reason</label>
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Reason for banning this user..."
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm resize-none"
                    />
                  </div>
                  <button
                    onClick={handleBan}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {loading ? 'Banning...' : 'Ban User'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add private notes about this user..."
                  rows={5}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm resize-none"
                />
              </div>
              <button
                onClick={handleNotesUpdate}
                disabled={loading}
                className="w-full py-2 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium text-sm mb-1">Danger Zone</p>
                    <p className="text-gray-400 text-xs">
                      Deleting this user will permanently remove all their data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Username:</strong> {user.username}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Email:</strong> {user.email}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Account ID:</strong> {user.accountId}
                </p>
              </div>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
