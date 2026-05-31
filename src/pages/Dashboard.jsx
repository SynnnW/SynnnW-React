import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, where, deleteDoc, updateDoc } from 'firebase/firestore';

const CSS = `
  .client-db-page {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #070709 0%, #1a1a2e 100%);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
    padding-top: 64px;
  }

  .client-db-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.1;
  }

  .client-db-orb1 {
    width: 400px;
    height: 400px;
    background: rgba(167, 139, 250, 0.4);
    top: -100px;
    left: -100px;
  }

  .client-db-orb2 {
    width: 300px;
    height: 300px;
    background: rgba(59, 130, 246, 0.3);
    bottom: 100px;
    right: -50px;
  }

  .client-db-wrap {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
  }

  .client-db-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
    gap: 16px;
  }

  .client-db-header-content h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    font-weight: 300;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }

  .client-db-header-content em {
    color: #a78bfa;
    font-style: italic;
  }

  .client-db-header-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    margin: 0;
  }

  .client-db-header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .client-db-btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    background: rgba(139, 92, 246, 0.1);
    color: #a78bfa;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .client-db-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
  }

  .client-db-btn.primary {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
  }

  .client-db-btn.danger {
    border-color: rgba(220, 38, 38, 0.3);
    background: rgba(220, 38, 38, 0.1);
    color: #fca5a5;
  }

  .client-db-btn.danger:hover {
    background: rgba(220, 38, 38, 0.2);
    border-color: rgba(220, 38, 38, 0.5);
  }

  /* ── Tabs ── */
  .client-db-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    overflow-x: auto;
    padding-bottom: 12px;
  }

  .client-db-tab {
    padding: 10px 20px;
    border: none;
    background: none;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .client-db-tab.active {
    color: #a78bfa;
    border-bottom-color: #a78bfa;
  }

  .client-db-tab i {
    font-size: 0.95rem;
  }

  /* ── Content Sections ── */
  .client-db-section {
    display: none;
  }

  .client-db-section.active {
    display: block;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Reviews Section ── */
  .client-db-reviews {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .client-db-review-card {
    background: rgba(30, 30, 50, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 14px;
    padding: 20px;
    transition: all 0.25s;
  }

  .client-db-review-card:hover {
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.1);
  }

  .client-db-review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .client-db-review-title {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .client-db-review-date {
    font-size: 0.75rem;
    color: #64748b;
  }

  .client-db-review-content {
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .client-db-review-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .client-db-review-rating i {
    color: #fbbf24;
    font-size: 0.85rem;
  }

  .client-db-review-actions {
    display: flex;
    gap: 8px;
  }

  .client-db-review-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(139, 92, 246, 0.2);
    background: rgba(139, 92, 246, 0.05);
    color: #a78bfa;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .client-db-review-btn:hover {
    background: rgba(139, 92, 246, 0.15);
  }

  .client-db-empty {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
  }

  .client-db-empty i {
    font-size: 3rem;
    color: #a78bfa;
    opacity: 0.5;
    margin-bottom: 16px;
    display: block;
  }

  .client-db-empty p {
    margin: 0;
    font-size: 0.95rem;
  }

  /* ── Profile Section ── */
  .client-db-profile {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 600px;
  }

  .client-db-profile-card {
    background: rgba(30, 30, 50, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 14px;
    padding: 24px;
  }

  .client-db-profile-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }

  .client-db-profile-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(139, 92, 246, 0.05);
  }

  .client-db-profile-row:last-child {
    border-bottom: none;
  }

  .client-db-profile-label {
    font-size: 0.85rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .client-db-profile-value {
    font-size: 0.9rem;
    color: #ffffff;
    font-weight: 600;
  }

  .client-db-profile-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .client-db-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .client-db-form-label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .client-db-form-input {
    background: rgba(51, 51, 80, 0.4);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 10px;
    padding: 10px 12px;
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.25s;
  }

  .client-db-form-input:focus {
    border-color: #a78bfa;
    background: rgba(51, 51, 80, 0.6);
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
  }

  .client-db-form-input::placeholder {
    color: #64748b;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .client-db-wrap {
      padding: 24px 16px;
    }

    .client-db-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .client-db-header-content h2 {
      font-size: 1.8rem;
    }

    .client-db-tabs {
      flex-wrap: wrap;
    }

    .client-db-profile {
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    .client-db-wrap {
      padding: 16px 12px;
    }

    .client-db-tab {
      padding: 8px 12px;
      font-size: 0.8rem;
    }

    .client-db-review-card,
    .client-db-profile-card {
      padding: 16px;
    }

    .client-db-review-header {
      flex-direction: column;
      gap: 8px;
    }
  }
`;

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const styleRef = null;

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Check auth & load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/auth-login');
        return;
      }

      setUser(currentUser);
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
      });
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load reviews
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (user) {
        // Update auth profile
        if (formData.name) {
          await user.updateProfile({ displayName: formData.name });
        }
        // You can also update additional user data in Firestore here
      }
      setIsEditing(false);
      // Re-fetch user data
      setUser(prev => ({ ...prev, displayName: formData.name }));
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="client-db-page">
        <div className="client-db-orb client-db-orb1" />
        <div className="client-db-orb client-db-orb2" />

        <div className="client-db-wrap">
          {/* Header */}
          <div className="client-db-header">
            <div className="client-db-header-content">
              <h2>Dashboard <em>Anda</em></h2>
              <p className="client-db-header-sub">Kelola profil dan lihat review</p>
            </div>
            <div className="client-db-header-actions">
              <button className="client-db-btn" onClick={() => navigate('/contact')}>
                <i className="fa-solid fa-arrow-left" /> Kembali
              </button>
              <button className="client-db-btn danger" onClick={handleLogout}>
                <i className="fa-solid fa-sign-out-alt" /> Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="client-db-tabs">
            <button
              className={`client-db-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="fa-solid fa-star" />
              Reviews ({reviews.length})
            </button>
            <button
              className={`client-db-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fa-solid fa-user" />
              Akun Profile
            </button>
          </div>

          {/* Reviews Section */}
          <div className={`client-db-section ${activeTab === 'reviews' ? 'active' : ''}`}>
            {reviews.length > 0 ? (
              <div className="client-db-reviews">
                {reviews.map(review => (
                  <div key={review.id} className="client-db-review-card">
                    <div className="client-db-review-header">
                      <h3 className="client-db-review-title">{review.projectName || 'Project'}</h3>
                      <span className="client-db-review-date">
                        {review.createdAt?.toDate().toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    {review.rating && (
                      <div className="client-db-review-rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <i key={i} className="fa-solid fa-star" />
                        ))}
                      </div>
                    )}

                    <p className="client-db-review-content">{review.content}</p>

                    <div className="client-db-review-actions">
                      <button className="client-db-review-btn">Lihat Detail</button>
                      <button className="client-db-review-btn" style={{color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)'}}>
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="client-db-empty">
                <i className="fa-solid fa-star" />
                <p>Belum ada review dari proyek Anda</p>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className={`client-db-section ${activeTab === 'profile' ? 'active' : ''}`}>
            <div className="client-db-profile">
              {/* Account Info */}
              <div className="client-db-profile-card">
                <h3 className="client-db-profile-section-title">Informasi Akun</h3>
                {!isEditing ? (
                  <>
                    <div className="client-db-profile-row">
                      <span className="client-db-profile-label">Nama</span>
                      <span className="client-db-profile-value">{formData.name || '-'}</span>
                    </div>
                    <div className="client-db-profile-row">
                      <span className="client-db-profile-label">Email</span>
                      <span className="client-db-profile-value">{user?.email}</span>
                    </div>
                    <div className="client-db-profile-row">
                      <span className="client-db-profile-label">Telepon</span>
                      <span className="client-db-profile-value">{formData.phone || '-'}</span>
                    </div>
                    <div className="client-db-profile-row" style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(139, 92, 246, 0.1)'}}>
                      <button className="client-db-btn primary" onClick={() => setIsEditing(true)}>
                        <i className="fa-solid fa-edit" /> Edit Profil
                      </button>
                    </div>
                  </>
                ) : (
                  <form className="client-db-profile-form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                  }}>
                    <div className="client-db-form-group">
                      <label className="client-db-form-label">Nama</label>
                      <input
                        type="text"
                        name="name"
                        className="client-db-form-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nama lengkap"
                      />
                    </div>

                    <div className="client-db-form-group">
                      <label className="client-db-form-label">Email</label>
                      <input
                        type="email"
                        className="client-db-form-input"
                        value={formData.email}
                        disabled
                      />
                      <small style={{color: '#64748b', fontSize: '0.7rem'}}>Email tidak bisa diubah</small>
                    </div>

                    <div className="client-db-form-group">
                      <label className="client-db-form-label">Telepon</label>
                      <input
                        type="tel"
                        name="phone"
                        className="client-db-form-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+62 821 2345 6789"
                      />
                    </div>

                    <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                      <button type="submit" className="client-db-btn primary" disabled={loading}>
                        {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-save" />}
                        {loading ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button type="button" className="client-db-btn" onClick={() => setIsEditing(false)}>
                        <i className="fa-solid fa-times" /> Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Account Security */}
              <div className="client-db-profile-card">
                <h3 className="client-db-profile-section-title">Keamanan Akun</h3>
                <div className="client-db-profile-row">
                  <span className="client-db-profile-label">Password</span>
                  <button className="client-db-btn">
                    <i className="fa-solid fa-key" /> Ubah Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
