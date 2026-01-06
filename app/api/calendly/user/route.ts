import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_TOKEN = process.env.CALENDLY_API_TOKEN;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!CALENDLY_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly API token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Calendly user');
    }

    const data = await response.json();

    return NextResponse.json({
      user: data?.resource || {},
    });
  } catch (error: any) {
    console.error('Calendly user error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
