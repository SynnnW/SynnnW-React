import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function CheckoutQRIS() {
  const navigate = useNavigate();
  const [orderId] = useState('SYN-' + Math.floor(100000 + Math.random() * 900000));
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/');
      return;
    }

    // Menginisialisasi data invoice simulasi di database Firestore
    const txRef = doc(db, 'transactions', orderId);
    setDoc(txRef, {
      orderId: orderId,
      uid: user.uid,
      status: 'pending',
      amount: 'Rp 150.000',
    });

    // Pasang "mata-mata" real-time (onSnapshot) pada data transaksi ini
    const unsubscribe = onSnapshot(txRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStatus(data.status);

        // Jika status di Firestore diubah oleh "backend/simulator" menjadi success
        if (data.status === 'settlement' || data.status === 'success') {
          alert('🎉 Pembayaran Sukses Diterima secara Real-time!');
          navigate('/dashboard');
        }
      }
    });

    return () => unsubscribe();
  }, [orderId, navigate]);

  // Simulasi jika Webhook Midtrans Sandbox menembak database kamu
  const handleSimulatePayment = async () => {
    const txRef = doc(db, 'transactions', orderId);
    await setDoc(txRef, { status: 'settlement' }, { merge: true });
  };

  return (
    <div style={{ padding: '40px', maxWidth: '450px', margin: '40px auto', background: '#0f172a', color: '#fff', borderRadius: '20px', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #1e293b' }}>
      <h3 style={{ margin: '0 0 5px' }}>Pembayaran SynnnW</h3>
      <p style={{ color: '#94a3b8', fontSize: '13px' }}>ID Transaksi: <code style={{ color: '#38bdf8' }}>{orderId}</code></p>
      
      {/* Box Simulasi QR Code */}
      <div style={{ margin: '30px auto', width: '220px', height: '220px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '50px' }}>🔲</div>
        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '5px 0 0', color: '#475569' }}>MOCK QRIS SANDBOX</p>
      </div>

      <p style={{ fontSize: '15px' }}>Status Saat Ini: <b style={{ color: status === 'pending' ? '#f59e0b' : '#10b981', background: status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '6px' }}>{status.toUpperCase()}</b></p>
      
      <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8' }}>💡 Klik tombol di bawah untuk pura-pura membayar dari simulator Midtrans:</p>
        <button 
          onClick={handleSimulatePayment}
          style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
        >
          Simulasikan Bayar Sukses
        </button>
      </div>
    </div>
  );
}