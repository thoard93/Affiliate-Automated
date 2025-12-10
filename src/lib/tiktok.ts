import axios, { AxiosInstance, AxiosError } from 'axios';
import crypto from 'crypto';

// TikTok Shop API Configuration
const TIKTOK_AUTH_URL = 'https://auth.tiktok-shops.com';
const TIKTOK_API_URL = 'https://open-api.tiktokglobalshop.com';

interface TikTokConfig {
  appKey: string;
  appSecret: string;
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expire_in: number;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name?: string;
}

interface ShopInfo {
  shop_cipher: string;
  shop_id: string;
  shop_name: string;
  region: string;
}

interface Creator {
  creator_id: string;
  creator_name: string;
  avatar_url: string;
  follower_count: number;
  gmv_tier: string;
  engagement_rate: number;
}

interface Product {
  product_id: string;
  product_name: string;
  product_status: string;
  main_images: string[];
  price: {
    currency: string;
    sale_price: string;
    original_price: string;
  };
  stock_info: {
    available_stock: number;
  };
}

interface CollaborationInvite {
  invitation_id: string;
  creator_id: string;
  product_id: string;
  commission_rate: number;
  status: string;
  created_time: number;
  expire_time: number;
}

interface AffiliateOrder {
  order_id: string;
  creator_id: string;
  product_id: string;
  order_amount: string;
  commission_rate: number;
  commission_amount: string;
  order_status: string;
  create_time: number;
}

export class TikTokShopClient {
  private config: TikTokConfig;
  private client: AxiosInstance;
  private accessToken?: string;
  private shopCipher?: string;

  constructor(config: TikTokConfig) {
    this.config = config;
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ============================================
  // SIGNATURE GENERATION
  // ============================================

  private generateSignature(
    path: string,
    timestamp: number,
    params: Record<string, string> = {},
    body?: object
  ): string {
    // TikTok Shop signature algorithm
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}${params[key]}`)
      .join('');

    const bodyString = body ? JSON.stringify(body) : '';
    
    const signString = `${this.config.appSecret}${path}${sortedParams}${bodyString}${this.config.appSecret}`;
    
    return crypto
      .createHmac('sha256', this.config.appSecret)
      .update(signString)
      .digest('hex');
  }

  private getCommonParams(timestamp: number): Record<string, string> {
    return {
      app_key: this.config.appKey,
      timestamp: timestamp.toString(),
    };
  }

  // ============================================
  // OAUTH FLOW
  // ============================================

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      app_key: this.config.appKey,
      redirect_uri: this.config.redirectUri,
      state,
    });

    return `${TIKTOK_AUTH_URL}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/token/get';
    
    const params = {
      ...this.getCommonParams(timestamp),
      auth_code: code,
      grant_type: 'authorized_code',
    };

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      null,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Token exchange failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/token/refresh';
    
    const params = {
      ...this.getCommonParams(timestamp),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      null,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Token refresh failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  /**
   * Set access token for subsequent requests
   */
  setAccessToken(token: string, shopCipher?: string): void {
    this.accessToken = token;
    this.shopCipher = shopCipher;
  }

  // ============================================
  // SHOP MANAGEMENT
  // ============================================

  /**
   * Get authorized shops
   */
  async getAuthorizedShops(): Promise<ShopInfo[]> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/authorization/202309/shops';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
    };

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.get(`${TIKTOK_API_URL}${path}`, {
      params: {
        ...params,
        sign,
      },
    });

    if (response.data.code !== 0) {
      throw new Error(`Get shops failed: ${response.data.message}`);
    }

    return response.data.data.shops;
  }

  // ============================================
  // AFFILIATE / CREATOR MANAGEMENT
  // ============================================

  /**
   * Search for creators (affiliates)
   */
  async searchCreators(filters: {
    page_size?: number;
    page_token?: string;
    min_followers?: number;
    max_followers?: number;
    gmv_tier?: string;
    categories?: string[];
  }): Promise<{ creators: Creator[]; next_page_token?: string }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/creators/search';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const body = {
      page_size: filters.page_size || 20,
      page_token: filters.page_token,
      filter: {
        min_followers: filters.min_followers,
        max_followers: filters.max_followers,
        gmv_tier: filters.gmv_tier,
        categories: filters.categories,
      },
    };

    const sign = this.generateSignature(path, timestamp, params, body);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      body,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Search creators failed: ${response.data.message}`);
    }

    return {
      creators: response.data.data.creators || [],
      next_page_token: response.data.data.next_page_token,
    };
  }

  /**
   * Send targeted collaboration invite to a creator
   */
  async sendCollaborationInvite(
    creatorId: string,
    productId: string,
    commissionRate: number, // e.g., 0.20 for 20%
    validDays: number = 30
  ): Promise<CollaborationInvite> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/target_collaborations';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const body = {
      creator_id: creatorId,
      product_id: productId,
      commission_rate: Math.round(commissionRate * 10000), // API expects basis points
      valid_days: validDays,
    };

    const sign = this.generateSignature(path, timestamp, params, body);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      body,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Send invite failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  /**
   * Send bulk collaboration invites (up to 50 creators)
   */
  async sendBulkInvites(
    creatorIds: string[],
    productId: string,
    commissionRate: number,
    validDays: number = 30
  ): Promise<{ success: string[]; failed: { creator_id: string; error: string }[] }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/target_collaborations/batch';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const body = {
      invitations: creatorIds.map((id) => ({
        creator_id: id,
        product_id: productId,
        commission_rate: Math.round(commissionRate * 10000),
        valid_days: validDays,
      })),
    };

    const sign = this.generateSignature(path, timestamp, params, body);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      body,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Bulk invite failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  /**
   * Get collaboration invites (sent by the shop)
   */
  async getCollaborationInvites(filters: {
    page_size?: number;
    page_token?: string;
    status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  }): Promise<{ invites: CollaborationInvite[]; next_page_token?: string }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/target_collaborations';
    
    const params: Record<string, string> = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
      page_size: (filters.page_size || 20).toString(),
    };

    if (filters.page_token) {
      params.page_token = filters.page_token;
    }
    if (filters.status) {
      params.status = filters.status;
    }

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.get(`${TIKTOK_API_URL}${path}`, {
      params: {
        ...params,
        sign,
      },
    });

    if (response.data.code !== 0) {
      throw new Error(`Get invites failed: ${response.data.message}`);
    }

    return {
      invites: response.data.data.invitations || [],
      next_page_token: response.data.data.next_page_token,
    };
  }

  /**
   * Generate affiliate promotion link
   */
  async generateAffiliateLink(
    creatorId: string,
    productId: string
  ): Promise<{ link: string; deep_link: string; expires_at: number }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/promotion_links';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const body = {
      creator_id: creatorId,
      product_id: productId,
    };

    const sign = this.generateSignature(path, timestamp, params, body);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      body,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Generate link failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  // ============================================
  // PRODUCT MANAGEMENT
  // ============================================

  /**
   * Get products from shop
   */
  async getProducts(filters: {
    page_size?: number;
    page_token?: string;
    status?: string;
  }): Promise<{ products: Product[]; next_page_token?: string }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/product/202309/products/search';
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const body = {
      page_size: filters.page_size || 20,
      page_token: filters.page_token,
    };

    const sign = this.generateSignature(path, timestamp, params, body);

    const response = await this.client.post(
      `${TIKTOK_API_URL}${path}`,
      body,
      {
        params: {
          ...params,
          sign,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Get products failed: ${response.data.message}`);
    }

    return {
      products: response.data.data.products || [],
      next_page_token: response.data.data.next_page_token,
    };
  }

  /**
   * Get product details
   */
  async getProductDetails(productId: string): Promise<Product> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = `/product/202309/products/${productId}`;
    
    const params = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
    };

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.get(`${TIKTOK_API_URL}${path}`, {
      params: {
        ...params,
        sign,
      },
    });

    if (response.data.code !== 0) {
      throw new Error(`Get product failed: ${response.data.message}`);
    }

    return response.data.data;
  }

  // ============================================
  // ORDER / COMMISSION TRACKING
  // ============================================

  /**
   * Get affiliate orders
   */
  async getAffiliateOrders(filters: {
    page_size?: number;
    page_token?: string;
    start_time?: number;
    end_time?: number;
    order_status?: string;
  }): Promise<{ orders: AffiliateOrder[]; next_page_token?: string }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/affiliate/202405/orders';
    
    const params: Record<string, string> = {
      ...this.getCommonParams(timestamp),
      access_token: this.accessToken!,
      shop_cipher: this.shopCipher!,
      page_size: (filters.page_size || 20).toString(),
    };

    if (filters.page_token) {
      params.page_token = filters.page_token;
    }
    if (filters.start_time) {
      params.start_time = filters.start_time.toString();
    }
    if (filters.end_time) {
      params.end_time = filters.end_time.toString();
    }
    if (filters.order_status) {
      params.order_status = filters.order_status;
    }

    const sign = this.generateSignature(path, timestamp, params);

    const response = await this.client.get(`${TIKTOK_API_URL}${path}`, {
      params: {
        ...params,
        sign,
      },
    });

    if (response.data.code !== 0) {
      throw new Error(`Get orders failed: ${response.data.message}`);
    }

    return {
      orders: response.data.data.orders || [],
      next_page_token: response.data.data.next_page_token,
    };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let tiktokClient: TikTokShopClient | null = null;

export function getTikTokClient(): TikTokShopClient {
  if (!tiktokClient) {
    const appKey = process.env.TIKTOK_APP_KEY;
    const appSecret = process.env.TIKTOK_APP_SECRET;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;

    if (!appKey || !appSecret) {
      throw new Error('TikTok Shop API credentials not configured');
    }

    tiktokClient = new TikTokShopClient({
      appKey,
      appSecret,
      redirectUri,
    });
  }

  return tiktokClient;
}

export default TikTokShopClient;
