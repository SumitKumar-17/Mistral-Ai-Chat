'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera, Edit3, Save, X, Check, Shield, Bell, Palette, Moon, Sun, Key, Globe, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    appAccess: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // In a real app, you would update the user in the database
      // For now, just update the local state
      updateUser({
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatar: formData.avatar,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
  };

  const handleSecurityChange = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  if (!user) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                    <Camera size={20} className="text-gray-600" />
                  </button>
                )}
              </div>
              <div className="ml-6 text-white">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="flex items-center mt-1">
                  <Mail size={16} className="mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-indigo-500 text-indigo-600 font-medium">
                Profile
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Privacy
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Security
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio || 'No bio added yet'}</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    <Lock size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              {/* Settings Sidebar */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
                
                <div className="space-y-4">
                  {/* Appearance Settings */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Palette size={18} className="mr-2 text-indigo-600" />
                      Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            isDarkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Notification Settings */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Bell size={18} className="mr-2 text-indigo-600" />
                      Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                      <span>Enable Notifications</span>
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Security Settings */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Shield size={18} className="mr-2 text-indigo-600" />
                      Security
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Two-Factor Auth</span>
                        <button
                          onClick={() => handleSecurityChange('twoFactorAuth')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            securitySettings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Login Alerts</span>
                        <button
                          onClick={() => handleSecurityChange('loginAlerts')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            securitySettings.loginAlerts ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>App Access</span>
                        <button
                          onClick={() => handleSecurityChange('appAccess')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            securitySettings.appAccess ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              securitySettings.appAccess ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;