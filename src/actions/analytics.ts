'use server';

import { prisma } from '@/lib/db';
import { CommissionStatus, UserStatus, ProductStatus } from '@prisma/client';

export async function getDashboardStats() {
    try {
        const [
            totalCreators,
            pendingApprovals,
            activeProducts,
            totalCommissionsPaidResult,
            thisMonthSalesResult
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'CREATOR' } }),
            prisma.user.count({ where: { role: 'CREATOR', status: 'PENDING' } }),
            prisma.product.count({ where: { status: 'ACTIVE' } }),
            prisma.commissionEvent.aggregate({
                _sum: { commissionAmount: true },
                where: { status: 'PAID' }
            }),
            prisma.commissionEvent.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    },
                    status: 'CONFIRMED' // Or PAID/PENDING depending on definition of "Sale"
                }
            })
        ]);

        return {
            totalCreators,
            pendingApprovals,
            activeProducts,
            totalCommissionsPaid: totalCommissionsPaidResult._sum.commissionAmount?.toNumber() || 0,
            thisMonthSales: thisMonthSalesResult
        };
    } catch (error) {
        console.error('Failed to fetching dashboard stats:', error);
        return {
            totalCreators: 0,
            pendingApprovals: 0,
            activeProducts: 0,
            totalCommissionsPaid: 0,
            thisMonthSales: 0
        };
    }
}

export async function getPendingCreators() {
    try {
        return await prisma.user.findMany({
            where: { role: 'CREATOR', status: 'PENDING' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { creator: true }
        });
    } catch (error) {
        return [];
    }
}

export async function getRecentActivity() {
    // This is checking for recent events. For now we will return some mock data mixed with real
    // In a real app we'd query an ActivityLog table or union multiple tables

    // For simplicity, let's fetch recent commission events (Sales)
    const recentSales = await prisma.commissionEvent.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { creator: { include: { user: true } }, product: true }
    });

    return recentSales.map(sale => ({
        id: sale.id,
        type: 'sale',
        creator: sale.creator.user.name || 'Unknown',
        amount: sale.orderAmount.toNumber(),
        commission: sale.commissionAmount.toNumber(),
        time: sale.createdAt
    }));
}
