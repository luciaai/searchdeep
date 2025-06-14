import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user-credits';

// Ensure this route is always dynamic; no static generation
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateUser();
    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error('credits route error', err);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
