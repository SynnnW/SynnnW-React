// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SmoothScroll from './components/SmoothScroll';
import { ToastProvider } from './hooks/useToast';
import './styles/globals.css'; // ✅ FIXED PATH (was './globals.css')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SmoothScroll>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SmoothScroll>
  </React.StrictMode>
);
