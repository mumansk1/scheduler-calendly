import { NextRequest, NextResponse } from 'next/server';
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
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, onboardingCompleted: true } });
    return NextResponse.json({ exists: Boolean(user), onboardingCompleted: user?.onboardingCompleted ?? false }, { status: 200 });
  } catch (err) {
    console.error('api/user/check POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// optional GET for quick browser checks
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = normalizeEmail(url.searchParams.get('email') ?? undefined);
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, onboardingCompleted: true } });
    return NextResponse.json({ exists: Boolean(user), onboardingCompleted: user?.onboardingCompleted ?? false }, { status: 200 });
  } catch (err) {
    console.error('api/user/check GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}