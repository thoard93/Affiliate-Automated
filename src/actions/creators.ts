'use server';

import { prisma } from '@/lib/db';
import { UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getCreators(search?: string, statusFilter?: string) {
    try {
        const where: any = {
            role: 'CREATOR',
        };

        if (statusFilter && statusFilter !== 'all') {
            where.status = statusFilter as UserStatus;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { creator: { discordUsername: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                creator: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Flatten logic to match the UI expectation
        const creators = users.map(u => ({
            id: u.id,
            creatorId: u.creator?.id, // Useful for linking
            name: u.name || 'Unknown',
            email: u.email || '',
            discordUsername: u.creator?.discordUsername || 'Not connected',
            discordId: u.creator?.discordUserId,
            tiktokUsername: u.creator?.tiktokUsername || null,
            tiktokConnected: u.creator?.tiktokConnected || false,
            status: u.status,
            followerCount: u.creator?.followerCount || 0,
            totalSales: 0, // Mock for now until API
            totalRevenue: u.creator?.totalGmv ? Number(u.creator.totalGmv) : 0,
            totalCommission: 0, // Mock for now
            productsInShowcase: 0, // Mock for now
            createdAt: u.createdAt.toISOString(),
            lastActive: u.updatedAt.toISOString(), // Approximation
        }));

        return { success: true, creators };
    } catch (error) {
        console.error('Failed to fetch creators:', error);
        return { success: false, error: 'Failed to fetch creators' };
    }
}

export async function updateCreatorStatus(userId: string, status: UserStatus) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status },
        });

        revalidatePath('/admin/creators');
        return { success: true };
    } catch (error) {
        console.error('Failed to update creator status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}
