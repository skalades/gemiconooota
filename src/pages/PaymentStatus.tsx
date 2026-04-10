import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Midtrans usually sends order_id, status_code, transaction_status via query params
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');

  let statusConfig = {
    icon: <Clock className="w-16 h-16 text-yellow-400 mb-6 mx-auto" />,
    title: 'Payment Pending',
    desc: 'Pesanan Anda sedang diproses. Silakan selesaikan pembayaran.',
    color: 'text-yellow-400'
  };

  if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
    statusConfig = {
      icon: <CheckCircle2 className="w-16 h-16 text-neon-emerald mb-6 mx-auto" />,
      title: 'Payment Successful!',
      desc: 'Terima kasih, pembayaran Anda telah kami terima.',
      color: 'text-neon-emerald'
    };
  } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
     statusConfig = {
      icon: <XCircle className="w-16 h-16 text-red-500 mb-6 mx-auto" />,
      title: 'Payment Failed',
      desc: 'Mohon maaf, pembayaran Anda gagal atau dibatalkan.',
      color: 'text-red-500'
    };
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 font-sans">
      <div className="glass-card max-w-lg w-full p-10 text-center border-white/5">
        {statusConfig.icon}
        <h1 className={`text-3xl font-display font-bold mb-4 ${statusConfig.color}`}>{statusConfig.title}</h1>
        <p className="text-white/60 mb-8">{statusConfig.desc}</p>
        
        {orderId && (
          <div className="bg-white/5 p-4 rounded-xl mb-8">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Order ID</p>
            <p className="font-mono text-white tracking-wider">{orderId}</p>
          </div>
        )}

        <button 
          onClick={() => navigate('/')} 
          className="neon-button px-8 py-3 w-full"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
