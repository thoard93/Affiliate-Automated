import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { csvData } = await request.json();
  const lines = csvData.split('\n').slice(3);
  let imported = 0, errors = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const cols = line.split(',');
      const productId = cols[1]?.replace(/"/g, '').trim();
      const category = cols[3]?.replace(/"/g, '').trim() || 'Other';
      const name = cols[5]?.replace(/"/g, '').trim();
      const openStr = cols[9]?.replace(/"/g, '').trim();
      
      if (!productId || productId.length < 10 || !name) { errors++; continue; }
      
      let openRate = openStr?.includes('%') ? parseFloat(openStr) / 100 : parseFloat(openStr) || 0.1;
      const aaRate = Math.min(openRate + 0.1, 0.5);

      await prisma.product.upsert({
        where: { tiktokProductId: productId },
        update: { name: name.substring(0, 255), category, openCollabRate: openRate, aaCommissionRate: aaRate },
        create: { tiktokProductId: productId, name: name.substring(0, 255), category, openCollabRate: openRate, aaCommissionRate: aaRate, bonusRate: 0, priceMin: 0, priceMax: 0, stockCount: 1000, freeSampleAvailable: false }
      });
      imported++;
    } catch { errors++; }
  }
  return NextResponse.json({ imported, errors, total: lines.length });
}
