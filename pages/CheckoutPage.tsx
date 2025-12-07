import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet, Building } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getProductById, saveOrder, MockProduct } from '../src/mockData';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';

interface CheckoutPageProps {
  productId: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ productId }) => {
  const { user, token } = useAuthStore();
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Form states
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'ewallet' | 'cod'>('transfer');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = () => {
    setLoading(true);
    setError('');

    try {
      const foundProduct = getProductById(productId);

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

  const calculateTotal = () => {
    if (!product) return 0;
    
    const itemPrice = product.price * quantity;
    const weight = product.estimatedWeight || 1;
    const shippingFeePerKg = 15000; // Default shipping fee per kg
    const shippingFee = shippingFeePerKg * weight * quantity;
    const serviceFee = 5000; // Flat service fee
    
    return itemPrice + shippingFee + serviceFee;
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

      // Success - redirect to dashboard
      alert('Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses.');
      window.location.href = '/dashboard';
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
          <Button onClick={() => window.history.back()}>Kembali</Button>
        </div>
      </MainLayout>
    );
  }

  // Payment Confirmation Modal
  if (showPaymentConfirm) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-brand-light/10 to-white pb-20 p-4">
          <div className="max-w-md mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-brand-darkest mb-4">
                Konfirmasi Pembayaran
              </h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Silakan lakukan pembayaran sesuai metode yang dipilih:
                </p>
                
                {paymentMethod === 'transfer' && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold mb-2">Transfer Bank</p>
                    <p className="text-sm">Bank: BCA</p>
                    <p className="text-sm">No. Rekening: 1234567890</p>
                    <p className="text-sm">Atas Nama: FlexiTip</p>
                  </div>
                )}
                
                {paymentMethod === 'ewallet' && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold mb-2">E-Wallet</p>
                    <p className="text-sm">GoPay / OVO / Dana</p>
                    <p className="text-sm">No. HP: 081234567890</p>
                  </div>
                )}
                
                {paymentMethod === 'cod' && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold mb-2">Cash on Delivery</p>
                    <p className="text-sm">Bayar saat barang tiba</p>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Total Pembayaran:</span>
                    <span className="text-lg font-bold text-brand-dark">
                      Rp {calculateTotal().toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handlePaymentConfirm}
                  isLoading={checkoutLoading}
                  className="w-full"
                >
                  Konfirmasi Pembayaran (Simulasi)
                </Button>
                <button
                  onClick={() => setShowPaymentConfirm(false)}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Kembali
                </button>
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
      <div className="min-h-screen bg-gradient-to-b from-brand-light/10 to-white pb-20">
        {/* Header */}
        <div className="bg-brand-medium p-4 text-white flex items-center gap-3">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>

        <div className="p-4 max-w-2xl mx-auto">
          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-brand-darkest mb-3">Detail Produk</h2>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 text-xs text-brand-medium mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.asalProduk} → {product.tujuanProduk}</span>
                </div>
                <p className="text-lg font-bold text-brand-dark">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Jumlah:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-brand-medium text-white hover:bg-brand-dark flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">
              Stok tersedia: {product.stock}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-brand-darkest mb-3">Alamat Pengiriman</h2>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap pengiriman..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm"
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-brand-darkest mb-3">Metode Pembayaran</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="h-4 w-4 text-brand-medium"
                />
                <Building className="h-5 w-5 text-brand-medium" />
                <span className="text-sm font-medium">Transfer Bank</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="ewallet"
                  checked={paymentMethod === 'ewallet'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="h-4 w-4 text-brand-medium"
                />
                <Wallet className="h-5 w-5 text-brand-medium" />
                <span className="text-sm font-medium">E-Wallet (GoPay/OVO/Dana)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="h-4 w-4 text-brand-medium"
                />
                <CreditCard className="h-5 w-5 text-brand-medium" />
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-brand-darkest mb-3">Catatan (Opsional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk penjual..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-brand-darkest mb-3">Ringkasan Harga</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Harga Produk ({quantity}x)</span>
                <span>Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
              </div>
              {product.jastipService && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Ongkir ({product.estimatedWeight || 1}kg x {quantity})
                    </span>
                    <span>
                      Rp {((product.jastipService.pricePerKg * (product.estimatedWeight || 1) * quantity)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Layanan</span>
                    <span>Rp {product.jastipService.serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand-dark">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            isLoading={checkoutLoading}
            className="w-full shadow-lg"
          >
            Proses Checkout
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
