import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import type { Session } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    const userEmail = session.user.email as string | undefined;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: 'No user identifier available in session' }, { status: 400 });
    }

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { onboardingCompleted: true },
        });
      } catch (err: any) {
        if (err?.code !== 'P2025') {
          console.error('complete-onboarding update error:', err);
          return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
        }
      }
    } else if (userEmail) {
      const existing = await prisma.user.findFirst({ where: { email: userEmail }, select: { id: true } });
      if (!existing) {
        return NextResponse.json({ error: 'User record not found for this session' }, { status: 404 });
      }
      await prisma.user.update({
        where: { id: existing.id },
        data: { onboardingCompleted: true },
      });
    }

    // Return success response
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('complete-onboarding outer error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}