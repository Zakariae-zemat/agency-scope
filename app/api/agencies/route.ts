import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const limit = Number(searchParams.get('limit')) || 20;
    const pageSize = limit;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { county: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        state ? { state: { equals: state, mode: 'insensitive' as const } } : {},
      ],
    };

    const agencies = await prisma.agency.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    return NextResponse.json({ agencies });
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 });
  }
}
