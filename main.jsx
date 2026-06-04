// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SmoothScroll from './components/SmoothScroll';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </React.StrictMode>
);
