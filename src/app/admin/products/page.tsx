'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = (page: number) => {
    setLoading(true);
    fetch(`/api/admin/products?page=${page}&limit=${pagination.limit}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setPagination(prev => ({
          ...prev,
          page: data.currentPage || page,
          total: data.total || 0,
          totalPages: data.totalPages || 0
        }));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  if (loading && products.length === 0) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/60">{pagination.total.toLocaleString()} products in catalog</p>
        </div>
        <Link
          href="/admin/products/import"
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          Import CSV
        </Link>
      </div>

      <div className="glass-panel overflow-hidden border border-white/5 rounded-xl">
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Open</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">AA Rate</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Boost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/40">No products yet</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium truncate max-w-[300px]">{p.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{p.tiktokProductId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/5">
                      {p.category || 'Other'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-white/60">{(p.openCollabRate * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-aa-orange to-aa-gold">
                      {(p.aaCommissionRate * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 font-medium text-green-400">
                      +{(p.aaCommissionRate - p.openCollabRate > 0 ? (p.aaCommissionRate - p.openCollabRate) * 100 : 0).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={() => fetchProducts(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-white/60 text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchProducts(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
