// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let { email, password, name } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    email = String(email).toLowerCase().trim();
    name = typeof name === 'string' ? name.trim() : email.split('@')[0];

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Try to find an existing user by email. Use findFirst to be tolerant if schema isn't unique.
    const existingUser = await prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true, password: true, onboardingCompleted: true },
    });

    // If a user exists and already has a password -> can't sign up (account exists)
    if (existingUser && existingUser.password) {
      return NextResponse.json(
        { alreadyExists: true, message: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // If user exists but has no password (OAuth-only), set the password (convert to credentials)
    if (existingUser && !existingUser.password) {
      try {
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            // Keep onboardingCompleted as-is; don't override
          },
          select: { id: true, email: true, name: true },
        });

        return NextResponse.json(
          {
            message: 'Password set for existing user. Account can now sign in with credentials.',
            user: { id: updated.id, email: updated.email, name: updated.name },
          },
          { status: 200 }
        );
      } catch (updateErr: any) {
        console.error('Error setting password on existing user:', updateErr);
        return NextResponse.json({ error: 'Failed to set password' }, { status: 500 });
      }
    }

    // No existing user -> create new user with hashed password
    try {
      const created = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'client',
          onboardingCompleted: false,
        },
        select: { id: true, email: true, name: true },
      });

      return NextResponse.json(
        {
          message: 'User created successfully',
          user: { id: created.id, email: created.email, name: created.name },
        },
        { status: 201 }
      );
    } catch (createErr: any) {
      // Handle rare race where another process created the user concurrently
      if (createErr instanceof Prisma.PrismaClientKnownRequestError && createErr.code === 'P2002') {
        // Try to update the existing record with a password if it doesn't have one
        const raced = await prisma.user.findFirst({ where: { email }, select: { id: true, password: true } });
        if (raced && !raced.password) {
          try {
            const updated = await prisma.user.update({
              where: { id: raced.id },
              data: { password: hashedPassword },
              select: { id: true, email: true, name: true },
            });
            return NextResponse.json(
              {
                message: 'Password set for existing user (race).',
                user: { id: updated.id, email: updated.email, name: updated.name },
              },
              { status: 200 }
            );
          } catch (raceUpdateErr: any) {
            console.error('Race update error:', raceUpdateErr);
            return NextResponse.json({ error: 'Failed to set password after race' }, { status: 500 });
          }
        }

        return NextResponse.json({ alreadyExists: true, message: 'User already exists' }, { status: 409 });
      }

      console.error('Signup create error:', createErr);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}