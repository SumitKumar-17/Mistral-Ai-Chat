'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import {
  User,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Search,
  Plus,
  MoreVertical,
  Paperclip,
  Laugh,
  Send,
  X,
  Smile,
  Image as ImageIcon,
  File,
  XCircle,
  ThumbsUp,
  Heart,
  Frown,
  Angry,
  Check,
  CheckCheck,
  Filter,
  Calendar,
  Clock,
  UserCircle
} from 'lucide-react';

const EmojiPicker = ({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) => {
  const emojiGroups = [
    { name: 'Smileys', emojis: ['😀', '😂', '😍', '🥰', '😊', '😉', '🥲', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕'] },
    { name: 'People', emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇'] },
    { name: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'] },
    { name: 'Food', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'] },
    { name: 'Activities', emojis: ['⚽', '🏀', '🏈', '⚾', ' tennis', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🥌', '🏏', '♟'] },
    { name: 'Objects', emojis: ['⌚', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '💾', '💿', '📀', '📞', '📺', '📷', '📸', '📹'] },
  ];

  return (
    <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <h4 className="font-medium text-gray-900">Emojis</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {emojiGroups.map((group, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-1">{group.name}</h5>
            <div className="grid grid-cols-8 gap-1">
              {group.emojis.map((emoji, emojiIndex) => (
                <button
                  key={emojiIndex}
                  onClick={() => onSelect(emoji)}
                  className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReactionPicker = ({ onReact, messageId }: { onReact: (messageId: string, emoji: string) => void; messageId: string }) => {
  const reactions = [
    { emoji: '👍', label: 'Like', icon: ThumbsUp },
    { emoji: '❤️', label: 'Love', icon: Heart },
    { emoji: '😂', label: 'Haha', icon: Laugh },
    { emoji: '😮', label: 'Wow', icon: Frown },
    { emoji: '😢', label: 'Sad', icon: Frown },
    { emoji: '😠', label: 'Angry', icon: Angry },
  ];

  return (
    <div className="absolute -top-8 left-0 flex bg-white border border-gray-300 rounded-full shadow-sm p-1 space-x-1">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReact(messageId, reaction.emoji)}
          className="text-lg hover:bg-gray-100 rounded-full p-1 transition-colors"
          title={reaction.label}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
};

const SearchFilters = ({
  filters,
  setFilters,
  onSearch
}: {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onSearch: (query: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleDateFilter = () => {
    if (dateRange.start && dateRange.end) {
      handleFilterChange('dateRange', dateRange);
      setShowDateFilter(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex flex-col space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('type', filters.type === 'text' ? null : 'text')}
            className={`px-3 py-1 text-sm rounded-full ${filters.type === 'text'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Text
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'media' ? null : 'media')}
            className={`px-3 py-1 text-sm rounded-full ${filters.type === 'media'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Media
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'files' ? null : 'files')}
            className={`px-3 py-1 text-sm rounded-full ${filters.type === 'files'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Files
          </button>
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`px-3 py-1 text-sm rounded-full flex items-center ${filters.dateRange
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            <Calendar size={14} className="mr-1" /> Date
          </button>
          <button
            onClick={() => handleFilterChange('hasReactions', !filters.hasReactions)}
            className={`px-3 py-1 text-sm rounded-full ${filters.hasReactions
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            With Reactions
          </button>
        </div>

        {showDateFilter && (
          <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex space-x-2">
              <div>
                <label className="text-xs text-gray-500">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDateFilter(false)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDateFilter}
                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, logout, isLoading } = useAuth();
  console.log('DashboardPage: Render', { user, isLoading });
  const { isConnected, sendMessage, onNewMessage, onTyping } = useSocket();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: null, // 'text', 'media', 'files'
    hasReactions: false,
    dateRange: null, // { start: string, end: string }
  });
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);

  // Fetch chats and messages when component mounts
  useEffect(() => {
    console.log('DashboardPage: useEffect', { user, isLoading });
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchInitialData = async () => {
      try {
        // In a real app, you'd call API routes here
        // For now, using mock data
        const mockChats = [
          { id: '1', name: 'JohnDoe', isGroup: false, lastMessage: 'Hey there!', time: '10:30 AM', unread: 2, avatar: '' },
          { id: '2', name: 'JaneSmith', isGroup: false, lastMessage: 'See you later!', time: '9:15 AM', unread: 0, avatar: '' },
          { id: '3', name: 'Work Group', isGroup: true, lastMessage: 'Meeting at 3 PM', time: 'Yesterday', unread: 5, avatar: '' },
        ];

        setChats(mockChats);
        setSelectedChat(mockChats[0]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [user, router, isLoading]);

  // Set up socket listeners
  useEffect(() => {
    const newMessageCleanup = onNewMessage((newMessage: any) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
        )
      );
    });

    const typingCleanup = onTyping((data: { userId: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev, data.userId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    return () => {
      newMessageCleanup?.();
      typingCleanup?.();
    };
  }, [onNewMessage, onTyping]);

  // Filter messages based on search and filters
  useEffect(() => {
    let result = [...messages];

    // Search by content
    if (showSearch) {
      result = result.filter(msg =>
        msg.content?.toLowerCase().includes(searchFilters.type || '')
      );
    }

    // Filter by type
    if (searchFilters.type === 'media') {
      result = result.filter(msg => msg.isImage);
    } else if (searchFilters.type === 'files') {
      result = result.filter(msg => msg.fileUrl && !msg.isImage);
    } else if (searchFilters.type === 'text') {
      result = result.filter(msg => !msg.fileUrl);
    }

    // Filter by reactions
    if (searchFilters.hasReactions) {
      result = result.filter(msg => msg.reactions && Object.keys(msg.reactions).length > 0);
    }

    // Filter by date range
    if (searchFilters.dateRange) {
      const { start, end } = searchFilters.dateRange;
      if (start && end) {
        result = result.filter(msg => {
          const msgDate = new Date(`2023-01-01 ${msg.time}`);
          const startDate = new Date(start);
          const endDate = new Date(end);
          return msgDate >= startDate && msgDate <= endDate;
        });
      }
    }

    setFilteredMessages(result);
  }, [messages, searchFilters, showSearch]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
  };

  const handleSendMessage = async () => {
    if (message.trim() === '' && !selectedFile) return;

    if (selectedChat) {
      // Handle file upload if a file is selected
      if (selectedFile) {
        setUploading(true);

        // Simulate file upload
        setTimeout(() => {
          const messageData = {
            chatId: selectedChat.id,
            content: message,
            senderId: user?.id || '',
            fileUrl: URL.createObjectURL(selectedFile),
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            isImage: selectedFile.type.startsWith('image/'),
          };

          sendMessage(messageData);

          // Add message to local state
          const newMessage = {
            id: Date.now().toString(),
            senderId: user?.id,
            sender: user?.username,
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
            fileUrl: URL.createObjectURL(selectedFile),
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            isImage: selectedFile.type.startsWith('image/'),
            reactions: {},
            status: 'sent', // 'sent', 'delivered', 'read'
            deliveredTo: [user?.id], // Array of user IDs who received the message
            readBy: [] // Array of user IDs who read the message
          };

          setMessages(prev => [...prev, newMessage]);
          setSelectedFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setUploading(false);
          setMessage('');
        }, 1000);
      } else {
        // Handle text-only message
        const messageData = {
          chatId: selectedChat.id,
          content: message,
          senderId: user?.id || '',
        };

        sendMessage(messageData);

        // Add message to local state
        const newMessage = {
          id: Date.now().toString(),
          senderId: user?.id,
          sender: user?.username,
          content: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
          reactions: {},
          status: 'sent', // 'sent', 'delivered', 'read'
          deliveredTo: [user?.id], // Array of user IDs who received the message
          readBy: [] // Array of user IDs who read the message
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviewUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const newReactions = { ...msg.reactions };
          const userReactions = newReactions[emoji] || [];

          // Toggle reaction: add if not present, remove if already there
          if (user && userReactions.includes(user.id)) {
            newReactions[emoji] = userReactions.filter((id: string) => id !== user.id);
            if (newReactions[emoji].length === 0) {
              delete newReactions[emoji];
            }
          } else if (user) {
            newReactions[emoji] = [...userReactions, user.id];
          }

          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );

    setShowReactionPicker(null);
  };

  const renderReactions = (reactions: any) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(reactions).map(([emoji, users]: [string, any]) => {
          const userList = Array.isArray(users) ? users : [];
          return (
            <div
              key={emoji}
              className="flex items-center bg-gray-200 rounded-full px-2 py-1 text-xs"
            >
              <span className="mr-1">{emoji}</span>
              <span>{userList.length}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessageStatus = (message: any) => {
    if (!message.isOwn) return null; // Only show status for sent messages

    if (message.readBy && message.readBy.includes(user?.id)) {
      return (
        <span title="Read">
          <CheckCheck
            size={14}
            className="text-blue-500 ml-1"
          />
        </span>
      );
    } else if (message.deliveredTo && message.deliveredTo.includes(user?.id)) {
      return (
        <span title="Delivered">
          <CheckCheck
            size={14}
            className="text-gray-500 ml-1"
          />
        </span>
      );
    } else {
      return (
        <span title="Sent">
          <Check
            size={14}
            className="text-gray-500 ml-1"
          />
        </span>
      );
    }
  };

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/profile')}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <UserCircle size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Chat Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 px-4 text-center font-medium text-indigo-600 border-b-2 border-indigo-600">
            Chats
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium text-gray-500 hover:text-gray-700">
            Contacts
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer mb-1 ${selectedChat?.id === chat.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setSelectedChat(chat);
                  // In a real app, you'd fetch messages for this chat
                  setMessages([
                    {
                      id: '1',
                      sender: 'You',
                      content: 'Hello there! 😊',
                      time: '10:25 AM',
                      isOwn: true,
                      reactions: { '👍': [user.id], '❤️': ['2'] },
                      status: 'read',
                      deliveredTo: [user?.id, '2'],
                      readBy: [user?.id, '2']
                    },
                    {
                      id: '2',
                      sender: chat.name,
                      content: 'Hi! How are you?',
                      time: '10:26 AM',
                      isOwn: false,
                      reactions: { '😂': [user.id] },
                      status: 'delivered',
                      deliveredTo: [user?.id],
                      readBy: [],
                      fileUrl: '/images/demo.jpg',
                      isImage: true
                    },
                    {
                      id: '3',
                      sender: 'You',
                      content: 'I\'m doing great, thanks!',
                      time: '10:27 AM',
                      isOwn: true,
                      reactions: {},
                      status: 'delivered',
                      deliveredTo: [user?.id, '2'],
                      readBy: ['2']
                    },
                    {
                      id: '4',
                      sender: chat.name,
                      content: 'That\'s awesome to hear!',
                      time: '10:28 AM',
                      isOwn: false,
                      reactions: { '❤️': [user.id, '2'] },
                      status: 'read',
                      deliveredTo: [user?.id],
                      readBy: [user?.id],
                      fileName: 'document.pdf',
                      fileSize: 1024000
                    },
                  ]);
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {chat.name.charAt(0).toUpperCase()}
                  </div>
                  {chat.isGroup ? (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      <Users size={12} />
                    </div>
                  ) : null}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-indigo-500 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          {selectedChat ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                  {selectedChat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isGroup ? 'Online members' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Settings size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <MessageSquare size={20} className="text-gray-500" />
              </div>
              <p className="font-semibold text-gray-900">Select a chat</p>
            </div>
          )}
        </div>

        {/* Search Filters */}
        {showSearch && (
          <SearchFilters
            filters={searchFilters}
            setFilters={setSearchFilters}
            onSearch={handleSearch}
          />
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
          <div className="max-w-3xl mx-auto">
            {selectedChat ? (
              <>
                {(showSearch ? filteredMessages : messages).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 group relative ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${msg.isOwn
                        ? 'bg-indigo-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                        }`}
                    >
                      {msg.content && <p className="text-sm">{msg.content}</p>}

                      {msg.fileUrl && (
                        <div className="mt-2">
                          {msg.isImage ? (
                            <div className="mt-2">
                              <img
                                src={msg.fileUrl}
                                alt="Uploaded"
                                className="max-w-full h-auto rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center p-2 bg-gray-100 rounded-lg">
                              <File className="text-gray-500 mr-2" size={16} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{msg.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  {(msg.fileSize / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-xs ${msg.isOwn ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                        >
                          {msg.time}
                        </p>
                        {msg.isOwn && renderMessageStatus(msg)}
                      </div>

                      {msg.reactions && renderReactions(msg.reactions)}

                      {/* Reaction picker button */}
                      <div className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                          className={`text-xs p-1 rounded-full ${msg.isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                          <Smile size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Reaction picker */}
                    {showReactionPicker === msg.id && (
                      <div className="absolute bottom-0 right-0 transform translate-x-full">
                        <ReactionPicker
                          onReact={handleReaction}
                          messageId={msg.id}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="flex mb-4 justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white text-gray-800 rounded-tl-none shadow-sm">
                      <p className="text-sm text-gray-500 italic">Typing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare size={64} className="mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Select a chat to start messaging</h3>
                  <p className="mt-1 text-gray-500">Choose from your existing conversations</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 relative">
          <div className="max-w-3xl mx-auto">
            {/* Selected file preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  ) : (
                    <File className="text-gray-500 mr-3" size={24} />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeSelectedFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}

            <div className="flex items-center relative">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx,.txt,.xls,.xlsx"
                />
              </button>
              <button
                onClick={toggleEmojiPicker}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
              >
                <Smile size={20} />
              </button>
              <div className="flex-1 mx-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={(!message.trim() && !selectedFile) || uploading}
                className={`p-2 rounded-full ${(message.trim() || selectedFile) && !uploading
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef}>
                <EmojiPicker
                  onSelect={addEmoji}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact/Contact Info Panel - Shown when viewing contact info */}
      <div className="hidden md:block w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mx-auto text-2xl">
            {selectedChat?.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="mt-3 font-semibold text-gray-900">{selectedChat?.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedChat?.isGroup ? 'Group Chat' : 'Online'}
          </p>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-2">About</h4>
          <p className="text-sm text-gray-600">
            {selectedChat?.isGroup
              ? 'This is a group conversation with multiple participants.'
              : 'This contact has shared their profile with you.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;