import React from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import successAnimation from '../src/assets/animations/success.json';
import Button from './Button';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
    isOpen,
    onClose,
    orderId
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleHome = () => {
        onClose();
        navigate('/dashboard');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-40 h-40 mb-2">
                    <Lottie
                        animationData={successAnimation}
                        loop={false}
                        autoplay={true}
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Terima kasih! Pesanan Anda sedang diproses dan notifikasi telah dikirim ke Jastiper.
                </p>

                {orderId && (
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 mb-6">
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="font-mono font-medium text-gray-700">{orderId}</p>
                    </div>
                )}

                <Button
                    onClick={handleHome}
                    variant="primary"
                    className="w-full shadow-lg shadow-brand-medium/20"
                >
                    Kembali ke Beranda
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
