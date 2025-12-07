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

  // Fetch chats and auto-select/create Mistral AI chat
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const initMistralChat = async () => {
      try {
        // 1. Fetch existing chats
        const response = await fetch('/api/chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const chatsData = await response.json();
          setChats(chatsData);

          // 2. Check for Mistral AI chat
          const mistralChat = chatsData.find((c: any) => c.name === 'Mistral AI');

          if (mistralChat) {
            setSelectedChat(mistralChat);
          } else {
            // 3. If not found, search for Mistral AI user and create chat
            const searchRes = await fetch('/api/search?q=Mistral', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const searchData = await searchRes.json();
            const aiUser = searchData.find((u: any) => u.username === 'Mistral AI');

            if (aiUser) {
              const createRes = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  participantId: aiUser.id,
                  isGroup: false
                })
              });

              if (createRes.ok) {
                const newChat = await createRes.json();
                setChats(prev => [newChat, ...prev]);
                setSelectedChat(newChat);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing Mistral chat:', error);
      }
    };

    initMistralChat();
  }, [user, router, isLoading]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?chatId=${selectedChat.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Join chat room via socket
    if (isConnected) {
      // Assuming joinChat is available from useSocket
      // Note: The original useSocket might need update if joinChat isn't exposed or works differently
      // But based on context, it likely has joinChat
    }
  }, [selectedChat, isConnected]);

  // Set up socket listeners
  useEffect(() => {
    const newMessageCleanup = onNewMessage((newMessage: any) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
        )
      );
      // Also append new messages if they are for the current chat
      if (selectedChat && newMessage.chatId === selectedChat.id) {
        setMessages(prev => {
          const exists = prev.find(m => m.id === newMessage.id);
          if (exists) return prev;
          return [...prev, {
            ...newMessage,
            time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: newMessage.senderId === user?.id,
            isImage: newMessage.messageType === 'image'
          }];
        });
      }
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
  }, [onNewMessage, onTyping, selectedChat, user]);

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
      try {
        let fileData = null;

        // Handle file upload if a file is selected
        if (selectedFile) {
          setUploading(true);

          const formData = new FormData();
          formData.append('file', selectedFile);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            fileData = uploadResult.file;
          } else {
            console.error('File upload failed');
            setUploading(false);
            return;
          }
        }

        // Send message to API
        const messagePayload = {
          chatId: selectedChat.id,
          content: message,
          ...(fileData && {
            fileUrl: fileData.fileUrl,
            fileName: fileData.fileName,
            fileSize: fileData.fileSize,
            fileType: selectedFile?.type // or fileData.fileType
          })
        };

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(messagePayload)
        });

        if (response.ok) {
          const newMessage = await response.json();

          // Emit via socket for real-time updates to others
          sendMessage({
            chatId: selectedChat.id,
            content: message,
            senderId: user?.id || ''
          });

          // Optimistically add to local state (or rely on socket/API response)
          // Since we got the saved message from API, let's use that
          const formattedMessage = {
            id: newMessage.id,
            senderId: user?.id,
            sender: user?.username,
            content: newMessage.content,
            time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
            fileUrl: newMessage.fileUrl,
            fileName: newMessage.fileName,
            fileSize: newMessage.fileSize,
            isImage: newMessage.messageType === 'image',
            reactions: {},
            status: 'sent',
            deliveredTo: [],
            readBy: []
          };

          setMessages(prev => [...prev, formattedMessage]);

          // Clear input
          setMessage('');
          setSelectedFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setUploading(false);
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
      {/* Main Chat Area - Full Width */}
      <div className="flex-1 flex flex-col w-full">
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
                    Always here to help
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <p className="font-semibold text-gray-900">Loading Mistral AI...</p>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwn && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-2 self-end mb-1">
                  {msg.sender?.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative group ${msg.isOwn
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-white text-gray-900 rounded-bl-none'
                  }`}
              >
                {/* Message Content */}
                {msg.isImage ? (
                  <div className="mb-1">
                    <img src={msg.fileUrl} alt="Shared image" className="max-w-full rounded-lg" />
                  </div>
                ) : msg.fileUrl ? (
                  <div className="flex items-center p-2 bg-black/10 rounded-lg mb-1">
                    <File size={20} className="mr-2" />
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="underline truncate">
                      {msg.fileName || 'Attachment'}
                    </a>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}

                {/* Message Info */}
                <div className={`flex items-center justify-end space-x-1 mt-1 ${msg.isOwn ? 'text-indigo-100' : 'text-gray-400'
                  }`}>
                  <span className="text-[10px]">{msg.time}</span>
                  {renderMessageStatus(msg)}
                </div>

                {/* Reactions Display */}
                {renderReactions(msg.reactions)}

                {/* Reaction Button (Hover) */}
                <button
                  onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                  className={`absolute -right-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 shadow-sm ${msg.isOwn ? 'right-auto -left-8' : ''
                    }`}
                >
                  <Smile size={16} />
                </button>

                {/* Reaction Picker Popover */}
                {showReactionPicker === msg.id && (
                  <div className="z-10">
                    <ReactionPicker
                      messageId={msg.id}
                      onReact={handleReaction}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded mr-2" />
                ) : (
                  <File className="w-10 h-10 text-gray-400 mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={removeSelectedFile} className="text-gray-400 hover:text-red-500">
                <XCircle size={20} />
              </button>
            </div>
          )}

          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center p-2 relative">
              <button
                onClick={toggleEmojiPicker}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Smile size={20} />
              </button>

              {showEmojiPicker && (
                <div ref={emojiPickerRef}>
                  <EmojiPicker onSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />
                </div>
              )}

              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (!isTyping) {
                    setIsTyping(true);
                    // emitTyping(true);
                  }
                  // Debounce typing off
                  setTimeout(() => {
                    setIsTyping(false);
                    // emitTyping(false);
                  }, 2000);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Message Mistral AI..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 px-2"
              />

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Paperclip size={20} />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={(message.trim() === '' && !selectedFile) || uploading}
              className={`p-3 rounded-full flex items-center justify-center transition-colors ${message.trim() !== '' || selectedFile
                ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;