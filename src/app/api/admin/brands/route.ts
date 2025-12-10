import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - List all brands with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { tiktokShopName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get brands with pagination
    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        include: {
          _count: {
            select: {
              outreachEmails: true,
              products: true,
            },
          },
          outreachEmails: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: [
          { priority: 'desc' },
          { updatedAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.brand.count({ where }),
    ]);

    // Get pipeline stats
    const stats = await prisma.brand.groupBy({
      by: ['status'],
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        brands,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: stats.reduce((acc, s) => {
          acc[s.status] = s._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error('Get brands error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// POST - Create new brand
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      tiktokSellerId,
      tiktokShopName,
      category,
      contactName,
      contactEmail,
      contactPhone,
      website,
      tiktokHandle,
      followerCount,
      productCount,
      avgRating,
      currentOpenRate,
      targetRate,
      priority,
      notes,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        tiktokSellerId,
        tiktokShopName,
        category,
        contactName,
        contactEmail,
        contactPhone,
        website,
        tiktokHandle,
        followerCount: followerCount || 0,
        productCount: productCount || 0,
        avgRating,
        currentOpenRate,
        targetRate,
        priority: priority || 'MEDIUM',
        notes,
        status: 'LEAD',
      },
    });

    return NextResponse.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}

// PATCH - Update brand
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // If status is changing to CONTACTED, update lastContactedAt
    if (updateData.status === 'CONTACTED' && !updateData.lastContactedAt) {
      updateData.lastContactedAt = new Date();
    }

    // If status is changing to AGREED, ensure agreedRate is set
    if (updateData.status === 'AGREED' && !updateData.agreedRate && updateData.targetRate) {
      updateData.agreedRate = updateData.targetRate;
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error('Update brand error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE - Delete brand
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Brand deleted',
    });
  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
