import { NextResponse } from 'next/server';
import { getStLouisTeams } from '@/lib/sports-reliability';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const teams = await getStLouisTeams();
  return NextResponse.json(
    { teams, generatedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'X-Jaski-Sprint': '14.7',
      },
    }
  );
}
