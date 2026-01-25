// app/api/profile/check/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Tell TS what to expect from getServerSession
    const session = (await getServerSession(authOptions as any)) as Session | null;

    // Guard early if there is no session or no user id
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, onboardingCompleted: true }, // adjust field if different
    });

    return NextResponse.json({
      exists: !!user,
      onboarding_completed: user?.onboardingCompleted ?? false,
    }, { status: 200 });
  } catch (err) {
    console.error('profile check error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}