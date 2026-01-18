import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_TOKEN = process.env.CALENDLY_API_TOKEN;

export async function POST(request: Request) {
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

    const body = await request.json();
    const { eventUri, reason } = body;

    if (!eventUri) {
      return NextResponse.json(
        { error: 'Event URI is required' },
        { status: 400 }
      );
    }

    // Cancel the event
    const response = await fetch(
      `${CALENDLY_API_BASE}/scheduled_events/${eventUri.split('/').pop()}/cancellation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason || 'Cancelled by user',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || 'Failed to cancel event');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Event cancelled successfully',
      data,
    });
  } catch (error: any) {
    console.error('Cancel event error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to cancel event' },
      { status: 500 }
    );
  }
}
