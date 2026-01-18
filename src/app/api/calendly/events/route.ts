import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_TOKEN = process.env.CALENDLY_API_TOKEN;

export async function GET(request: Request) {
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

    // First, get the current user's URI from Calendly
    const userResponse = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Calendly user');
    }

    const userData = await userResponse.json();
    const userUri = userData?.resource?.uri;

    if (!userUri) {
      return NextResponse.json(
        { error: 'Could not find Calendly user URI' },
        { status: 500 }
      );
    }

    // Now fetch scheduled events
    const { searchParams } = new URL(request.url);
    const minStartTime = searchParams.get('min_start_time');
    const maxStartTime = searchParams.get('max_start_time');
    const status = searchParams.get('status') || 'active';

    const params = new URLSearchParams({
      user: userUri,
      status,
      count: '100',
    });

    if (minStartTime) {
      params.append('min_start_time', minStartTime);
    }
    if (maxStartTime) {
      params.append('max_start_time', maxStartTime);
    }

    const eventsResponse = await fetch(
      `${CALENDLY_API_BASE}/scheduled_events?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!eventsResponse.ok) {
      throw new Error('Failed to fetch Calendly events');
    }

    const eventsData = await eventsResponse.json();

    // Fetch invitees for each event
    const eventsWithInvitees = await Promise.all(
      (eventsData?.collection || []).map(async (event: any) => {
        try {
          const inviteesResponse = await fetch(
            `${CALENDLY_API_BASE}/scheduled_events/${event.uri.split('/').pop()}/invitees`,
            {
              headers: {
                'Authorization': `Bearer ${CALENDLY_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (inviteesResponse.ok) {
            const inviteesData = await inviteesResponse.json();
            return {
              ...event,
              invitees: inviteesData?.collection || [],
            };
          }
        } catch (error) {
          console.error('Error fetching invitees:', error);
        }
        return { ...event, invitees: [] };
      })
    );

    return NextResponse.json({
      events: eventsWithInvitees,
      pagination: eventsData?.pagination || {},
    });
  } catch (error: any) {
    console.error('Calendly events error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
