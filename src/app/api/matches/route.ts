// app/api/matches/route.ts
import { NextResponse } from 'next/server';
import { buildMatches } from '@/lib/match-utils';
import { PEOPLE } from '@/data/mock-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectedIds, dayIndex } = body;

    // Validation
    if (!Array.isArray(selectedIds) || typeof dayIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // Use the isolated logic to find matches
    // We pass { use12Hour: true } to keep your preferred "9:00 AM - 10:00 AM" format
    const matches = buildMatches(PEOPLE, selectedIds, dayIndex, { use12Hour: true });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Match API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}