import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '../auth/route';

export async function GET(request: NextRequest) {
    console.log('Search API called');
    try {
        const user = await authenticateUser(request);
        console.log('User authenticated:', user?.id);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        console.log('Search query:', query);

        if (!query) {
            return NextResponse.json([]);
        }

        console.log('Executing Prisma query...');
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive'
                },
                id: {
                    not: user.id // Exclude self
                }
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                isOnline: true
            },
            take: 10
        });
        console.log('Prisma query result:', users);

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
