import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Secret key for JWT - in production use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret';

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
};

export const authenticateUser = async (req: NextRequest): Promise<UserPayload | null> => {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }

  const token = req.cookies.get('token')?.value;
  if (token) {
    return verifyToken(token);
  }

  return null;
};

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  try {
    const { email, password, username } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (type === 'register') {
      // Registration logic
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return NextResponse.json({
          message: existingUser.email === email ? 'Email already exists' : 'Username already taken'
        }, { status: 409 });
      }

      if (!username) {
        return NextResponse.json({ message: 'Username is required' }, { status: 400 });
      }

      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword
        }
      });

      // Create user status
      await prisma.userStatus.create({
        data: {
          userId: user.id,
          status: 'online'
        }
      });

      const token = signToken({ id: user.id, username: user.username, email: user.email });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      const response = NextResponse.json({
        message: 'User created successfully',
        user: userWithoutPassword,
        token
      }, { status: 201 });

      response.cookies.set('token', token, {
        httpOnly: false, // Allow client to read if needed, but better to use httpOnly=true and let middleware handle it. 
        // However, AuthContext reads from localStorage. 
        // Let's make it httpOnly=false so client can read it if needed, or just rely on response body.
        // Middleware needs it.
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;

    } else if (type === 'login') {
      // Login logic
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !await verifyPassword(password, user.password)) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }

      // Update last seen and status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastSeen: new Date(),
          isOnline: true
        }
      });

      await prisma.userStatus.upsert({
        where: { userId: user.id },
        update: { status: 'online', lastSeen: new Date() },
        create: { userId: user.id, status: 'online' }
      });

      const token = signToken({ id: user.id, username: user.username, email: user.email });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      const response = NextResponse.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      }, { status: 200 });

      response.cookies.set('token', token, {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;

    } else {
      return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}