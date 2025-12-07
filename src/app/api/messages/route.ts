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
        const formattedMessages = messages.map((msg: any) => ({
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

        // AI Integration Logic
        // Check if this chat involves the AI user
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { members: { include: { user: true } } }
        });

        const aiMember = chat?.members.find((m: any) => m.user.email === 'ai@mistral.com');

        if (aiMember && aiMember.userId !== user.id) {
            // It's a chat with AI, and the sender is not the AI (avoid loops)

            // Trigger AI response asynchronously (fire and forget for API response speed,
            // but in serverless/Next.js this might be cut off.
            // Ideally use a queue or await it if it's fast enough. Mistral is usually fast.
            // Let's await it to ensure it's sent.)

            (async () => {
                try {
                    const { getMistralResponse } = await import('@/lib/mistral');

                    // Fetch last few messages for context
                    const history = await prisma.message.findMany({
                        where: { chatId },
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    });

                    // Format history for Mistral (reverse to chronological)
                    const formattedHistory = history.reverse().map((msg: any) => ({
                        role: msg.senderId === aiMember.userId ? 'assistant' as const : 'user' as const,
                        content: msg.content
                    }));

                    // Remove the very last message (which is the one we just saved) from history
                    // because we pass it as the 'message' argument to getMistralResponse
                    // Actually getMistralResponse takes (message, history).
                    // So history should NOT include the current message.
                    const context = formattedHistory.slice(0, -1);

                    const response = await getMistralResponse(content || 'Shared a file', context);
                    const aiResponseContent = typeof response === 'string' ? response : JSON.stringify(response);

                    // Save AI response
                    await prisma.message.create({
                        data: {
                            chatId,
                            senderId: aiMember.userId,
                            content: aiResponseContent || "I'm speechless.",
                            messageType: 'text'
                        }
                    });

                    // We rely on polling or socket to deliver this to the user.
                    // Since we don't have a full socket server integration in this route yet (it's client-side mostly),
                    // the user will see it on next poll or refresh.
                    // Ideally we'd emit here.
                } catch (error) {
                    console.error('Error generating AI response:', error);
                }
            })();
        }

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
