import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
interface AuthUser {
  id: number;
  username: string;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? undefined;
  const userOrResponse = requireAuth(authHeader);
  if ('status' in userOrResponse) return userOrResponse;

  const messages = await prisma.message.findMany({
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(messages);
}


export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? undefined;
  const user = requireAuth(authHeader);
  if (!(user as AuthUser).id) return user as NextResponse;

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: 'Message content required' }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      content,
      senderId: (user as AuthUser).id
    },
    include: { sender: true }
  });

  return NextResponse.json(message);
}
