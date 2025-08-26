import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export interface AuthPayload {
  id: number;
  username: string;
}

// Verify a JWT token and return the payload
export function verifyToken(token: string): AuthPayload | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    return payload;
  } catch (err) {
    return null;
  }
}

// Helper to protect API routes
export function requireAuth(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authorizationHeader.replace('Bearer ', '');
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return user;
}
