/**
 * Import Products Script
 * 
 * Usage: npx ts-node scripts/import-products.ts [csv-file]
 * 
 * Imports products from a CSV file into the database.
 * 
 * CSV Format:
 * tiktokProductId,name,category,priceMin,priceMax,aaCommissionRate,openCollabRate,stockCount,freeSampleAvailable
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ProductRow {
  tiktokProductId: string;
  name: string;
  category: string;
  priceMin: string;
  priceMax: string;
  aaCommissionRate: string;
  openCollabRate: string;
  stockCount: string;
  freeSampleAvailable: string;
  imageUrl?: string;
  description?: string;
  sellerId?: string;
  sellerName?: string;
}

function parseCSV(content: string): ProductRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    
    return row as ProductRow;
  });
}

async function importProducts(filePath: string) {
  console.log('📦 Importing products...\n');

  try {
    // Read CSV file
    const content = fs.readFileSync(filePath, 'utf-8');
    const products = parseCSV(content);

    console.log(`Found ${products.length} products to import\n`);

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const product of products) {
      try {
        const aaRate = parseFloat(product.aaCommissionRate) / 100; // Convert from percentage
        const openRate = parseFloat(product.openCollabRate) / 100;
        const bonusRate = aaRate - openRate;

        const result = await prisma.product.upsert({
          where: { tiktokProductId: product.tiktokProductId },
          create: {
            tiktokProductId: product.tiktokProductId,
            name: product.name,
            description: product.description || null,
            imageUrl: product.imageUrl || null,
            category: product.category,
            priceMin: parseFloat(product.priceMin),
            priceMax: parseFloat(product.priceMax),
            aaCommissionRate: aaRate,
            openCollabRate: openRate,
            bonusRate: bonusRate,
            stockCount: parseInt(product.stockCount) || 0,
            freeSampleAvailable: product.freeSampleAvailable?.toLowerCase() === 'true' || product.freeSampleAvailable === '1',
            status: 'ACTIVE',
            sellerId: product.sellerId || null,
            sellerName: product.sellerName || null,
          },
          update: {
            name: product.name,
            description: product.description || undefined,
            imageUrl: product.imageUrl || undefined,
            category: product.category,
            priceMin: parseFloat(product.priceMin),
            priceMax: parseFloat(product.priceMax),
            aaCommissionRate: aaRate,
            openCollabRate: openRate,
            bonusRate: bonusRate,
            stockCount: parseInt(product.stockCount) || 0,
            freeSampleAvailable: product.freeSampleAvailable?.toLowerCase() === 'true' || product.freeSampleAvailable === '1',
            sellerId: product.sellerId || undefined,
            sellerName: product.sellerName || undefined,
            lastSyncAt: new Date(),
          },
        });

        if (result.createdAt === result.updatedAt) {
          imported++;
        } else {
          updated++;
        }

        process.stdout.write(`\r✅ Processed: ${imported + updated + errors}/${products.length}`);
      } catch (error) {
        errors++;
        console.error(`\n❌ Error importing ${product.tiktokProductId}:`, error);
      }
    }

    console.log('\n\n📊 Import Summary:');
    console.log(`   ✅ New products: ${imported}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${products.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Sample CSV template generator
async function generateTemplate() {
  const template = `tiktokProductId,name,category,priceMin,priceMax,aaCommissionRate,openCollabRate,stockCount,freeSampleAvailable
TTS123456,Nutcracker Tool Heavy Duty,Kitchen & Dining,12.99,17.99,20,12,2751,true
TTS234567,LED Strip Lights 50ft RGB,Home & Garden,24.99,29.99,18,10,5420,true
TTS345678,Portable Blender USB,Kitchen & Dining,19.99,24.99,22,15,3218,false`;

  fs.writeFileSync('products-template.csv', template);
  console.log('📄 Template saved to products-template.csv');
}

// Main
const args = process.argv.slice(2);

if (args[0] === '--template') {
  generateTemplate();
} else if (args[0]) {
  const filePath = path.resolve(args[0]);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  importProducts(filePath);
} else {
  console.log('Usage:');
  console.log('  npx ts-node scripts/import-products.ts <csv-file>');
  console.log('  npx ts-node scripts/import-products.ts --template');
  console.log('\nCSV columns:');
  console.log('  tiktokProductId, name, category, priceMin, priceMax,');
  console.log('  aaCommissionRate (%), openCollabRate (%), stockCount, freeSampleAvailable');
}
