import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, Camera, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { MOCK_PRODUCTS, MockProduct, INDONESIA_CITIES, GLOBAL_LOCATIONS } from '../src/mockData';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';
import AIChat from '../components/AIChat';

const JastiperDashboard: React.FC = () => {
  const { user, token } = useAuthStore();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    asalProduk: '',
    tujuanProduk: user?.asalDaerah || '',
    stock: '',
    category: '',
    brand: '',
    images: [] as string[],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (user?.asalDaerah) {
      setFormData(prev => ({ ...prev, asalProduk: user.asalDaerah || '' }));
    }
  }, [user]);

  const loadProducts = () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');

    try {
      // Load products from localStorage or use MOCK_PRODUCTS
      const stored = localStorage.getItem('flexitip_products');
      const allProducts = stored ? JSON.parse(stored) : MOCK_PRODUCTS;

      // Filter products by current jastiper
      const myProducts = allProducts.filter((p: MockProduct) => p.jastiperId === user.id);

      setProducts(myProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageAdd = () => {
    const imageUrl = prompt('Masukkan URL gambar:');
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    // Validation
    if (!formData.name || !formData.price || !formData.asalProduk || !formData.stock) {
      setError('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Load existing products
      const stored = localStorage.getItem('flexitip_products');
      const allProducts: MockProduct[] = stored ? JSON.parse(stored) : [...MOCK_PRODUCTS];

      if (editingProduct) {
        // Update existing product
        const index = allProducts.findIndex(p => p.id === editingProduct.id);
        if (index !== -1) {
          allProducts[index] = {
            ...allProducts[index],
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
          };
        }
      } else {
        // Create new product
        const newProduct: MockProduct = {
          id: 'product-' + Date.now(),
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: 'IDR',
          asalProduk: formData.asalProduk,
          tujuanProduk: formData.tujuanProduk,
          images: formData.images.length > 0 ? formData.images : [`https://placehold.co/400x400/png?text=${encodeURIComponent(formData.name)}`],
          stock: parseInt(formData.stock),
          category: formData.category,
          brand: formData.brand,
          estimatedWeight: 0.5,
          jastiperId: user.id,
          jastiperName: user.name,
          type: GLOBAL_LOCATIONS.includes(formData.asalProduk) ? 'global' : 'local',
          status: 'available',
        };
        allProducts.push(newProduct);
      }

      // Save to localStorage
      localStorage.setItem('flexitip_products', JSON.stringify(allProducts));

      // Success
      alert(editingProduct ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: MockProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      asalProduk: product.asalProduk,
      tujuanProduk: product.tujuanProduk,
      stock: product.stock.toString(),
      category: product.category || '',
      brand: product.brand || '',
      images: product.images || [],
    });
    setShowAddModal(true);
  };

  const handleDelete = (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      // Load existing products
      const stored = localStorage.getItem('flexitip_products');
      const allProducts: MockProduct[] = stored ? JSON.parse(stored) : [...MOCK_PRODUCTS];

      // Remove product
      const filtered = allProducts.filter(p => p.id !== productId);

      // Save to localStorage
      localStorage.setItem('flexitip_products', JSON.stringify(filtered));

      alert('Produk berhasil dihapus!');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      asalProduk: '',
      tujuanProduk: user?.asalDaerah || '',
      stock: '',
      category: '',
      brand: '',
      images: [],
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    resetForm();
    setError('');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pb-20 font-poppins">
        {/* Dynamic Hero Section */}
        <div className="relative bg-gradient-to-r from-brand-dark via-brand-medium to-brand-green pt-10 pb-20 px-6 md:px-12 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-brand-light/20 blur-2xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                Dashboard Jastiper
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed">
                Kelola produk jastip, pantau pesanan, dan atur layanan Anda dalam satu tempat.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                Laporan
              </button>
              <button className="bg-white text-brand-dark hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                Pengaturan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section - Floating functionality */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 -mt-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Products Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-transform">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Produk Aktif</p>
                <p className="text-3xl font-extrabold text-brand-dark">{products.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-brand-light/20 flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors">
                <Package className="h-6 w-6" />
              </div>
            </div>

            {/* Add Product Action Card */}
            <button
              onClick={() => setShowAddModal(true)}
              className="col-span-1 md:col-span-2 bg-gradient-to-r from-brand-medium to-brand-dark rounded-2xl p-5 shadow-lg border border-transparent flex items-center justify-center gap-3 text-white hover:shadow-xl hover:scale-[1.01] transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold">Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && !showAddModal && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="p-4 bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}

        {/* Products List Title */}
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Daftar Produk Anda
          </h2>
        </div>

        {/* Products List Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {loading && products.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-brand-dark font-medium text-lg mb-2">Belum ada produk</p>
              <p className="text-gray-500 text-sm mb-6">Mulai perjalanan jastip Anda dengan menambahkan produk pertama.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-brand-medium text-white rounded-xl font-bold hover:bg-brand-dark transition-colors"
              >
                Tambah Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="p-4 flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-brand-medium uppercase tracking-wider mb-0.5">{product.brand || 'No Brand'}</p>
                          <h3 className="font-bold text-brand-darkest truncate pr-2" title={product.name}>
                            {product.name}
                          </h3>
                        </div>
                        <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock > 0 ? 'Aktif' : 'Habis'}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-xs text-gray-500 gap-1.5">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{product.asalProduk}</span>
                        <span>→</span>
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{product.tujuanProduk}</span>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Harga</p>
                          <p className="text-base font-bold text-brand-dark">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Stok</p>
                          <p className="text-sm font-semibold text-gray-700">{product.stock}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-brand-light/10 hover:border-brand-medium hover:text-brand-dark transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center justify-center p-2 rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                      title="Hapus Produk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal - Improved Design */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-poppins">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-5 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-brand-darkest">
                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Lengkapi detail produk jastip Anda</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Nama Produk */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: iPhone 15 Pro Max"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Apple, Nike..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all"
                    />
                  </div>
                  {/* Kategori */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Elektronik..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Jelaskan detail produk, kondisi, dan kelengkapan..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Harga */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all"
                      required
                    />
                  </div>
                  {/* Stok */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Asal & Tujuan (Read Only style) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Rute Jastip (Otomatis)
                    </label>
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                      <div className="flex-1 bg-white p-2 rounded-lg border border-gray-200 text-center">
                        {formData.asalProduk || user?.asalDaerah || '-'}
                      </div>
                      <span className="text-gray-400">➜</span>
                      <div className="flex-1 bg-white p-2 rounded-lg border border-gray-200 text-center">
                        {formData.tujuanProduk || user?.asalDaerah || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                    Foto Produk
                  </label>
                  <div className="space-y-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden shrink-0">
                          <img src={img} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={img}
                          readOnly
                          className="flex-1 bg-transparent border-none text-xs text-gray-500 focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(idx)}
                          className="p-1.5 bg-red-100 text-red-500 rounded-md hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleImageAdd}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-brand-medium hover:text-brand-medium hover:bg-brand-light/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Camera className="h-5 w-5" />
                      Tambah URL Gambar
                    </button>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    Batal
                  </button>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="flex-1 py-3 rounded-xl shadow-lg shadow-brand-medium/20"
                  >
                    {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                  </Button>
                </div>
              </form>
            </div>
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
          context="local"
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
        />
      </div>
    </MainLayout>
  );
};

export default JastiperDashboard;
