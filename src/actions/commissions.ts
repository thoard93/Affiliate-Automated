'use server';

import { prisma } from '@/lib/db';
import { CommissionStatus, CommissionEventType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getCommissionStats() {
    try {
        const totalPaid = await prisma.commissionEvent.aggregate({
            where: {
                status: 'PAID',
            },
            _sum: {
                commissionAmount: true,
            },
        });

        const pendingAmount = await prisma.commissionEvent.aggregate({
            where: {
                status: 'PENDING',
            },
            _sum: {
                commissionAmount: true,
            },
        });

        const companyRevenue = await prisma.commissionEvent.aggregate({
            where: {
                status: 'PAID',
            },
            _sum: {
                orderAmount: true, // simplified calculation for now
            },
        });

        return {
            totalPaid: totalPaid._sum.commissionAmount?.toNumber() || 0,
            pending: pendingAmount._sum.commissionAmount?.toNumber() || 0,
            companyRevenue: (companyRevenue._sum.orderAmount?.toNumber() || 0) * 0.1, // assuming 10% take rate for now
        };
    } catch (error) {
        console.error('Error fetching commission stats:', error);
        return { totalPaid: 0, pending: 0, companyRevenue: 0 };
    }
}

export async function getRecentCommissions() {
    try {
        const commissions = await prisma.commissionEvent.findMany({
            take: 20,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                creator: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return commissions.map((c) => ({
            id: c.id,
            creatorName: c.creator.user.name || 'Unknown Creator',
            creatorImage: c.creator.user.image,
            eventType: c.eventType,
            amount: c.commissionAmount.toNumber(),
            status: c.status,
            date: c.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching recent commissions:', error);
        return [];
    }
}

export async function createManualCommission(data: {
    creatorId: string;
    amount: number;
    status: CommissionStatus;
    description?: string;
}) {
    try {
        await prisma.commissionEvent.create({
            data: {
                creatorId: data.creatorId,
                commissionAmount: data.amount,
                status: data.status,
                eventType: 'ADJUSTMENT', // Manual entry usually implies adjustment or off-platform logging
                orderAmount: 0,
                commissionRate: 0,
                periodMonth: new Date(),
                rawData: data.description ? { description: data.description } : undefined,
            },
        });

        revalidatePath('/admin/commissions');
        return { success: true };
    } catch (error) {
        console.error('Error creating manual commission:', error);
        return { success: false, error: 'Failed to create commission' };
    }
}

export async function getCreatorsList() {
    try {
        const creators = await prisma.creator.findMany({
            select: {
                id: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return creators.map(c => ({ id: c.id, name: c.user.name || 'Unnamed' }));
    } catch (error) {
        return [];
    }
}
