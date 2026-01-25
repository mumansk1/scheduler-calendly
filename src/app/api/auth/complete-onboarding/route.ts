import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import type { Session } from 'next-auth';

export async function POST(req: NextRequest) {
  // Tell TypeScript the session is of type Session or null
  const session: Session | null = await getServerSession(authOptions as any);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
      select: { id: true, onboardingCompleted: true },
    });

    return NextResponse.json({ ok: true, onboardingCompleted: updated.onboardingCompleted });
  } catch (err) {
    console.error('Error completing onboarding:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}