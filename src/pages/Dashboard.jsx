import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login atau belum secara real-time
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ambil data hasil kuis dari Firestore berdasarkan UID user
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      } else {
        // Kalau iseng bypass link tapi belum login, tendang balik ke halaman kuis
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#94a3b8' }}>Memuat Data Projek...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '40px auto', background: '#1e1b4b', color: '#fff', borderRadius: '20px', fontFamily: 'sans-serif', border: '1px solid #312e81' }}>
      <h2 style={{ marginBottom: '10px' }}>Halo, {userData?.displayName || 'Klien'}! 👋</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Data kuis kamu berhasil direkam dengan aman.</p>
      
      <div style={{ background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '12px', margin: '24px 0', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#a78bfa' }}>Ringkasan Projek Anda:</h4>
        <p style={{ margin: '6px 0' }}><b>Nama Klien:</b> {userData?.contactName}</p>
        <p style={{ margin: '6px 0' }}><b>Layanan Utama:</b> <span style={{ textTransform: 'uppercase' }}>{userData?.service}</span></p>
        <p style={{ margin: '6px 0' }}><b>Kisaran Budget:</b> {userData?.budget}</p>
        <p style={{ margin: '6px 0' }}><b>Target Waktu:</b> {userData?.deadline}</p>
        <p style={{ margin: '6px 0' }}><b>Status Review:</b> <span style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{userData?.status}</span></p>
      </div>

      <button 
        onClick={() => navigate('/checkout')}
        style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' }}
      >
        Lanjutkan ke Invoice &amp; Bayar QRIS
      </button>
    </div>
  );
}