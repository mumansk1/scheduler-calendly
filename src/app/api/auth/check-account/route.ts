// src/app/api/auth/check-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const emailRaw = body?.email;
    const name = body?.name ?? null;
    const image = body?.image ?? null;

    if (!emailRaw || typeof emailRaw !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const email = emailRaw.toLowerCase().trim();

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        onboardingCompleted: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    });

    // If user doesn't exist, create them
    let created = false;
    if (!user) {
      created = true;
      const createdUser = await prisma.user.create({
        data: {
          email,
          name,
          image,
          role: 'client',
          onboardingCompleted: false,
        },
        select: {
          id: true,
          onboardingCompleted: true,
          email: true,
          name: true,
          image: true,
          role: true,
        },
      });
      user = createdUser;
    }

    return NextResponse.json(
      {
        exists: true,
        created,
        userId: user?.id ?? null,
        onboardingCompleted: user?.onboardingCompleted ?? false,
        user: user ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/auth/check-account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}