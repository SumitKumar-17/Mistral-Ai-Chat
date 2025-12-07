'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { socketManager } from '@/utils/socketManager';

interface SocketContextType {
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (data: { chatId: string; content: string; senderId: string }) => void;
  sendPrivateMessage: (data: { receiverId: string; content: string; senderId: string }) => void;
  onNewMessage: (callback: (message: any) => void) => (() => void) | void;
  onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => (() => void) | void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to Socket.IO server
      const socket = socketManager.connect(user.id);

      const handleConnect = () => {
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      // Clean up on unmount
      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socketManager.disconnect();
      };
    }
  }, [user]);

  const joinChat = (chatId: string) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('joinChat', chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('leaveChat', chatId);
    }
  };

  const sendMessage = (data: { chatId: string; content: string; senderId: string }) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('groupMessage', data);
    }
  };

  const sendPrivateMessage = (data: { receiverId: string; content: string; senderId: string }) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('privateMessage', data);
    }
  };

  const onNewMessage = (callback: (message: any) => void) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.on('newGroupMessage', callback);
      return () => socket.off('newGroupMessage', callback);
    }
    return undefined;
  };

  const onTyping = (callback: (data: { userId: string; isTyping: boolean }) => void) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.on('userTyping', callback);
      return () => socket.off('userTyping', callback);
    }
    return undefined;
  };

  const value = {
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    sendPrivateMessage,
    onNewMessage,
    onTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};