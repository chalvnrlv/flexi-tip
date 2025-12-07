import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet, Building, MessageCircle, QrCode } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getProductById, saveOrder, MockProduct } from '../src/mockData';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';
import ChatJastiper from '../components/ChatJastiper';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import { useNavigate, useParams } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form states
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [generatedQR, setGeneratedQR] = useState('');

  // Enhanced Dropdown States
  const [shippingOption, setShippingOption] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('flexipay');

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (paymentMethod === 'qris' && showPaymentConfirm) {
      // Generate fake QR string
      setGeneratedQR(`QR-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    }
  }, [paymentMethod, showPaymentConfirm]);

  const loadProduct = () => {
    setLoading(true);
    setError('');

    try {
      const foundProduct = getProductById(productId!);

      if (!foundProduct) {
        throw new Error('Produk tidak ditemukan');
      }

      setProduct(foundProduct);

      // Set default shipping address from user
      if (user?.asalDaerah) {
        setShippingAddress(user.asalDaerah);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getShippingFee = () => {
    switch (shippingOption) {
      case 'express': return 25000;
      case 'regular': return 15000;
      case 'cargo': return 10000;
      default: return 15000;
    }
  };

  const getJastipFee = () => {
    if (!product) return 0;
    return 15000;
  };

  const calculateTotal = () => {
    if (!product) return 0;

    const itemPrice = product.price * quantity;
    const tax = itemPrice * 0.11;
    const jastipFee = getJastipFee();
    const adminFee = 5000;
    const shipping = getShippingFee();

    return itemPrice + tax + jastipFee + adminFee + shipping;
  };

  const handleCheckout = () => {
    if (!product || !user?.id) return;

    if (quantity > product.stock) {
      setError('Jumlah melebihi stok tersedia');
      return;
    }

    if (!shippingAddress) {
      setError('Alamat pengiriman harus diisi');
      return;
    }

    setCheckoutLoading(true);
    setError('');

    try {
      // Save order using mockData helper
      const newOrder = saveOrder({
        userId: user.id,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity,
        shippingAddress,
        paymentMethod,
        notes,
      });

      // Show payment confirmation
      setOrderId(newOrder.id);
      setShowPaymentConfirm(true);
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePaymentConfirm = () => {
    if (!orderId) return;

    setCheckoutLoading(true);
    setError('');

    try {
      // Update order status in localStorage
      const stored = localStorage.getItem('flexitip_orders');
      const allOrders = stored ? JSON.parse(stored) : [];

      const orderIndex = allOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex !== -1) {
        allOrders[orderIndex].paymentStatus = 'paid';
        allOrders[orderIndex].status = 'processing';
        localStorage.setItem('flexitip_orders', JSON.stringify(allOrders));
      }

      // Success - close payment modal and show success modal
      setShowPaymentConfirm(false);
      setShowSuccessModal(true);

    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
        </div>
      </MainLayout>
    );
  }

  // Payment Confirmation Modal
  if (showPaymentConfirm) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 pb-20 p-4 font-poppins">
          <div className="max-w-md mx-auto mt-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-brand-medium p-6 text-white text-center">
                <h2 className="text-xl font-bold mb-1">Konfirmasi Pembayaran</h2>
                <p className="text-brand-light text-sm">Selesaikan pembayaran untuk memproses pesanan</p>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
                  <span className="text-gray-600 font-medium">Tagihan Total</span>
                  <span className="text-xl font-bold text-brand-dark">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>

                {paymentMethod === 'flexipay' && (
                  <div className="bg-brand-light/10 p-5 rounded-2xl border border-brand-light/20 mb-6 text-center">
                    <Wallet className="h-10 w-10 text-brand-medium mx-auto mb-3" />
                    <p className="font-bold text-lg text-brand-dark mb-1">Flexi-Pay</p>
                    <p className="text-sm text-gray-500">Saldo akan terpotong secara otomatis.</p>
                    <div className="mt-3 bg-white px-3 py-1 rounded-full inline-block text-xs font-bold text-green-600 border border-green-100">
                      Saldo Cukup
                    </div>
                  </div>
                )}

                {paymentMethod === 'qris' && (
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 flex flex-col items-center">
                    <p className="font-bold text-gray-800 mb-3">Scan QRIS</p>
                    <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                      {/* Simulated QR Code */}
                      <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-white text-xs relative overflow-hidden">
                        <div className="absolute inset-0 bg-white grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                          ))}
                        </div>
                        {/* Center Logo Area */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-black border-2 border-brand-medium">QR</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-mono">{generatedQR}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handlePaymentConfirm}
                    isLoading={checkoutLoading}
                    variant="primary"
                    className="w-full py-3.5 text-base shadow-lg shadow-brand-medium/20"
                  >
                    Bayar
                  </Button>
                  <button
                    onClick={() => setShowPaymentConfirm(false)}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Main Checkout Page
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pb-32 font-poppins">
        {/* Header */}
        <div className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-4 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Checkout Pengiriman</h1>
        </div>

        <div className="p-4 max-w-2xl mx-auto space-y-4 pt-6">

          {/* 1. Alamat Pengiriman */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-medium" />
              Alamat Pengiriman
            </h2>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap (Jalan, No. Rumah, Kecamatan, Kota, Kode Pos)..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/50 focus:bg-white transition-all text-sm resize-none"
            />
            <div className="flex justify-end mt-2">
              <button className="text-xs font-bold text-brand-medium hover:text-brand-dark transition-colors">
                Simpan Alamat
              </button>
            </div>
          </div>

          {/* 2. Preview Produk */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-brand-dark font-extrabold mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    <span className="font-medium">Stok: {product.stock}</span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 rounded-full bg-white text-gray-600 hover:text-brand-dark shadow-sm flex items-center justify-center font-bold text-xs transition-transform active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-6 h-6 rounded-full bg-brand-medium text-white shadow-sm flex items-center justify-center font-bold text-xs transition-transform active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Opsi Pengiriman */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">Opsi Pengiriman</label>
            <div className="relative">
              <select
                value={shippingOption}
                onChange={(e) => setShippingOption(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-brand-medium"
              >
                <option value="regular">Reguler (Rp 15.000) - Estimasi 3-5 Hari</option>
                <option value="express">Express (Rp 25.000) - Estimasi 1-2 Hari</option>
                <option value="cargo">Kargo (Rp 10.000) - Estimasi 5-7 Hari</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>

          {/* 4. Metode Pembayaran */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden ${paymentMethod === 'flexipay' ? 'border-brand-medium bg-brand-light/5 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="flexipay" checked={paymentMethod === 'flexipay'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-full ${paymentMethod === 'flexipay' ? 'bg-brand-medium text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-bold ${paymentMethod === 'flexipay' ? 'text-brand-dark' : 'text-gray-600'}`}>Flexi-Pay</span>
                </div>
                {paymentMethod === 'flexipay' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-medium animate-pulse"></div>}
              </label>

              <label className={`cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden ${paymentMethod === 'qris' ? 'border-brand-medium bg-brand-light/5 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-full ${paymentMethod === 'qris' ? 'bg-brand-medium text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-bold ${paymentMethod === 'qris' ? 'text-brand-dark' : 'text-gray-600'}`}>QRIS</span>
                </div>
                {paymentMethod === 'qris' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-medium animate-pulse"></div>}
              </label>
            </div>
          </div>

          {/* 5. Rincian Harga */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Rincian Pembayaran</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Harga Produk ({quantity} barang)</span>
                <span>Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pajak PPN (11%)</span>
                <span>Rp {((product.price * quantity) * 0.11).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Jastip (Lokal)</span>
                <span>Rp {getJastipFee().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Admin</span>
                <span>Rp 5.000</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span>Rp {getShippingFee().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Promo</span>
                <span>-</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 mt-2 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Pembayaran</span>
                <span className="font-extrabold text-xl text-brand-dark">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">Catatan untuk Jastiper</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Warna, ukuran, atau request khusus..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/50 transition-all text-sm resize-none"
            />
          </div>

        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={() => setShowChat(true)}
              className="flex flex-col items-center justify-center px-4 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"
            >
              <MessageCircle className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-bold">Chat</span>
            </button>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="flex-1 bg-gradient-to-r from-brand-dark to-brand-medium text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-medium/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Pesan Sekarang</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chat Jastiper Modal */}
        <ChatJastiper
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          jastiperName="Budi Traveler"
          jastiperLocation={product.asalProduk}
          returnDate="25 Des 2024"
          productStock={product.stock}
        />

        {/* Payment Success Modal */}
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderId={orderId}
        />

      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
