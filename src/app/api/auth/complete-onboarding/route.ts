// src/app/api/auth/complete-onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // getServerSession will read cookies from the incoming request context
    // If your NextAuth version requires calling getServerSession with req/res, adjust accordingly.
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
      select: { id: true, onboardingCompleted: true },
    });

    return NextResponse.json({ ok: true, onboardingCompleted: updated.onboardingCompleted });
  } catch (err: any) {
    console.error('Error completing onboarding:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}