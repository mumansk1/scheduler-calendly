// src/app/api/auth/set-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import type { Session } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    // getServerSession using authOptions (App Router route)
    const session: Session | null = await getServerSession(authOptions as any);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json().catch(() => ({}));
    const newPassword = (body?.password || '').toString();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const saltRounds = 12;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    // Update the authenticated user's password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('set-password error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}