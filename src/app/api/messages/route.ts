import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '../auth/route';

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ message: 'Chat ID is required' }, { status: 400 });
        }

        // Verify membership
        const membership = await prisma.chatMembership.findUnique({
            where: {
                userId_chatId: {
                    userId: user.id,
                    chatId: chatId
                }
            }
        });

        if (!membership) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        // Transform to match frontend expectation
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            sender: msg.sender.username,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: msg.senderId === user.id,
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            isImage: msg.fileType?.startsWith('image/') || false,
            reactions: {}, // TODO: Implement reactions
            status: 'read', // TODO: Implement status
            deliveredTo: msg.deliveredTo,
            readBy: msg.readBy
        }));

        return NextResponse.json(formattedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await authenticateUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { chatId, content, fileUrl, fileName, fileSize, fileType } = await request.json();

        if (!chatId || (!content && !fileUrl)) {
            return NextResponse.json({ message: 'Chat ID and content/file are required' }, { status: 400 });
        }

        // Verify membership
        const membership = await prisma.chatMembership.findUnique({
            where: {
                userId_chatId: {
                    userId: user.id,
                    chatId: chatId
                }
            }
        });

        if (!membership) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                chatId,
                senderId: user.id,
                content: content || '',
                fileUrl,
                fileName,
                fileSize,
                fileType,
                messageType: fileUrl ? (fileType?.startsWith('image/') ? 'image' : 'file') : 'text'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        // Update chat updated_at
        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
