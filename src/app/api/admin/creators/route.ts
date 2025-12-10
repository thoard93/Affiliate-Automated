import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - List all creators (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.user = { status };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { discordUsername: { contains: search, mode: 'insensitive' } },
        { tiktokUsername: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get creators with pagination
    const [creators, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              status: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              showcaseItems: true,
              commissionEvents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.creator.count({ where }),
    ]);

    // Calculate stats for each creator
    const creatorsWithStats = await Promise.all(
      creators.map(async (creator) => {
        const earnings = await prisma.commissionEvent.aggregate({
          where: { creatorId: creator.id },
          _sum: { commissionAmount: true },
        });

        return {
          ...creator,
          totalEarnings: earnings._sum.commissionAmount || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        creators: creatorsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get creators error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}

// PATCH - Update creator status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { creatorId, status, action } = body;

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Get creator
    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    if (action === 'approve') {
      await prisma.user.update({
        where: { id: creator.userId },
        data: { status: 'APPROVED' },
      });

      return NextResponse.json({
        success: true,
        message: 'Creator approved successfully',
      });
    }

    if (action === 'reject') {
      await prisma.user.update({
        where: { id: creator.userId },
        data: { status: 'REJECTED' },
      });

      return NextResponse.json({
        success: true,
        message: 'Creator rejected',
      });
    }

    if (action === 'suspend') {
      await prisma.user.update({
        where: { id: creator.userId },
        data: { status: 'SUSPENDED' },
      });

      return NextResponse.json({
        success: true,
        message: 'Creator suspended',
      });
    }

    // Generic status update
    if (status) {
      await prisma.user.update({
        where: { id: creator.userId },
        data: { status },
      });

      return NextResponse.json({
        success: true,
        message: `Creator status updated to ${status}`,
      });
    }

    return NextResponse.json(
      { error: 'No valid action specified' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update creator error:', error);
    return NextResponse.json(
      { error: 'Failed to update creator' },
      { status: 500 }
    );
  }
}
