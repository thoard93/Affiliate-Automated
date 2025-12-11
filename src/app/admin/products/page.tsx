'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/import" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Import CSV</Link>
      </div>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase">Category</th>
              <th className="px-4 py-3 text-center text-xs text-gray-400 uppercase">Open</th>
              <th className="px-4 py-3 text-center text-xs text-gray-400 uppercase">AA Rate</th>
              <th className="px-4 py-3 text-center text-xs text-gray-400 uppercase">Boost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No products yet</td></tr>
            ) : products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-700/50">
                <td className="px-4 py-3"><div className="text-white font-medium truncate max-w-[300px]">{p.name}</div><div className="text-gray-500 text-xs">{p.tiktokProductId}</div></td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{p.category}</span></td>
                <td className="px-4 py-3 text-center text-gray-400">{(p.openCollabRate*100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-center text-orange-400 font-bold">{(p.aaCommissionRate*100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-center text-green-400">+{((p.aaCommissionRate-p.openCollabRate)*100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
