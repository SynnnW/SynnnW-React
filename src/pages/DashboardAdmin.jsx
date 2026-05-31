import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc,
  onSnapshot, orderBy, query,
  serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';

const CSS = `
  .da-app {
    display: flex;
    min-height: 100vh;
    background: var(--bg, #070709);
    color: var(--text, #fff);
    font-family: 'Outfit', sans-serif;
  }
  .da-sidebar {
    width: 260px;
    min-height: 100vh;
    background: rgba(255,255,255,0.02);
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
  }
  .da-brand {
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 20px;
  }
  .da-brand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
    display: flex; align-items: center; gap: 10px;
  }
  .da-brand-title em { color: #a78bfa; font-style: italic; }
  .da-brand-sub {
    font-size: 0.62rem; color: var(--text-dim, #94a3b8);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-top: 4px; display: block;
  }
  .da-nav-section-label {
    padding: 4px 24px;
    font-size: 0.6rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-bottom: 4px; margin-top: 12px;
  }
  .da-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px;
    cursor: pointer;
    font-size: 0.88rem; font-weight: 500;
    color: var(--text-dim, #94a3b8);
    border-left: 3px solid transparent;
    transition: all 0.18s;
  }
  .da-nav-item:hover {
    background: rgba(255,255,255,0.03);
    color: #fff;
  }
  .da-nav-item.active {
    background: rgba(139,92,246,0.08);
    color: #a78bfa;
    border-left-color: #a78bfa;
  }
  .da-nav-item i { width: 18px; text-align: center; font-size: 0.9rem; }
  .da-nav-badge {
    margin-left: auto;
    background: rgba(139,92,246,0.15);
    color: #a78bfa;
    font-size: 0.65rem; font-weight: 700;
    padding: 2px 8px; border-radius: 99px;
  }
  .da-sidebar-footer {
    margin-top: auto;
    padding: 20px 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .da-btn-logout {
    width: 100%;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer; font-weight: 600;
    font-size: 0.82rem;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .da-btn-logout:hover { background: rgba(239,68,68,0.15); }
  .da-main {
    flex: 1;
    min-height: 100vh;
    overflow-y: auto;
    padding: 40px 48px 80px;
  }
  .da-page-header {
    margin-bottom: 36px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .da-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 300; color: #fff; margin: 0 0 6px;
  }
  .da-page-title em { color: #a78bfa; font-style: italic; }
  .da-page-sub { font-size: 0.82rem; color: var(--text-dim); margin: 0; }
  .da-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(18px);
    margin-bottom: 24px;
  }
  .da-panel-title {
    font-size: 1rem; font-weight: 700;
    color: #fff; margin: 0 0 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .da-panel-title i { color: #a78bfa; }
  .da-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }
  .da-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 20px 22px;
  }
  .da-stat-label {
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-dim); display: block; margin-bottom: 8px;
  }
  .da-stat-val {
    font-size: 1.8rem; font-weight: 700; color: #fff;
    line-height: 1;
  }
  .da-stat-accent { color: #a78bfa; }
  .da-table { width: 100%; border-collapse: collapse; }
  .da-table th {
    text-align: left; padding: 12px 16px;
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-dim);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .da-table td {
    padding: 14px 16px;
    font-size: 0.85rem; color: var(--text);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .da-table tbody tr:hover { background: rgba(255,255,255,0.02); }
  .da-field { display: grid; gap: 7px; margin-bottom: 16px; }
  .da-field label {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-dim);
  }
  .da-input, .da-textarea, .da-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif; font-size: 0.92rem;
    outline: none; box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .da-input:focus, .da-textarea:focus, .da-select:focus {
    border-color: rgba(139,92,246,0.5);
  }
  .da-textarea { min-height: 100px; resize: vertical; }
  .da-select { appearance: none; cursor: pointer; }
  .da-form-grid { display: grid; gap: 16px; }
  .da-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .da-tl-row {
    display: grid;
    grid-template-columns: 1fr 120px 1fr 40px;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }
  .da-issue-row {
    display: grid;
    grid-template-columns: 80px 1fr 40px;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .da-remove-btn {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
    width: 40px; height: 40px;
    border-radius: 10px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .da-remove-btn:hover { background: rgba(239,68,68,0.15); }
  .da-add-row-btn {
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.3);
    color: #a78bfa;
    padding: 10px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .da-add-row-btn:hover { background: rgba(139,92,246,0.15); }
  .da-btn {
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.3);
    color: #a78bfa;
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .da-btn:hover { background: rgba(139,92,246,0.15); }
  .da-btn-primary {
    background: rgba(34,197,94,0.12);
    border-color: rgba(34,197,94,0.3);
    color: #86efac;
  }
  .da-btn-primary:hover { background: rgba(34,197,94,0.2); }
  .da-btn-actions {
    display: flex; gap: 12px; align-items: center;
  }
  .da-msg-success { font-size: 0.85rem; color: #86efac; }
  .da-msg-error { font-size: 0.85rem; color: #f87171; }
  .da-editor-order-select {
    display: grid; gap: 8px; margin-bottom: 24px;
  }
`;

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== 'aldokraksaan@gmail.com') {
        navigate('/');
        return;
      }

      const unsubOrders = onSnapshot(
        query(collection(db, 'orders'), orderBy('timestamp', 'desc')),
        (snap) => {
          setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      );

      const unsubPrices = onSnapshot(
        collection(db, 'prices'),
        (snap) => {
          setPrices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      );

      setLoading(false);

      return () => {
        unsubOrders();
        unsubPrices();
      };
    });

    return () => unsubAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.9rem' }}>
        LOADING...
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="da-app">
        {/* Sidebar */}
        <div className="da-sidebar">
          <div className="da-brand">
            <h2 className="da-brand-title">
              <i className="fa-solid fa-chart-line" /> Syn<em>nw</em>
            </h2>
            <span className="da-brand-sub">Admin Dashboard</span>
          </div>

          <div className="da-nav-section-label">MAIN</div>
          <div
            className={`da-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fa-solid fa-chart-pie" />
            Overview
          </div>
          <div
            className={`da-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-clipboard-list" />
            Orders
            <span className="da-nav-badge">{orders.length}</span>
          </div>
          <div
            className={`da-nav-item ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => setActiveTab('prices')}
          >
            <i className="fa-solid fa-tag" />
            Prices
            <span className="da-nav-badge">{prices.length}</span>
          </div>
          <div
            className={`da-nav-item ${activeTab === 'dashboardEditor' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboardEditor')}
          >
            <i className="fa-solid fa-sliders" />
            Dashboard Editor
          </div>

          <div className="da-sidebar-footer">
            <button className="da-btn-logout" onClick={handleLogout}>
              <i className="fa-solid fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="da-main">
          {activeTab === 'overview' && <OverviewTab orders={orders} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} />}
          {activeTab === 'prices' && <PricesTab prices={prices} />}
          {activeTab === 'dashboardEditor' && <DashboardEditorTab orders={orders} />}
        </div>
      </div>
    </>
  );
}

function OverviewTab({ orders }) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.cartTotal || 0), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <>
      <div className="da-page-header">
        <h1 className="da-page-title">Overview</h1>
        <p className="da-page-sub">Ringkasan dashboard admin SynnnW</p>
      </div>

      <div className="da-stats-grid">
        <div className="da-stat-card">
          <span className="da-stat-label">Total Orders</span>
          <div className="da-stat-val"><span className="da-stat-accent">{totalOrders}</span></div>
        </div>
        <div className="da-stat-card">
          <span className="da-stat-label">Total Revenue</span>
          <div className="da-stat-val" style={{ fontSize: '1.3rem' }}>Rp {totalRevenue.toLocaleString('id-ID')}</div>
        </div>
      </div>

      <div className="da-panel">
        <h3 className="da-panel-title"><i className="fa-solid fa-list" /> Recent Orders (5 Terbaru)</h3>
        <table className="da-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>User</th>
              <th>Category</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>{order.projectName || 'N/A'}</td>
                <td style={{ fontSize: '0.75rem' }}>{order.userId?.slice(0, 10)}...</td>
                <td>{order.serviceCategory || 'general'}</td>
                <td>Rp {(order.cartTotal || 0).toLocaleString('id-ID')}</td>
                <td style={{ color: '#a78bfa', fontSize: '0.8rem' }}>{order.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrdersTab({ orders }) {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setEditingId(null);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <>
      <div className="da-page-header">
        <h1 className="da-page-title">All <em>Orders</em></h1>
        <p className="da-page-sub">Kelola semua order yang masuk</p>
      </div>

      <div className="da-panel">
        <table className="da-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>User UID</th>
              <th>Category</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontSize: '0.7rem', color: '#666' }}>{order.id.slice(0, 8)}...</td>
                <td>{order.projectName || 'N/A'}</td>
                <td style={{ fontSize: '0.75rem', color: '#666' }}>{order.userId?.slice(0, 12)}...</td>
                <td>{order.serviceCategory || 'general'}</td>
                <td>Rp {(order.cartTotal || 0).toLocaleString('id-ID')}</td>
                <td>
                  {editingId === order.id ? (
                    <select
                      className="da-select"
                      style={{ maxWidth: 140 }}
                      value={editStatus}
                      onChange={(e) => {
                        setEditStatus(e.target.value);
                        handleUpdateStatus(order.id, e.target.value);
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  ) : (
                    <span style={{ cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => { setEditingId(order.id); setEditStatus(order.status || 'Pending'); }}>
                      {order.status || 'Pending'}
                    </span>
                  )}
                </td>
                <td style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PricesTab({ prices }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'prices', editingId), {
          ...formData,
          price: parseInt(formData.price) || 0,
          updatedAt: serverTimestamp(),
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'prices'), {
          ...formData,
          price: parseInt(formData.price) || 0,
          createdAt: serverTimestamp(),
        });
      }
      setFormData({ name: '', category: '', price: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving price:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin hapus?')) {
      try {
        await deleteDoc(doc(db, 'prices', id));
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  return (
    <>
      <div className="da-page-header">
        <h1 className="da-page-title">Price <em>List</em></h1>
        <p className="da-page-sub">Kelola paket harga layanan</p>
      </div>

      {showForm && (
        <div className="da-panel">
          <h3 className="da-panel-title"><i className="fa-solid fa-plus" /> {editingId ? 'Edit' : 'Tambah'} Paket</h3>
          <form onSubmit={handleSubmit} className="da-form-grid">
            <div className="da-field">
              <label>Nama Paket</label>
              <input className="da-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Premium Video Editing" required />
            </div>
            <div className="da-field">
              <label>Kategori</label>
              <select className="da-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                <option value="">Pilih kategori</option>
                <option value="video">Video</option>
                <option value="design">Design</option>
                <option value="livestream">Livestream</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div className="da-field">
              <label>Harga (Rp)</label>
              <input className="da-input" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="500000" required />
            </div>
            <div className="da-field">
              <label>Deskripsi</label>
              <textarea className="da-textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi paket..." />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="da-btn da-btn-primary"><i className="fa-solid fa-save" /> {editingId ? 'Update' : 'Simpan'}</button>
              <button type="button" className="da-btn" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', category: '', price: '', description: '' }); }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="da-panel">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="da-panel-title"><i className="fa-solid fa-list" /> Daftar Paket</h3>
          {!showForm && <button className="da-btn da-btn-primary" onClick={() => setShowForm(true)}><i className="fa-solid fa-plus" /> Tambah Paket Baru</button>}
        </div>
        <table className="da-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(price => (
              <tr key={price.id}>
                <td><strong>{price.name}</strong></td>
                <td style={{ fontSize: '0.8rem' }}>{price.category}</td>
                <td>Rp {(price.price || 0).toLocaleString('id-ID')}</td>
                <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{price.description?.slice(0, 40)}...</td>
                <td>
                  <button className="da-btn" style={{ marginRight: 8, fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => { setFormData(price); setEditingId(price.id); setShowForm(true); }}>Edit</button>
                  <button className="da-btn" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => handleDelete(price.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DashboardEditorTab({ orders }) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [editorForm, setEditorForm] = useState({
    driveUrl: '',
    adminNotes: '',
    timeline: [],
    issues: [],
    questions: [],
  });
  const [savingDashboard, setSavingDashboard] = useState(false);
  const [dashMsg, setDashMsg] = useState('');
  const [dashError, setDashError] = useState('');

  useEffect(() => {
    if (!selectedOrderId) {
      setEditorForm({ driveUrl: '', adminNotes: '', timeline: [], issues: [], questions: [] });
      return;
    }

    const unsubContent = onSnapshot(doc(db, 'dashboardContent', selectedOrderId), (docSnap) => {
      if (docSnap.exists()) {
        setEditorForm(docSnap.data());
      } else {
        setEditorForm({ driveUrl: '', adminNotes: '', timeline: [], issues: [], questions: [] });
      }
    });

    return () => unsubContent();
  }, [selectedOrderId]);

  const handleSaveDashboardContent = async () => {
    if (!selectedOrderId) return;
    setSavingDashboard(true);
    setDashMsg('');
    setDashError('');
    try {
      const selectedOrder = orders.find(o => o.id === selectedOrderId);
      await setDoc(doc(db, 'dashboardContent', selectedOrderId), {
        orderId: selectedOrderId,
        userId: selectedOrder?.userId ?? '',
        driveUrl: editorForm.driveUrl.trim(),
        adminNotes: editorForm.adminNotes.trim(),
        timeline: editorForm.timeline.filter(t => t.label.trim()),
        issues: editorForm.issues.filter(i => i.title.trim()),
        questions: editorForm.questions.filter(q => q.q.trim()),
        updatedAt: serverTimestamp(),
      });
      setDashMsg('✓ Dashboard berhasil diperbarui! User akan langsung melihat perubahan.');
    } catch (err) {
      console.error(err);
      setDashError('Gagal menyimpan. Coba lagi.');
    } finally {
      setSavingDashboard(false);
    }
  };

  const addTimelineItem = () => setEditorForm(prev => ({
    ...prev,
    timeline: [...prev.timeline, { label: '', status: 'pending', note: '' }]
  }));
  const removeTimelineItem = (idx) => setEditorForm(prev => ({
    ...prev,
    timeline: prev.timeline.filter((_, i) => i !== idx)
  }));
  const updateTimelineItem = (idx, field, value) => setEditorForm(prev => ({
    ...prev,
    timeline: prev.timeline.map((item, i) => i === idx ? {...item, [field]: value} : item)
  }));

  const addIssueItem = () => setEditorForm(prev => ({
    ...prev,
    issues: [...prev.issues, { time: '', title: '', desc: '' }]
  }));
  const removeIssueItem = (idx) => setEditorForm(prev => ({
    ...prev,
    issues: prev.issues.filter((_, i) => i !== idx)
  }));
  const updateIssueItem = (idx, field, value) => setEditorForm(prev => ({
    ...prev,
    issues: prev.issues.map((item, i) => i === idx ? {...item, [field]: value} : item)
  }));

  const addQuestionItem = () => setEditorForm(prev => ({
    ...prev,
    questions: [...prev.questions, { emoji: '❓', tag: '', q: '' }]
  }));
  const removeQuestionItem = (idx) => setEditorForm(prev => ({
    ...prev,
    questions: prev.questions.filter((_, i) => i !== idx)
  }));
  const updateQuestionItem = (idx, field, value) => setEditorForm(prev => ({
    ...prev,
    questions: prev.questions.map((item, i) => i === idx ? {...item, [field]: value} : item)
  }));

  return (
    <>
      <div className="da-page-header">
        <h1 className="da-page-title">Dashboard <em>Editor</em></h1>
        <p className="da-page-sub">Edit konten dashboard untuk setiap user/order</p>
      </div>

      {/* Order Select */}
      <div className="da-panel">
        <div className="da-editor-order-select">
          <label style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>Pilih Order / User:</label>
          <select
            className="da-select"
            style={{ maxWidth: 320 }}
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            <option value="">-- Pilih order untuk diedit --</option>
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                {order.projectName || 'Order baru'} — {order.userId?.slice(0, 12)}...
              </option>
            ))}
          </select>
          {selectedOrderId && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Service: {orders.find(o => o.id === selectedOrderId)?.serviceCategory ?? '—'}
            </span>
          )}
        </div>
      </div>

      {selectedOrderId && (
        <>
          {/* Drive URL */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-brands fa-google-drive" /> Preview Video / File</h3>
            <div className="da-field">
              <label>URL Google Drive Embed</label>
              <input
                className="da-input"
                value={editorForm.driveUrl}
                onChange={e => setEditorForm(prev => ({...prev, driveUrl: e.target.value}))}
                placeholder="https://drive.google.com/file/d/XXXXX/preview"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Format: buka Google Drive → Share → Copy link, lalu ganti /view dengan /preview
              </span>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-note-sticky" /> Catatan untuk Klien</h3>
            <div className="da-field">
              <label>Pesan / Update</label>
              <textarea
                className="da-textarea"
                value={editorForm.adminNotes}
                onChange={e => setEditorForm(prev => ({...prev, adminNotes: e.target.value}))}
                placeholder="Contoh: Hei, proses sudah sampai tahap cutting. Silakan cek preview di atas..."
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-list-check" /> Timeline Progress</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 16 }}>
              Jika dikosongkan, dashboard akan otomatis pakai timeline default berdasarkan status order.
            </p>
            <div className="da-tl-row" style={{ fontWeight: 700, fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: 4 }}>
              <span>Label</span><span>Status</span><span>Catatan</span><span></span>
            </div>
            {editorForm.timeline.map((item, idx) => (
              <div key={idx} className="da-tl-row">
                <input
                  className="da-input"
                  value={item.label}
                  onChange={e => updateTimelineItem(idx, 'label', e.target.value)}
                  placeholder="Nama tahap..."
                />
                <select
                  className="da-select"
                  value={item.status}
                  onChange={e => updateTimelineItem(idx, 'status', e.target.value)}
                >
                  <option value="done">Done</option>
                  <option value="progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
                <input
                  className="da-input"
                  value={item.note}
                  onChange={e => updateTimelineItem(idx, 'note', e.target.value)}
                  placeholder="Catatan..."
                />
                <button className="da-remove-btn" onClick={() => removeTimelineItem(idx)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
            <button className="da-add-row-btn" style={{ marginTop: 12 }} onClick={addTimelineItem}>
              <i className="fa-solid fa-plus" /> Tambah Baris Timeline
            </button>
          </div>

          {/* Issues */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-triangle-exclamation" /> Catatan Masalah</h3>
            {editorForm.issues.map((issue, idx) => (
              <div key={idx} className="da-issue-row">
                <input className="da-input" value={issue.time} onChange={e => updateIssueItem(idx, 'time', e.target.value)} placeholder="3:28" />
                <div style={{ display: 'grid', gap: 8 }}>
                  <input className="da-input" value={issue.title} onChange={e => updateIssueItem(idx, 'title', e.target.value)} placeholder="Judul masalah" />
                  <input className="da-input" value={issue.desc} onChange={e => updateIssueItem(idx, 'desc', e.target.value)} placeholder="Deskripsi..." />
                </div>
                <button className="da-remove-btn" onClick={() => removeIssueItem(idx)}><i className="fa-solid fa-xmark" /></button>
              </div>
            ))}
            <button className="da-add-row-btn" style={{ marginTop: 12 }} onClick={addIssueItem}>
              <i className="fa-solid fa-plus" /> Tambah Catatan Masalah
            </button>
          </div>

          {/* Questions */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-comments" /> Pertanyaan untuk Klien</h3>
            {editorForm.questions.map((q, idx) => (
              <div key={idx} className="da-issue-row">
                <input className="da-input" value={q.emoji} onChange={e => updateQuestionItem(idx, 'emoji', e.target.value)} placeholder="❓" maxLength="2" />
                <div style={{ display: 'grid', gap: 8 }}>
                  <input className="da-input" value={q.tag} onChange={e => updateQuestionItem(idx, 'tag', e.target.value)} placeholder="Tag (Cutting, Audio, dll)" />
                  <input className="da-input" value={q.q} onChange={e => updateQuestionItem(idx, 'q', e.target.value)} placeholder="Pertanyaan..." />
                </div>
                <button className="da-remove-btn" onClick={() => removeQuestionItem(idx)}><i className="fa-solid fa-xmark" /></button>
              </div>
            ))}
            <button className="da-add-row-btn" style={{ marginTop: 12 }} onClick={addQuestionItem}>
              <i className="fa-solid fa-plus" /> Tambah Pertanyaan
            </button>
          </div>

          {/* Save Button */}
          <div className="da-btn-actions" style={{ marginTop: 24 }}>
            <button className="da-btn da-btn-primary" onClick={handleSaveDashboardContent} disabled={savingDashboard}>
              <i className="fa-solid fa-floppy-disk" />
              {savingDashboard ? 'Menyimpan...' : 'Simpan ke Firestore'}
            </button>
            {dashMsg && <span className="da-msg-success">{dashMsg}</span>}
            {dashError && <span className="da-msg-error">{dashError}</span>}
          </div>
        </>
      )}
    </>
  );
}
