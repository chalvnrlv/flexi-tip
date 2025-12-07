import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, ShoppingCart, Sparkles, Plane as PlaneIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { filterProducts, MockProduct } from '../src/mockData';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';
import AIChat from '../components/AIChat';

const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState<'local' | 'global'>('local');
  const [asalProduk, setAsalProduk] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.asalDaerah) {
      loadProducts();
    }
  }, [filterType, user]);

  const loadProducts = () => {
    if (!user?.asalDaerah) {
      setError('Asal daerah tidak ditemukan. Silakan lengkapi profil Anda.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Gunakan filterProducts dari mockData
      const filtered = filterProducts({
        type: filterType,
        asalProduk: asalProduk || undefined,
        tujuanProduk: user.asalDaerah,
      });

      setProducts(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleCheckout = (productId: string) => {
    // Navigate ke halaman checkout
    navigate(`/checkout/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pb-20 font-poppins">
        {/* Dynamic Hero Section */}
        <div className="relative bg-gradient-to-r from-brand-dark via-brand-medium to-brand-green pt-12 pb-24 px-6 md:px-12 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-brand-light/20 blur-2xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              Jelajahi Produk
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed">
              Temukan barang impian dari berbagai negara atau daerah, langsung dibawa oleh traveler terpercaya.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm text-xs font-medium">
                <MapPin className="h-3.5 w-3.5" />
                Lokasi Anda: {user?.asalDaerah || 'Belum diatur'}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Rekomendasi Terbaik
              </div>
            </div>
          </div>
        </div>

        {/* Floating Filter Section */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 -mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6 transition-transform">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">

              {/* Type Toggle */}
              <div className="w-full md:w-auto flex bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setFilterType('local')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${filterType === 'local'
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <MapPin className="h-4 w-4" />
                  Lokal
                </button>
                <button
                  onClick={() => setFilterType('global')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${filterType === 'global'
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Globe className="h-4 w-4" />
                  Global
                </button>
              </div>

              {/* Location Filter */}
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Asal Produk</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-brand-medium" />
                  </div>
                  <input
                    type="text"
                    value={asalProduk}
                    onChange={(e) => setAsalProduk(e.target.value)}
                    placeholder="Semua Lokasi..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Cari Barang</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-brand-medium" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nama produk..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-brand-medium hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-medium/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span className="md:hidden">Cari</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-medium border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Memuat produk terbaik...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="max-w-7xl mx-auto px-4 mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Hasil Pencarian
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {filteredProducts.length}
              </span>
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                  Cobalah kata kunci yang berbeda atau atur ulang filter lokasi Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {product.stock > 0 ? (
                          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Stok: {product.stock}
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Habis
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        {product.brand && (
                          <p className="text-xs font-bold text-brand-medium uppercase tracking-wider mb-1">{product.brand}</p>
                        )}
                        <h3 className="font-bold text-gray-900 leading-snug mb-1 group-hover:text-brand-dark transition-colors line-clamp-2" title={product.name}>
                          {product.name}
                        </h3>

                        {/* Route Info */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                          <PlaneIcon className="h-3 w-3 text-brand-light" />
                          <span className="truncate max-w-[150px]">
                            {product.asalProduk} → {product.tujuanProduk}
                          </span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Harga</p>
                            <p className="text-lg font-extrabold text-brand-dark">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCheckout(product.id)}
                          disabled={product.stock === 0}
                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${product.stock > 0
                            ? 'bg-brand-dark text-white hover:bg-brand-medium shadow-brand-dark/20'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                          {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Chat Button */}
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-medium to-brand-dark text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-bounce-slow"
          title="Tanya AI Assistant"
        >
          <Sparkles className="h-7 w-7" />
        </button>

        {/* AI Chat Modal */}
        <AIChat
          context={filterType}
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
        />
      </div>
    </MainLayout>
  );
};

export default ProductCatalog;
