// utils/socketManager.ts
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io('http://localhost:3000', {
      path: '/api/socket/io',
      transports: ['websocket', 'polling'],
    });

    this.userId = userId;
    
    this.socket.on('connect', () => {
      console.log('Connected to socket server with ID:', this.socket?.id);
      // Join user-specific room
      if (this.socket && this.userId) {
        this.socket.emit('join', this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketManager = new SocketManager();