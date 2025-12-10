import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'bonusRate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const freeSampleOnly = searchParams.get('freeSample') === 'true';

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
    };

    if (category && category !== 'All Categories') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (freeSampleOnly) {
      where.freeSampleAvailable = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'bonusRate':
        orderBy = { bonusRate: sortOrder };
        break;
      case 'price':
        orderBy = { priceMin: sortOrder };
        break;
      case 'stock':
        orderBy = { stockCount: sortOrder };
        break;
      case 'name':
        orderBy = { name: sortOrder };
        break;
      default:
        orderBy = { bonusRate: 'desc' };
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          tiktokProductId: true,
          name: true,
          description: true,
          imageUrl: true,
          category: true,
          priceMin: true,
          priceMax: true,
          aaCommissionRate: true,
          openCollabRate: true,
          bonusRate: true,
          stockCount: true,
          freeSampleAvailable: true,
          status: true,
          affiliateLink: true,
          deepLink: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Get unique categories for filter
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        categories: categories.map((c) => ({
          name: c.category,
          count: c._count,
        })),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create/import products (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }

    // Upsert products
    const results = await Promise.all(
      products.map((product: any) =>
        prisma.product.upsert({
          where: { tiktokProductId: product.tiktokProductId },
          create: {
            tiktokProductId: product.tiktokProductId,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            category: product.category,
            priceMin: product.priceMin,
            priceMax: product.priceMax,
            aaCommissionRate: product.aaCommissionRate,
            openCollabRate: product.openCollabRate,
            bonusRate: product.aaCommissionRate - product.openCollabRate,
            stockCount: product.stockCount || 0,
            freeSampleAvailable: product.freeSampleAvailable || false,
            status: 'ACTIVE',
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            affiliateLink: product.affiliateLink,
            deepLink: product.deepLink,
          },
          update: {
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            category: product.category,
            priceMin: product.priceMin,
            priceMax: product.priceMax,
            aaCommissionRate: product.aaCommissionRate,
            openCollabRate: product.openCollabRate,
            bonusRate: product.aaCommissionRate - product.openCollabRate,
            stockCount: product.stockCount || 0,
            freeSampleAvailable: product.freeSampleAvailable || false,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            affiliateLink: product.affiliateLink,
            deepLink: product.deepLink,
            lastSyncAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        imported: results.length,
      },
    });
  } catch (error) {
    console.error('Import products error:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
