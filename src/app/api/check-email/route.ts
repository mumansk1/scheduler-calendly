import { NextRequest, NextResponse } from 'next/server';

// Dummy example: replace with your real user lookup logic
const existingUsers = ['user1@example.com', 'user2@example.com'];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const exists = existingUsers.includes(email.toLowerCase());

    return NextResponse.json({ exists });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}