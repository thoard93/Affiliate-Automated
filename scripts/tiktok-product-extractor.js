/**
 * TikTok Partner Center Product Extractor
 * 
 * HOW TO USE:
 * 1. Go to TikTok Partner Center > Product Management > Selected Products
 * 2. Open browser DevTools (F12 or Right-click > Inspect)
 * 3. Go to the "Console" tab
 * 4. Paste this entire script and press Enter
 * 5. Scroll through ALL products on the page (so they load into the DOM)
 * 6. Type: extractProducts() and press Enter
 * 7. A CSV file will automatically download
 */

function extractProducts() {
    const rows = document.querySelectorAll('table tbody tr, [class*="product-row"], [class*="ProductRow"]');

    if (rows.length === 0) {
        // Try alternative selectors for TikTok's interface
        const altRows = document.querySelectorAll('[data-e2e*="product"], [class*="arco-table-tr"]');
        if (altRows.length === 0) {
            console.error('No product rows found. Make sure you are on the Selected Products page.');
            return;
        }
    }

    const products = [];

    // Extract from table rows
    document.querySelectorAll('table tbody tr, [class*="arco-table-tr"]').forEach((row, index) => {
        try {
            const cells = row.querySelectorAll('td, [class*="arco-table-td"]');
            if (cells.length < 4) return;

            // Extract product name and ID
            const productCell = cells[0];
            const nameEl = productCell.querySelector('span, div, a');
            const name = nameEl ? nameEl.innerText.trim().split('\n')[0] : '';

            // Try to find product ID (usually in a small text or link)
            const idMatch = productCell.innerText.match(/ID:\s*(\d+)/);
            const productId = idMatch ? idMatch[1] : `unknown-${index}`;

            // Extract commission rate
            const commissionText = cells[1]?.innerText || '';
            const commissionMatch = commissionText.match(/(\d+)%/);
            const commissionRate = commissionMatch ? parseFloat(commissionMatch[1]) / 100 : 0;

            // Extract price
            const priceText = cells[3]?.innerText || cells[4]?.innerText || '';
            const priceMatch = priceText.match(/\$?([\d,.]+)/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;

            // Extract stock if visible
            const stockMatch = productCell.innerText.match(/Stock:\s*(\d+)/);
            const stock = stockMatch ? parseInt(stockMatch[1]) : 0;

            // Extract free sample
            const freeSampleCell = cells[4] || cells[5];
            const freeSample = freeSampleCell?.innerText.toLowerCase().includes('yes') ? 'true' : 'false';

            products.push({
                tiktokProductId: productId,
                name: name.replace(/"/g, '""'), // Escape quotes for CSV
                priceMin: price,
                priceMax: price,
                aaCommissionRate: commissionRate,
                openCollabRate: commissionRate * 0.8, // Estimate
                stockCount: stock,
                freeSampleAvailable: freeSample,
                status: 'ACTIVE'
            });
        } catch (e) {
            console.warn('Error parsing row:', e);
        }
    });

    if (products.length === 0) {
        console.error('Could not extract any products. The page structure may have changed.');
        console.log('Try scrolling through all products first, then run extractProducts() again.');
        return;
    }

    // Generate CSV
    const headers = ['tiktokProductId', 'name', 'priceMin', 'priceMax', 'aaCommissionRate', 'openCollabRate', 'stockCount', 'freeSampleAvailable', 'status'];
    const csvRows = [headers.join(',')];

    products.forEach(p => {
        csvRows.push(headers.map(h => `"${p[h]}"`).join(','));
    });

    const csvContent = csvRows.join('\n');

    // Download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok-products-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Extracted ${products.length} products and downloaded CSV!`);
    return products;
}

// Make function available globally
window.extractProducts = extractProducts;
console.log('🔧 Product Extractor loaded! Scroll through all products, then type: extractProducts()');
