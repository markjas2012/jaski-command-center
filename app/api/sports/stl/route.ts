import { NextResponse } from 'next/server';
import { getStLouisTeams } from '@/lib/sports-reliability';

export const dynamic = 'force-dynamic';

export async function GET() {
  const teams = await getStLouisTeams();
  return NextResponse.json(
    { teams, generatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
  );
}
