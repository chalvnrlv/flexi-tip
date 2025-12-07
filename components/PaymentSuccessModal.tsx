import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose, orderId }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-300">

                {/* Animated Checkmark */}
                <div className="mb-6 flex justify-center">
                    <div className="w-32 h-32 relative">
                        <style>
                            {`
                @keyframes stroke {
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes scale {
                  0%, 100% { transform: none; }
                  50% { transform: scale3d(1.1, 1.1, 1); }
                }
                @keyframes fill {
                  100% { box-shadow: inset 0px 0px 0px 30px #4CAF50; }
                }
                .checkmark__circle {
                  stroke-dasharray: 166;
                  stroke-dashoffset: 166;
                  stroke-width: 2;
                  stroke-miterlimit: 10;
                  stroke: #4CAF50;
                  fill: none;
                  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .checkmark {
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  display: block;
                  stroke-width: 2;
                  stroke: #fff;
                  stroke-miterlimit: 10;
                  margin: 10% auto;
                  box-shadow: inset 0px 0px 0px #4CAF50;
                  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                }
                .checkmark__check {
                  transform-origin: 50% 50%;
                  stroke-dasharray: 48;
                  stroke-dashoffset: 48;
                  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
              `}
                        </style>
                        <div className="flex items-center justify-center h-full w-full bg-green-50 rounded-full">
                            <svg className="checkmark w-24 h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h2>
                <p className="text-gray-500 mb-6">
                    Terima kasih telah melakukan pembayaran.{orderId && <><br />ID Pesanan: <span className="font-mono text-gray-800 font-bold">{orderId}</span></>}
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        variant="primary"
                        className="w-full justify-center shadow-lg shadow-brand-medium/20"
                    >
                        Kembali ke Beranda
                    </Button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
