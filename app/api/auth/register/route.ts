import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest){
    const body = await req.json();
  const { name, username, password } = body;
  if (!name || !username || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, username, password: hashedPassword },
    });
    return NextResponse.json({ id: user.id, username: user.username, name: user.name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server error' }, { status: 500 });
  }
}