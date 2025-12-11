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
        <Link href="/admin/products" className="px-4 py-2 bg-gray-700 text-white rounded-lg">← Back</Link>
      </div>
      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <p className="text-gray-400">Upload the TikTok TSP Core Product Pool CSV file</p>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-white" />
        {file && <p className="text-green-400">✓ {file.name} loaded</p>}
        <button onClick={handleImport} disabled={!file || importing} className={`w-full py-3 rounded-lg font-bold ${file && !importing ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-500'}`}>
          {importing ? 'Importing...' : 'Start Import'}
        </button>
        {results && (
          <div className="bg-gray-900 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold text-green-400">{results.imported}</p><p className="text-gray-500 text-sm">Imported</p></div>
            <div><p className="text-2xl font-bold text-red-400">{results.errors}</p><p className="text-gray-500 text-sm">Errors</p></div>
            <div><p className="text-2xl font-bold text-white">{results.total}</p><p className="text-gray-500 text-sm">Total</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
