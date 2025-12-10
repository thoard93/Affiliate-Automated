export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTikTokClient } from '@/lib/tiktok';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('TikTok OAuth error:', error);
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=oauth_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=missing_params', request.url)
      );
    }

    // Verify state token
    const oauthState = await prisma.oAuthState.findUnique({
      where: { state },
    });

    if (!oauthState) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=invalid_state', request.url)
      );
    }

    // Check if state is expired (15 minutes)
    if (new Date() > oauthState.expiresAt) {
      await prisma.oAuthState.delete({ where: { id: oauthState.id } });
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=expired_state', request.url)
      );
    }

    // Get the user ID from the state
    const userId = oauthState.userId;
    if (!userId) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=no_user', request.url)
      );
    }

    // Exchange code for tokens
    const tiktokClient = getTikTokClient();
    const tokens = await tiktokClient.exchangeCodeForTokens(code);

    // Set access token and get shop info
    tiktokClient.setAccessToken(tokens.access_token);
    const shops = await tiktokClient.getAuthorizedShops();

    if (!shops || shops.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=no_shops', request.url)
      );
    }

    // Use the first shop
    const shop = shops[0];

    // Calculate token expiry
    const tokenExpiry = new Date(Date.now() + tokens.access_token_expire_in * 1000);

    // Update creator with TikTok credentials
    await prisma.creator.update({
      where: { userId },
      data: {
        tiktokConnected: true,
        tiktokUserId: tokens.open_id,
        tiktokAccessToken: tokens.access_token,
        tiktokRefreshToken: tokens.refresh_token,
        tiktokTokenExpiry: tokenExpiry,
        tiktokShopCipher: shop.shop_cipher,
        lastSyncAt: new Date(),
      },
    });

    // Clean up OAuth state
    await prisma.oAuthState.delete({ where: { id: oauthState.id } });

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/dashboard/settings?success=tiktok_connected', request.url)
    );
  } catch (error) {
    console.error('TikTok callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=callback_failed', request.url)
    );
  }
}
