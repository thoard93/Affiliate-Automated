import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const commissions = await prisma.commissionEvent.findMany({
            include: {
                creator: {
                    include: {
                        user: true,
                    },
                },
                product: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const csvRows = [
            ['Date', 'Creator', 'Email', 'Type', 'Amount', 'Status', 'Product', 'Order ID'],
        ];

        commissions.forEach((comm) => {
            csvRows.push([
                format(new Date(comm.createdAt), 'yyyy-MM-dd HH:mm:ss'),
                comm.creator.user.name || 'Unknown',
                comm.creator.user.email || '',
                comm.eventType,
                comm.commissionAmount.toString(),
                comm.status,
                comm.product?.name || 'N/A',
                comm.tiktokOrderId || 'N/A',
            ]);
        });

        const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=commissions-export-${format(new Date(), 'yyyy-MM-dd')}.csv`,
            },
        });
    } catch (error) {
        console.error('Failed to export commissions:', error);
        return new NextResponse('Failed to export commissions', { status: 500 });
    }
}
