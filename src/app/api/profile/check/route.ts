// app/api/profile/check/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const userId = session.user.id;

    // Only select fields you know exist. We'll not assume onboardingCompleted exists.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        // If you have a field for onboarding, add it here, e.g. onboardingCompleted: true
      },
    });

    return NextResponse.json({
      exists: !!user?.id,
      // If you have onboarding info, return it as onboarding_completed: boolean
    }, { status: 200 });
  } catch (err) {
    console.error('profile check error', err);
    return NextResponse.json({ exists: false }, { status: 200 });
  }
}