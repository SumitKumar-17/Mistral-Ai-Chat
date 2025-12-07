'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Shield, 
  Palette, 
  Key, 
  Globe, 
  Moon, 
  Sun, 
  MessageSquare, 
  Users, 
  Lock,
  Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      messages: true,
      groupInvites: true,
      friendRequests: true,
      email: false,
    },
    privacy: {
      profileVisible: true,
      lastSeenVisible: true,
      statusVisible: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      autoLogout: false,
    },
    appearance: {
      theme: 'light', // 'light', 'dark', 'system'
      fontSize: 'medium', // 'small', 'medium', 'large'
      messageDisplay: 'bubble', // 'bubble', 'compact'
    },
    chats: {
      autoDownload: true,
      showPreviews: true,
      notificationsInChats: true,
    }
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, you would save settings to the database
    toast.success('Settings saved successfully!');
    console.log('Saved settings:', settings);
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">New Messages</h4>
            <p className="text-sm text-gray-500">Notify me when I receive new messages</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', 'messages', !settings.notifications.messages)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.notifications.messages ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications.messages ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Group Invites</h4>
            <p className="text-sm text-gray-500">Notify me when I'm invited to groups</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', 'groupInvites', !settings.notifications.groupInvites)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.notifications.groupInvites ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications.groupInvites ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Friend Requests</h4>
            <p className="text-sm text-gray-500">Notify me when someone sends a friend request</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', 'friendRequests', !settings.notifications.friendRequests)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.notifications.friendRequests ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications.friendRequests ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Send notifications via email</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', 'email', !settings.notifications.email)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Profile Visibility</h4>
            <p className="text-sm text-gray-500">Who can see your profile information</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'profileVisible', !settings.privacy.profileVisible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.privacy.profileVisible ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Last Seen Visibility</h4>
            <p className="text-sm text-gray-500">Who can see when you were last online</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'lastSeenVisible', !settings.privacy.lastSeenVisible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.privacy.lastSeenVisible ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.privacy.lastSeenVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Status Visibility</h4>
            <p className="text-sm text-gray-500">Who can see your online status</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'statusVisible', !settings.privacy.statusVisible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.privacy.statusVisible ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.privacy.statusVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.security.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Login Alerts</h4>
            <p className="text-sm text-gray-500">Get notified when your account is accessed from a new device</p>
          </div>
          <button
            onClick={() => handleSettingChange('security', 'loginAlerts', !settings.security.loginAlerts)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.security.loginAlerts ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Auto Logout</h4>
            <p className="text-sm text-gray-500">Automatically logout after inactivity</p>
          </div>
          <button
            onClick={() => handleSettingChange('security', 'autoLogout', !settings.security.autoLogout)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.security.autoLogout ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.security.autoLogout ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Theme</h4>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'system'].map(theme => (
              <button
                key={theme}
                onClick={() => handleSettingChange('appearance', 'theme', theme)}
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  settings.appearance.theme === theme
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {theme === 'light' && <Sun className="mb-1" size={20} />}
                {theme === 'dark' && <Moon className="mb-1" size={20} />}
                {theme === 'system' && <Globe className="mb-1" size={20} />}
                <span className="text-sm capitalize">{theme}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Font Size</h4>
          <div className="flex space-x-3">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => handleSettingChange('appearance', 'fontSize', size)}
                className={`px-4 py-2 rounded-lg ${
                  settings.appearance.fontSize === size
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Chat Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Auto Download Media</h4>
            <p className="text-sm text-gray-500">Automatically download images and files</p>
          </div>
          <button
            onClick={() => handleSettingChange('chats', 'autoDownload', !settings.chats.autoDownload)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.chats.autoDownload ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.chats.autoDownload ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Show Media Previews</h4>
            <p className="text-sm text-gray-500">Show previews for images and videos in chats</p>
          </div>
          <button
            onClick={() => handleSettingChange('chats', 'showPreviews', !settings.chats.showPreviews)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.chats.showPreviews ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.chats.showPreviews ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Show Notifications in Chats</h4>
            <p className="text-sm text-gray-500">Display notification banners in chat</p>
          </div>
          <button
            onClick={() => handleSettingChange('chats', 'notificationsInChats', !settings.chats.notificationsInChats)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.chats.notificationsInChats ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.chats.notificationsInChats ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'security':
        return renderSecurityTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'chats':
        return renderChatsTab();
      default:
        return renderNotificationsTab();
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'notifications':
        return <Bell size={18} />;
      case 'privacy':
        return <Globe size={18} />;
      case 'security':
        return <Shield size={18} />;
      case 'appearance':
        return <Palette size={18} />;
      case 'chats':
        return <MessageSquare size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Settings Sidebar */}
            <div className="md:w-1/4 border-r border-gray-200">
              <nav className="p-4">
                {[
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'privacy', label: 'Privacy' },
                  { id: 'security', label: 'Security' },
                  { id: 'appearance', label: 'Appearance' },
                  { id: 'chats', label: 'Chats' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-1 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{getTabIcon(tab.id)}</span>
                    {tab.label}
                  </button>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 mt-4"
                >
                  <Lock size={18} className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
            
            {/* Settings Content */}
            <div className="md:w-3/4 p-6">
              {renderTabContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={saveSettings}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Save size={18} className="mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;