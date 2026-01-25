// src/app/api/auth/check-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

type CheckBody = {
  email?: string;
  // If true, create a user record when none exists (optional). If password is provided it will be hashed.
  createIfMissing?: boolean;
  name?: string | null;
  image?: string | null;
  password?: string | null;
};

/**
 * POST /api/auth/check-account
 *
 * Body: { email: string, createIfMissing?: boolean, name?: string, image?: string, password?: string }
 *
 * Response:
 *  { exists: boolean, hasPassword: boolean, onboardingCompleted: boolean, id?: string, created?: boolean }
 *
 * If createIfMissing is true and no user exists, this route will create a user row.
 * If a user exists but has no password and `password` is provided, this route will set the password.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as CheckBody;
    let { email, createIfMissing, name, image, password } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }
    email = email.toLowerCase().trim();
    name = typeof name === 'string' && name.trim() ? name.trim() : email.split('@')[0];
    image = typeof image === 'string' && image.trim() ? image.trim() : null;
    password = typeof password === 'string' && password ? password : undefined;

    // find existing user row
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true, password: true, onboardingCompleted: true },
    });

    // If user exists, optionally set password if provided and missing
    if (user) {
      if (password && !user.password) {
        // validate password length
        if (password.length < 8) {
          return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed },
        });

        return NextResponse.json({
          exists: true,
          hasPassword: true,
          onboardingCompleted: user.onboardingCompleted ?? false,
          id: user.id,
          passwordSet: true,
        });
      }

      return NextResponse.json({
        exists: true,
        hasPassword: Boolean(user.password),
        onboardingCompleted: user.onboardingCompleted ?? false,
        id: user.id,
      });
    }

    // No user found:
    if (!createIfMissing) {
      return NextResponse.json({ exists: false, hasPassword: false, onboardingCompleted: false });
    }

    // create user if requested
    let passwordHash: string | null = null;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      passwordHash = await bcrypt.hash(password, 12);
    }

    try {
      const created = await prisma.user.create({
        data: {
          email,
          name,
          image: image ?? null,
          password: passwordHash,
          role: 'client',
          onboardingCompleted: false,
        },
        select: { id: true, onboardingCompleted: true },
      });

      return NextResponse.json({
        exists: true,
        created: true,
        hasPassword: Boolean(passwordHash),
        onboardingCompleted: created.onboardingCompleted ?? false,
        id: created.id,
      });
    } catch (err: any) {
      // handle unique constraint race
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const raced = await prisma.user.findFirst({
          where: { email },
          select: { id: true, password: true, onboardingCompleted: true },
        });
        return NextResponse.json({
          exists: Boolean(raced),
          created: false,
          hasPassword: Boolean(raced?.password),
          onboardingCompleted: raced?.onboardingCompleted ?? false,
          id: raced?.id,
        });
      }
      console.error('check-account create error:', err);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (err) {
    console.error('check-account error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET /api/auth/check-account?email=...
 * Convenience for debugging / direct browser checks.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Missing email query param' }, { status: 400 });
    }
    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: { email: normalized },
      select: { id: true, password: true, onboardingCompleted: true },
    });

    return NextResponse.json({
      exists: Boolean(user),
      hasPassword: Boolean(user?.password),
      onboardingCompleted: user?.onboardingCompleted ?? false,
      id: user?.id,
    });
  } catch (err) {
    console.error('check-account GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}