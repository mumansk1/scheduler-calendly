import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

function normalizeEmail(raw?: unknown) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  return s ? s.toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail((body as any)?.email);
    const name = typeof (body as any)?.name === 'string' ? (body as any).name.trim() : undefined;
    const image = typeof (body as any)?.image === 'string' ? (body as any).image.trim() : undefined;
    const password = typeof (body as any)?.password === 'string' ? (body as any).password : undefined;

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    // If exists, optionally set password
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, password: true } });
    if (existing) {
      if (password && !existing.password) {
        if (password.length < 8) return NextResponse.json({ error: 'Password must be >=8' }, { status: 400 });
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.update({ where: { id: existing.id }, data: { password: hashed } });
      }
      return NextResponse.json({ ok: true, exists: true, id: existing.id }, { status: 200 });
    }

    let passwordHash: string | null = null;
    if (password) {
      if (password.length < 8) return NextResponse.json({ error: 'Password must be >=8' }, { status: 400 });
      passwordHash = await bcrypt.hash(password, 12);
    }

    try {
      const created = await prisma.user.create({
        data: {
          email,
          name: name ?? email.split('@')[0],
          image: image ?? null,
          password: passwordHash,
          role: 'client',
          onboardingCompleted: false,
        },
        select: { id: true },
      });
      return NextResponse.json({ ok: true, created: true, id: created.id }, { status: 201 });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const raced = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        return NextResponse.json({ ok: true, exists: true, id: raced?.id }, { status: 200 });
      }
      console.error('api/user/create error:', err);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (err) {
    console.error('api/user/create outer error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}