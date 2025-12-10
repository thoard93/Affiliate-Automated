import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTikTokClient } from '@/lib/tiktok';
import { generateSecureToken } from '@/lib/utils';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate secure state token
    const state = generateSecureToken(32);
    
    // Store state in database for verification
    await prisma.oAuthState.create({
      data: {
        state,
        userId: session.user.id,
        redirectUrl: '/dashboard/settings',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    // Get TikTok authorization URL
    const tiktokClient = getTikTokClient();
    const authUrl = tiktokClient.getAuthorizationUrl(state);

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('TikTok authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
