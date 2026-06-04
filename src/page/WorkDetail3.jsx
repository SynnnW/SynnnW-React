// src/pages/WorkDetail3.jsx
// PATCH 11-A: Video Collection page dihapus.
// Setiap film Sinematura sekarang punya halaman sendiri (WorkDetail5–WorkDetail14).
// Route /works/video-collection otomatis redirect ke /works.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkDetail3() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/works', { replace: true });
  }, []);

  return null;
}
