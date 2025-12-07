import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getOrdersByCustomer, MockOrder } from '../src/mockData';
import MainLayout from '../components/layout/MainLayout';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const [orders, setOrders] = useState<MockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

    useEffect(() => {
        if (user) {
            // Simulate API delay
            setTimeout(() => {
                const userOrders = getOrdersByCustomer(user.id);
                // Sort by newest first
                const sortedOrders = [...userOrders].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
                setLoading(false);
            }, 500);
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </MainLayout>
        )
    }

    if (!user) {
        return (
            <MainLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold mb-4">Silakan login untuk melihat riwayat pesanan</h2>
                    <Link to="/login" className="text-emerald-600 hover:underline">Masuk disini</Link>
                </div>
            </MainLayout>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipping': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={16} />;
            case 'processing': return <Package size={16} />;
            case 'shipping': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu Konfirmasi';
            case 'processing': return 'Sedang Diproses';
            case 'shipping': return 'Dalam Pengiriman';
            case 'delivered': return 'Selesai';
            default: return status;
        }
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Riwayat Pesanan</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">Belum ada pesanan</h3>
                        <p className="text-gray-500 mb-6">Yuk mulai belanja produk jastip favoritmu!</p>
                        <Link to="/catalog" className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition">
                            Lihat Katalog
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">

                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500 font-mono">{order.orderNumber}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Image Placeholder */}
                                        <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={order.image || "https://placehold.co/150x150/e2e8f0/64748b?text=Produk"}
                                                alt={order.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{order.productName}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Jastiper: <span className="font-semibold text-emerald-600">{order.jastiperName}</span></p>
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <span>{order.quantity} barang</span>
                                                <span className="mx-2">•</span>
                                                <span>Total Belanja: <span className="font-semibold text-gray-900">Rp {order.totalPrice.toLocaleString('id-ID')}</span></span>
                                            </div>
                                            {order.notes && (
                                                <p className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded">
                                                    "Catatan: {order.notes}"
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 justify-center min-w-[150px]">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition"
                                            >
                                                Lihat Detail
                                            </button>
                                            {order.status === 'delivered' && (
                                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">
                                                    Beli Lagi
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedOrder(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                            Detail Transaksi
                                        </h3>

                                        <div className="space-y-4">
                                            {/* Nominal Transaksi */}
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Nominal Transaksi</p>
                                                <p className="text-xl font-bold text-gray-900">Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}</p>
                                            </div>

                                            {/* Tanggal Sampai */}
                                            <div>
                                                <p className="text-sm text-gray-500">Tanggal Sampai</p>
                                                <p className="text-base font-medium text-gray-800">
                                                    {selectedOrder.deliveredAt
                                                        ? new Date(selectedOrder.deliveredAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                        : '-'}
                                                </p>
                                            </div>

                                            {/* Bukti Foto */}
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">Bukti Foto Pengiriman</p>
                                                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {selectedOrder.proofImage ? (
                                                        <img
                                                            src={selectedOrder.proofImage}
                                                            alt="Bukti Pengiriman"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                            <Package size={32} />
                                                            <span className="text-xs mt-2">Tidak ada foto</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ringkasan Produk */}
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">Produk</p>
                                                <div className="flex gap-3 items-center">
                                                    <img
                                                        src={selectedOrder.image || "https://placehold.co/150"}
                                                        className="w-12 h-12 rounded bg-gray-200 object-cover"
                                                        alt={selectedOrder.productName}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">{selectedOrder.productName}</p>
                                                        <p className="text-xs text-gray-500">{selectedOrder.quantity} x Rp {selectedOrder.productPrice.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default OrderHistory;
