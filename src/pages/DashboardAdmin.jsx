import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const CSS = `
.da-page { min-height: 100vh; background: var(--bg, #070709); padding: 100px 40px 60px; color: var(--text, #fff); font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; }
.da-orb { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(100px); top: -200px; right: -200px; background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%); z-index: 0; pointer-events: none; }
.da-wrap { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; }
.da-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.1)); padding-bottom: 20px; }
.da-title { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; color: #fff; margin: 0; }
.da-title em { color: var(--accent3, #a78bfa); font-style: italic; }
.da-btn-logout { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 10px 20px; border-radius: 99px; cursor: pointer; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.da-btn-logout:hover { background: rgba(239,68,68,0.15); }
.da-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.da-card { background: var(--glass, rgba(255,255,255,0.03)); border: 1px solid var(--gborder, rgba(255,255,255,0.09)); border-radius: 20px; padding: 24px; backdrop-filter: blur(18px); }
.da-card h3 { margin: 0 0 10px; font-size: 1.1rem; color: var(--accent3, #a78bfa); }
.da-card p { margin: 0; font-size: 0.85rem; color: var(--text-dim, #94a3b8); line-height: 1.6; }
.da-panel { background: var(--glass, rgba(255,255,255,0.04)); border: 1px solid var(--gborder, rgba(255,255,255,0.08)); border-radius: 28px; padding: 28px; backdrop-filter: blur(20px); }
.da-panel h2 { margin: 0 0 14px; font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #fff; }
.da-panel p { margin: 0 0 20px; color: var(--text-dim, #94a3b8); line-height: 1.7; }
.da-form { display: grid; gap: 16px; }
.da-field { display: grid; gap: 8px; }
.da-field label { font-size: 0.76rem; color: var(--text-dim); letter-spacing: 0.08em; text-transform: uppercase; }
.da-input, .da-textarea, .da-select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: #fff; padding: 12px 14px; font-family: 'Outfit', sans-serif; font-size: 0.95rem; outline: none; }
.da-textarea { min-height: 120px; resize: vertical; }
.da-select { appearance: none; }
.da-form-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.da-btn { border: none; border-radius: 16px; padding: 12px 20px; cursor: pointer; font-weight: 700; transition: all 0.2s; }
.da-btn-primary { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: #fff; }
.da-btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.12); }
.da-btn:hover { transform: translateY(-1px); }
.da-msg { font-size: 0.9rem; color: #a78bfa; }
.da-error { color: #fca5a5; }
.da-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
.da-table th, .da-table td { padding: 14px 12px; text-align: left; font-size: 0.88rem; color: var(--text); }
.da-table th { color: var(--text-dim); font-weight: 700; letter-spacing: 0.08em; }
.da-table tbody tr { border-top: 1px solid rgba(255,255,255,0.08); }
.da-table tbody tr:hover { background: rgba(255,255,255,0.04); }
.da-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.da-pill-pending { background: rgba(251,191,36,0.12); color: #facc15; border: 1px solid rgba(251,191,36,0.25); }
.da-pill-progress { background: rgba(139,92,246,0.12); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.25); }
.da-pill-done { background: rgba(74,222,128,0.12); color: #86efac; border: 1px solid rgba(74,222,128,0.25); }
.da-order-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 22px; padding: 22px; margin-bottom: 20px; background: rgba(255,255,255,0.03); }
.da-order-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 18px; }
.da-order-title { margin: 0; font-size: 1rem; color: #fff; }
.da-order-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.da-order-meta span { display: block; color: var(--text-dim); font-size: 0.82rem; }
.da-order-list { margin-top: 18px; display: grid; gap: 14px; }
.da-order-step { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.03); }
.da-order-step span { font-size: 0.84rem; }
.da-select-sm { width: 100%; max-width: 260px; }
@media (max-width: 960px) {
  .da-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .da-wrap { padding: 0 20px; }
  .da-panel { padding: 20px; }
}
`;

const STATUS_OPTIONS = [
  'Pending',
  'Import & Rough Cut',
  'Cutting Kasar',
  'Efek Visual',
  'Audio / Backsound',
  'Final Review & Export',
  'Selesai',
];

const CATEGORY_OPTIONS = [
  'Video Editing',
  'Motion Graphic',
  'Desain Grafis',
  'Umum',
];

const INITIAL_FORM = {
  name: '',
  price: '',
  unit: '/ paket',
  description: '',
  category: 'Video Editing',
  icon: 'fa-tag',
  badge: '',
  comingSoon: false,
  custom: false,
};

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingStatusId, setSavingStatusId] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  useEffect(() => {
    const q = query(collection(db, 'prices'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPrices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingPrices(false);
    }, (err) => {
      console.error('[DashboardAdmin] prices subscription failed', err);
      setError('Gagal memuat data price list.');
      setLoadingPrices(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingOrders(false);
    }, (err) => {
      console.error('[DashboardAdmin] orders subscription failed', err);
      setError('Gagal memuat data order.');
      setLoadingOrders(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage('');
  };

  const handleEditPrice = (price) => {
    setEditingId(price.id);
    setForm({
      name: price.name || '',
      price: price.price?.toString() || '',
      unit: price.unit || '/ paket',
      description: price.description || '',
      category: price.category || 'Video Editing',
      icon: price.icon || 'fa-tag',
      badge: price.badge || '',
      comingSoon: price.comingSoon || false,
      custom: price.custom || false,
    });
    setMessage('Edit mode aktif. Simpan untuk memperbarui paket.');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setMessage('');
    setError('');
  };

  const handleSavePrice = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Nama paket wajib diisi.');
      return;
    }
    setError('');
    const payload = {
      name: form.name.trim(),
      price: Number(form.price || 0),
      unit: form.unit.trim() || '/ paket',
      description: form.description.trim(),
      category: form.category,
      icon: form.icon.trim() || 'fa-tag',
      badge: form.badge.trim() || null,
      comingSoon: form.comingSoon,
      custom: form.custom,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'prices', editingId), payload);
        setMessage('Data paket berhasil diperbarui.');
      } else {
        await addDoc(collection(db, 'prices'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setMessage('Paket baru berhasil ditambahkan.');
      }
      resetForm();
    } catch (err) {
      console.error('[DashboardAdmin] save price failed', err);
      setError('Gagal menyimpan paket. Coba lagi.');
    }
  };

  const handleDeletePrice = async (priceId) => {
    const confirmed = window.confirm('Yakin ingin menghapus paket ini secara permanen?');
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, 'prices', priceId));
      if (editingId === priceId) resetForm();
      setMessage('Paket berhasil dihapus.');
    } catch (err) {
      console.error('[DashboardAdmin] delete price failed', err);
      setError('Gagal menghapus paket. Coba lagi.');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setSavingStatusId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setMessage('Status order berhasil diperbarui.');
    } catch (err) {
      console.error('[DashboardAdmin] update order status failed', err);
      setError('Gagal memperbarui status order.');
    } finally {
      setSavingStatusId(null);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.cartTotal) || 0), 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="da-page">
        <div className="da-orb" />
        <div className="da-wrap">
          <div className="da-header">
            <h1 className="da-title">Admin <em>Dashboard</em> 👑</h1>
            <button className="da-btn-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
          </div>

          <div className="da-grid">
            <section className="da-panel">
              <h2>Price List Management</h2>
              <p>Tambahkan, edit, dan hapus paket. Perubahan akan langsung terlihat di halaman Price List.</p>

              <form className="da-form" onSubmit={handleSavePrice}>
                <div className="da-field">
                  <label>Nama Paket</label>
                  <input
                    className="da-input"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Contoh: Paket Video Tugas Sekolah"
                  />
                </div>
                <div className="da-field">
                  <label>Harga (Rp)</label>
                  <input
                    className="da-input"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="Contoh: 150000"
                  />
                </div>
                <div className="da-field">
                  <label>Unit</label>
                  <input
                    className="da-input"
                    value={form.unit}
                    onChange={(e) => handleFormChange('unit', e.target.value)}
                    placeholder="Contoh: / paket"
                  />
                </div>
                <div className="da-field">
                  <label>Kategori</label>
                  <select
                    className="da-input da-select"
                    value={form.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="da-field">
                  <label>Deskripsi / Fitur Utama</label>
                  <textarea
                    className="da-textarea"
                    value={form.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Detail singkat tentang paket, fitur, syarat, dan benefit"
                  />
                </div>
                <div className="da-field">
                  <label>Icon Font Awesome</label>
                  <input
                    className="da-input"
                    value={form.icon}
                    onChange={(e) => handleFormChange('icon', e.target.value)}
                    placeholder="Contoh: fa-clapperboard"
                  />
                </div>
                <div className="da-field">
                  <label>Badge (optional)</label>
                  <input
                    className="da-input"
                    value={form.badge}
                    onChange={(e) => handleFormChange('badge', e.target.value)}
                    placeholder="Contoh: Best Seller"
                  />
                </div>
                <div className="da-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.comingSoon}
                      onChange={(e) => handleFormChange('comingSoon', e.target.checked)}
                    />{' '}
                    Coming Soon
                  </label>
                </div>
                <div className="da-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.custom}
                      onChange={(e) => handleFormChange('custom', e.target.checked)}
                    />{' '}
                    Harga Custom
                  </label>
                </div>
                <div className="da-form-actions">
                  <button type="submit" className="da-btn da-btn-primary">
                    {editingId ? 'Perbarui Paket' : 'Tambah Paket Baru'}
                  </button>
                  <button type="button" className="da-btn da-btn-secondary" onClick={resetForm}>
                    Reset Form
                  </button>
                </div>
                {message && <div className="da-msg">{message}</div>}
                {error && <div className="da-msg da-error">{error}</div>}
              </form>

              <div style={{ marginTop: '28px' }}>
                <h3 style={{ marginBottom: '12px', color: '#e5e7eb' }}>Paket Saat Ini</h3>
                {loadingPrices ? (
                  <p style={{ color: 'var(--text-dim)' }}>Memuat daftar paket...</p>
                ) : prices.length === 0 ? (
                  <p style={{ color: 'var(--text-dim)' }}>Belum ada paket di Firestore.</p>
                ) : (
                  <table className="da-table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((price) => (
                        <tr key={price.id}>
                          <td>{price.name}</td>
                          <td>{price.price ? `Rp ${Number(price.price).toLocaleString('id-ID')}` : 'Custom'}</td>
                          <td>{price.comingSoon ? 'Coming Soon' : price.custom ? 'Custom' : 'Aktif'}</td>
                          <td>
                            <button className="da-btn da-btn-secondary" style={{ marginRight: 8 }} onClick={() => handleEditPrice(price)}>
                              Edit
                            </button>
                            <button className="da-btn da-btn-secondary" onClick={() => handleDeletePrice(price.id)}>
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className="da-panel">
              <h2>Order Klien</h2>
              <p>Semua order tersimpan di collection orders. Ubah status dan progres proyek klien secara real-time.</p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="da-pill da-pill-pending">Total order: {orders.length}</span>
                <span className="da-pill da-pill-done">Pendapatan: Rp {Number(totalRevenue).toLocaleString('id-ID')}</span>
              </div>

              {loadingOrders ? (
                <p style={{ color: 'var(--text-dim)' }}>Memuat order...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: 'var(--text-dim)' }}>Belum ada order yang masuk.</p>
              ) : (
                <div className="da-order-list">
                  {orders.map((order) => (
                    <div key={order.id} className="da-order-card">
                      <div className="da-order-head">
                        <div>
                          <h3 className="da-order-title">{order.projectName || 'Order baru'}</h3>
                          <div className="da-order-meta">
                            <span>ID Order: {order.id}</span>
                            <span>Klien: {order.userId}</span>
                            <span>Total: Rp {Number(order.cartTotal || 0).toLocaleString('id-ID')}</span>
                            <span>{order.selectedItems?.length || 0} item</span>
                          </div>
                        </div>
                        <span className={`da-pill ${order.status === 'Pending' ? 'da-pill-pending' : order.status === 'Selesai' ? 'da-pill-done' : 'da-pill-progress'}`}>
                          {order.status}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <select
                            className="da-input da-select-sm"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            disabled={savingStatusId === order.id}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="da-btn da-btn-primary"
                            onClick={() => handleStatusUpdate(order.id, order.status)}
                            disabled={savingStatusId === order.id}
                          >
                            {savingStatusId === order.id ? 'Menyimpan...' : 'Simpan Status'}
                          </button>
                        </div>
                        <div>
                          <strong>Ringkasan Brief:</strong>
                          <p style={{ margin: '8px 0 0', color: 'var(--text-dim)' }}>{order.projectDesc || 'Tidak ada deskripsi tambahan.'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
