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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
        <p className="text-white/60 mt-1">
          Browse 213+ products with boosted commission rates
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-12"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field pr-10 appearance-none cursor-pointer min-w-[180px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field pr-10 appearance-none cursor-pointer min-w-[160px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <SortAsc className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'btn-secondary flex items-center gap-2',
            showFilters && 'bg-aa-orange/10 border-aa-orange/30 text-aa-orange'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        {/* View Mode Toggle */}
        <div className="flex bg-aa-dark-500 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-aa-orange text-white'
                : 'text-white/40 hover:text-white'
            )}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-aa-orange text-white'
                : 'text-white/40 hover:text-white'
            )}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card animate-slide-down">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={freeSampleOnly}
                onChange={(e) => setFreeSampleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-aa-dark-500 text-aa-orange focus:ring-aa-orange"
              />
              <span className="text-sm text-white">Free Sample Available</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(searchQuery || selectedCategory !== 'All Categories' || freeSampleOnly) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 px-3 py-1 bg-aa-dark-500 rounded-full text-sm text-white/60 hover:text-white"
            >
              Search: {searchQuery}
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedCategory !== 'All Categories' && (
            <button
              onClick={() => setSelectedCategory('All Categories')}
              className="flex items-center gap-1 px-3 py-1 bg-aa-dark-500 rounded-full text-sm text-white/60 hover:text-white"
            >
              {selectedCategory}
              <X className="w-3 h-3" />
            </button>
          )}
          {freeSampleOnly && (
            <button
              onClick={() => setFreeSampleOnly(false)}
              className="flex items-center gap-1 px-3 py-1 bg-aa-dark-500 rounded-full text-sm text-white/60 hover:text-white"
            >
              Free Sample
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-white/40">
        Showing {filteredProducts.length} of {mockProducts.length} products
      </p>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => handleAddToShowcase(product.tiktokProductId)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onAdd={() => handleAddToShowcase(product.tiktokProductId)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
          <p className="text-white/60">
            Try adjusting your search or filters
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
    <div className="card group hover:border-aa-orange/30 transition-all">
      {/* Image */}
      <div className="relative aspect-square rounded-lg bg-aa-dark-400 mb-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-white/10" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="badge-gold text-xs">
            +{formatPercent(bonusRate, 0)} Bonus
          </span>
          {product.freeSampleAvailable && (
            <span className="badge-success text-xs">
              <Gift className="w-3 h-3 mr-1" />
              Free Sample
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-xs text-white/40 mb-1">{product.category}</p>
        <h3 className="font-medium text-white line-clamp-2 mb-3 min-h-[48px]">
          {product.name}
        </h3>

        {/* Commission Rates */}
        <div className="flex items-center gap-3 mb-3">
          <div>
            <span className="text-lg font-bold text-aa-success">
              {formatPercent(product.aaCommissionRate, 0)}
            </span>
            <span className="text-xs text-white/40 ml-1">AA Rate</span>
          </div>
          <div className="text-white/20">vs</div>
          <div>
            <span className="text-sm text-white/60">
              {formatPercent(product.openCollabRate, 0)}
            </span>
            <span className="text-xs text-white/40 ml-1">Open</span>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-white">
            ${product.priceMin.toFixed(2)} - ${product.priceMax.toFixed(2)}
          </span>
          <span className="text-white/40">
            {formatNumber(product.stockCount)} in stock
          </span>
        </div>

        {/* Add Button */}
        <button
          onClick={onAdd}
          className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
        >
          <TrendingUp className="w-4 h-4" />
          Add to Showcase
          <ExternalLink className="w-3 h-3" />
        </button>
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
    <div className="card flex items-center gap-4 hover:border-aa-orange/30 transition-all">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg bg-aa-dark-400 flex-shrink-0 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-white/10" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-medium text-white truncate">{product.name}</h3>
          <span className="badge-gold text-xs flex-shrink-0">
            +{formatPercent(bonusRate, 0)}
          </span>
          {product.freeSampleAvailable && (
            <span className="badge-success text-xs flex-shrink-0">
              <Gift className="w-3 h-3" />
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 mb-2">{product.category}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-aa-success font-medium">
            {formatPercent(product.aaCommissionRate, 0)} AA
          </span>
          <span className="text-white/40">
            vs {formatPercent(product.openCollabRate, 0)} Open
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white">
            ${product.priceMin.toFixed(2)} - ${product.priceMax.toFixed(2)}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/40">
            {formatNumber(product.stockCount)} stock
          </span>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="btn-primary flex items-center gap-2 flex-shrink-0"
      >
        <TrendingUp className="w-4 h-4" />
        Add
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}
