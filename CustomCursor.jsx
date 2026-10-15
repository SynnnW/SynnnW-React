// src/components/CustomCursor.jsx
// Premium custom cursor — dot + ring dengan lag effect
// Desktop only, pointer device

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  useEffect(() => {
    // Skip cursor on touch devices or small screens
    const isTouchDevice = () => {
      return (
        (typeof window !== 'undefined' && 'ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
        (typeof navigator !== 'undefined' && navigator.msMaxTouchPoints > 0)
      );
    };

    const isSmallScreen = window.innerWidth < 768;

    if (isTouchDevice() || isSmallScreen) {
      // Don't initialize custom cursor on mobile/touch devices
      return;
    }

    // Inject CSS
    const style = document.createElement('style');
    style.id = 'custom-cursor-styles';
    style.textContent = `
      .cur-dot {
        width: 8px;
        height: 8px;
        background: #8b5cf6;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: width 0.15s, height 0.15s, background 0.2s, opacity 0.2s;
        left: 0;
        top: 0;
      }
      .cur-ring {
        width: 36px;
        height: 36px;
        border: 1.5px solid rgba(139, 92, 246, 0.6);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s;
        left: 0;
        top: 0;
      }
      /* Hide default cursor */
      html { cursor: none; }
      /* State: hover interactive */
      .cur-dot.hovering {
        width: 12px;
        height: 12px;
        background: #a78bfa;
      }
      .cur-ring.hovering {
        width: 52px;
        height: 52px;
        border-color: rgba(167, 139, 250, 0.5);
      }
      /* State: text mode */
      .cur-dot.text-mode {
        width: 6px;
        height: 20px;
        border-radius: 3px;
        background: #a78bfa;
      }
      .cur-ring.text-mode {
        width: 0;
        height: 0;
        border: none;
        opacity: 0;
      }
      /* State: drag */
      .cur-dot.dragging {
        width: 14px;
        height: 14px;
        background: #a78bfa;
      }
      .cur-ring.dragging {
        width: 44px;
        height: 44px;
        border-color: rgba(167, 139, 250, 0.6);
      }
    `;
    document.head.appendChild(style);

    // Create elements
    const dot = document.createElement('div');
    dot.className = 'cur-dot';
    document.body.appendChild(dot);
    dotRef.current = dot;

    const ring = document.createElement('div');
    ring.className = 'cur-ring';
    document.body.appendChild(ring);
    ringRef.current = ring;

    // Mouse move — dot immediate, ring with lag
    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      }
    };

    // Smooth ring animation (lag effect)
    let animationId;
    const animate = () => {
      if (ring) {
        const dx = posRef.current.x - ringPosRef.current.x;
        const dy = posRef.current.y - ringPosRef.current.y;
        ringPosRef.current.x += dx * 0.2; // 20% step = lag effect
        ringPosRef.current.y += dy * 0.2;
        ring.style.left = ringPosRef.current.x + 'px';
        ring.style.top = ringPosRef.current.y + 'px';
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Detect hover on interactive elements
    const updateCursorState = (e) => {
      const target = e.target;
      const isInteractive = target.matches('a, button, [role="button"], .cursor-pointer, input, textarea, select');
      const isText = target.matches('h1, h2, h3, h4, h5, h6, p, span');
      const isDrag = target.matches('[draggable="true"]');

      if (isInteractive || isDrag) {
        isHoveringRef.current = true;
        dot.classList.add('hovering');
        ring.classList.add('hovering');
        dot.classList.remove('text-mode', 'dragging');
        ring.classList.remove('text-mode', 'dragging');
        if (isDrag) {
          dot.classList.add('dragging');
          ring.classList.add('dragging');
        }
      } else if (isText) {
        isHoveringRef.current = false;
        dot.classList.add('text-mode');
        ring.classList.add('text-mode');
        dot.classList.remove('hovering', 'dragging');
        ring.classList.remove('hovering', 'dragging');
      } else {
        isHoveringRef.current = false;
        dot.classList.remove('hovering', 'text-mode', 'dragging');
        ring.classList.remove('hovering', 'text-mode', 'dragging');
      }
    };

    // Hide cursor on mouse leave
    const handleMouseLeave = () => {
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', updateCursorState);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', updateCursorState);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
      if (dot) dot.remove();
      if (ring) ring.remove();
      const styleElem = document.getElementById('custom-cursor-styles');
      if (styleElem) styleElem.remove();
    };
  }, []);

  return null; // Render nothing, hanya inject DOM via effect
}
