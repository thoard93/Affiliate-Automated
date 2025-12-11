'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const text = await file.text();
    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: text }),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    }
    setImporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Import Products</h1>
        <Link href="/admin/products" className="text-white/60 hover:text-white transition-colors">← Back to Products</Link>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-aa-orange/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📥</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Upload Product CSV</h2>
          <p className="text-white/60 text-sm">Upload the official TikTok Shop Affiliate Product Pool CSV file to sync your catalog.</p>
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 transition-colors hover:border-aa-orange/50 hover:bg-white/5">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-aa-orange file:text-white hover:file:bg-aa-orange/90 cursor-pointer"
          />
        </div>

        {file && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2 text-green-400 text-sm">
            <span>✓</span> {file.name} ready to import
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className={`w-full py-3 rounded-lg font-bold transition-all ${file && !importing
              ? 'btn-primary shadow-lg shadow-aa-orange/20'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
        >
          {importing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Importing 200+ Products...
            </span>
          ) : 'Start Import Process'}
        </button>

        {results && (
          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-white/5">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">{results.imported}</p>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Imported</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-2xl font-bold text-red-400">{results.errors}</p>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Errors</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-white">{results.total}</p>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Total</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
