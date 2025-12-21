'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Package,
  TrendingUp,
  Gift,
  ExternalLink,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  X,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, cn } from '@/lib/utils';

// Mock products data - will be replaced with API
const mockProducts = [
  {
    id: '1',
    tiktokProductId: 'TTS123456',
    name: 'Nutcracker Tool, Heavy Duty Pecan Walnut Plier Opener',
    category: 'Kitchen & Dining',
    imageUrl: null,
    priceMin: 12.99,
    priceMax: 17.99,
    aaCommissionRate: 0.20,
    openCollabRate: 0.12,
    stockCount: 2751,
    freeSampleAvailable: true,
    status: 'ACTIVE',
  },
  {
    id: '2',
    tiktokProductId: 'TTS234567',
    name: 'LED Strip Lights 50ft RGB Color Changing with Remote',
    category: 'Home & Garden',
    imageUrl: null,
    priceMin: 24.99,
    priceMax: 29.99,
    aaCommissionRate: 0.18,
    openCollabRate: 0.10,
    stockCount: 5420,
    freeSampleAvailable: true,
    status: 'ACTIVE',
  },
  {
    id: '3',
    tiktokProductId: 'TTS345678',
    name: 'Portable Blender Personal Size USB Rechargeable',
    category: 'Kitchen & Dining',
    imageUrl: null,
    priceMin: 19.99,
    priceMax: 24.99,
    aaCommissionRate: 0.22,
    openCollabRate: 0.15,
    stockCount: 3218,
    freeSampleAvailable: false,
    status: 'ACTIVE',
  },
  {
    id: '4',
    tiktokProductId: 'TTS456789',
    name: 'Wireless Earbuds Bluetooth 5.3 Touch Control',
    category: 'Electronics',
    imageUrl: null,
    priceMin: 29.99,
    priceMax: 34.99,
    aaCommissionRate: 0.15,
    openCollabRate: 0.08,
    stockCount: 8432,
    freeSampleAvailable: true,
    status: 'ACTIVE',
  },
  {
    id: '5',
    tiktokProductId: 'TTS567890',
    name: 'Yoga Mat Extra Thick Non-Slip Exercise Mat',
    category: 'Sports & Fitness',
    imageUrl: null,
    priceMin: 34.99,
    priceMax: 39.99,
    aaCommissionRate: 0.25,
    openCollabRate: 0.18,
    stockCount: 1856,
    freeSampleAvailable: true,
    status: 'ACTIVE',
  },
  {
    id: '6',
    tiktokProductId: 'TTS678901',
    name: 'Makeup Brush Set 32 Pcs Professional',
    category: 'Beauty',
    imageUrl: null,
    priceMin: 15.99,
    priceMax: 19.99,
    aaCommissionRate: 0.28,
    openCollabRate: 0.20,
    stockCount: 4521,
    freeSampleAvailable: false,
    status: 'ACTIVE',
  },
];

const categories = [
  'All Categories',
  'Kitchen & Dining',
  'Home & Garden',
  'Electronics',
  'Sports & Fitness',
  'Beauty',
  'Fashion',
  'Toys & Games',
];

const sortOptions = [
  { value: 'bonus-high', label: 'Highest Bonus' },
  { value: 'bonus-low', label: 'Lowest Bonus' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'stock-high', label: 'Most Stock' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('bonus-high');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [freeSampleOnly, setFreeSampleOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Free sample filter
    if (freeSampleOnly) {
      products = products.filter((p) => p.freeSampleAvailable);
    }

    // Sort
    switch (sortBy) {
      case 'bonus-high':
        products.sort(
          (a, b) =>
            b.aaCommissionRate - b.openCollabRate - (a.aaCommissionRate - a.openCollabRate)
        );
        break;
      case 'bonus-low':
        products.sort(
          (a, b) =>
            a.aaCommissionRate - a.openCollabRate - (b.aaCommissionRate - b.openCollabRate)
        );
        break;
      case 'price-high':
        products.sort((a, b) => b.priceMax - a.priceMax);
        break;
      case 'price-low':
        products.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case 'stock-high':
        products.sort((a, b) => b.stockCount - a.stockCount);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy, freeSampleOnly]);

  const handleAddToShowcase = (productId: string) => {
    // Generate deep link and open in new tab
    const deepLink = `https://www.tiktok.com/view/product/${productId}`;
    window.open(deepLink, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Product <span className="text-gradient">Catalog</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium">
            Browse 213+ high-commission products ready for your showcase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-aa-bg-secondary/40 backdrop-blur-md rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2.5 rounded-lg transition-all duration-300',
                viewMode === 'grid'
                  ? 'bg-aa-orange text-white shadow-lg shadow-aa-orange/20'
                  : 'text-white/40 hover:text-white'
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2.5 rounded-lg transition-all duration-300',
                viewMode === 'list'
                  ? 'bg-aa-orange text-white shadow-lg shadow-aa-orange/20'
                  : 'text-white/40 hover:text-white'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-aa-orange transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="input-field pl-12 h-14"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field pr-10 appearance-none cursor-pointer h-14"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        {/* Sort & Filter Toggle */}
        <div className="md:col-span-3 flex gap-4">
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer h-14"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SortAsc className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300',
              showFilters
                ? 'bg-aa-orange/10 border-aa-orange/40 text-aa-orange'
                : 'bg-aa-bg-secondary/40 border-white/5 text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card border-aa-orange/20 animate-fade-in-up">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={freeSampleOnly}
                  onChange={(e) => setFreeSampleOnly(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-aa-orange focus:ring-aa-orange transition-all"
                />
              </div>
              <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Free Sample Available</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filters Bar */}
      {(searchQuery || selectedCategory !== 'All Categories' || freeSampleOnly) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mr-2">Filters:</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-2 px-3 py-1.5 bg-aa-orange/10 border border-aa-orange/20 rounded-lg text-xs font-bold text-aa-orange hover:bg-aa-orange/20"
            >
              "{searchQuery}"
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {selectedCategory !== 'All Categories' && (
            <button
              onClick={() => setSelectedCategory('All Categories')}
              className="flex items-center gap-2 px-3 py-1.5 bg-aa-gold/10 border border-aa-gold/20 rounded-lg text-xs font-bold text-aa-gold hover:bg-aa-gold/20"
            >
              {selectedCategory}
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {freeSampleOnly && (
            <button
              onClick={() => setFreeSampleOnly(false)}
              className="flex items-center gap-2 px-3 py-1.5 bg-aa-success/10 border border-aa-success/20 rounded-lg text-xs font-bold text-aa-success hover:bg-aa-success/20"
            >
              Free Samples
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setFreeSampleOnly(false);
            }}
            className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest ml-2 underline underline-offset-4"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
          Found {filteredProducts.length} Results
        </p>
      </div>

      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => handleAddToShowcase(product.tiktokProductId)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            {filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onAdd={() => handleAddToShowcase(product.tiktokProductId)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="card flex flex-col items-center justify-center py-24 text-center border-dashed border-white/10 opacity-60">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-sm text-white/40 max-w-xs mx-auto">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onAdd,
}: {
  product: typeof mockProducts[0];
  onAdd: () => void;
}) {
  const bonusRate = product.aaCommissionRate - product.openCollabRate;

  return (
    <div className="card group hover:border-aa-orange/40 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-aa-orange/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-xl bg-aa-bg-tertiary border border-white/5 mb-5 overflow-hidden group-hover:border-aa-orange/20 transition-colors">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
            <Package className="w-14 h-14 text-white/10 group-hover:text-white/20 transition-colors" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-aa-gold text-aa-bg-primary text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-aa-gold/20">
            <Sparkles className="w-3 h-3" />
            {formatPercent(bonusRate, 0)} Bonus
          </div>
          {product.freeSampleAvailable && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-aa-success/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-aa-success/20">
              <Gift className="w-3 h-3" />
              Sample
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black text-aa-orange uppercase tracking-widest opacity-80">{product.category}</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{formatNumber(product.stockCount)} Units</span>
        </div>

        <h3 className="font-bold text-white line-clamp-2 mb-4 group-hover:text-aa-orange transition-colors min-h-[2.5rem] leading-tight text-base">
          {product.name}
        </h3>

        {/* Commission Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mb-1">AA Rate</span>
            <span className="text-xl font-black text-aa-success leading-none">
              {formatPercent(product.aaCommissionRate, 0)}
            </span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-3">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mb-1">Market Avg</span>
            <span className="text-xl font-black text-white/60 leading-none">
              {formatPercent(product.openCollabRate, 0)}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Price Range</span>
              <span className="text-lg font-black text-white">
                ${product.priceMin.toFixed(2)} - ${product.priceMax.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={onAdd}
            className="w-full btn-primary h-12 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <TrendingUp className="w-4 h-4 relative z-10" />
            <span className="font-black uppercase tracking-widest text-xs relative z-10">Add to Showcase</span>
            <ExternalLink className="w-3.5 h-3.5 relative z-10 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Product List Item Component
function ProductListItem({
  product,
  onAdd,
}: {
  product: typeof mockProducts[0];
  onAdd: () => void;
}) {
  const bonusRate = product.aaCommissionRate - product.openCollabRate;

  return (
    <div className="card group flex flex-col md:flex-row items-center gap-6 p-5 hover:border-aa-orange/40 transition-all duration-500">
      {/* Image */}
      <div className="w-full md:w-28 h-28 rounded-xl bg-aa-bg-tertiary border border-white/5 flex-shrink-0 overflow-hidden relative group-hover:border-aa-orange/20 transition-colors">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Package className="w-10 h-10 text-white/10" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[10px] font-black text-aa-orange uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-aa-gold/10 border border-aa-gold/20 rounded-md text-[9px] font-bold text-aa-gold uppercase">
              +{formatPercent(bonusRate, 0)} Bonus
            </span>
            {product.freeSampleAvailable && (
              <span className="px-2 py-0.5 bg-aa-success/10 border border-aa-success/20 rounded-md text-[9px] font-bold text-aa-success uppercase">
                Free Sample
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-lg text-white truncate mb-1 group-hover:text-aa-orange transition-colors">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">AA Rate:</span>
            <span className="text-aa-success font-black text-lg">{formatPercent(product.aaCommissionRate, 0)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Market:</span>
            <span className="text-white/60 font-black">{formatPercent(product.openCollabRate, 0)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Price:</span>
            <span className="text-white font-black">${product.priceMin.toFixed(2)} - ${product.priceMax.toFixed(2)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Stock:</span>
            <span className="text-white/60 font-black">{formatNumber(product.stockCount)}</span>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="btn-primary w-full md:w-auto px-8 h-12 flex items-center justify-center gap-3 flex-shrink-0 group/btn"
      >
        <TrendingUp className="w-4 h-4" />
        <span className="font-black uppercase tracking-widest text-xs">Add to Showcase</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
