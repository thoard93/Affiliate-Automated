'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSetting.findMany();

        // Convert array to object for easier access
        const settingsMap = settings.reduce((acc: Record<string, string>, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return { success: true, settings: settingsMap };
    } catch (error) {
        console.error('Failed to fetching settings:', error);
        return { success: false, error: 'Failed to fetch settings' };
    }
}

export async function updateSystemSetting(key: string, value: string) {
    try {
        await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Failed to update setting:', error);
        return { success: false, error: 'Failed to update setting' };
    }
}
