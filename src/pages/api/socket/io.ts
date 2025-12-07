import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: any & {
        server: NetServer & {
            io: ServerIO;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('join', (userId: string) => {
                socket.join(userId);
                console.log(`User ${userId} joined their room`);
            });

            socket.on('send-message', (message) => {
                console.log('Message received:', message);
                // Broadcast to receiver
                // In a real app, we would save to DB here or in an API route
                // and then emit the message to the chat room or specific user

                // For now, just echo back or broadcast to a room if we had one
                // socket.to(chatId).emit('new-message', message);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
};

export default ioHandler;
