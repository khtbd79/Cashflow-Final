import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register offline Service Worker only on HTTP(S) origins with a PWA manifest (skip in standalone/WebIntoApp builds)
if (
  (window.location.protocol === 'http:' || window.location.protocol === 'https:') &&
  document.querySelector('link[rel="manifest"]')
) {
  registerSW({ immediate: true });
}

// Disable mobile browser & WebView pull-to-refresh / swipe-down-to-refresh
{
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchY = 0;

  const hasScrolledVerticalAncestor = (target: EventTarget | null): boolean => {
    let el = target instanceof Element ? target : null;
    while (el) {
      if (el.scrollTop > 0) {
        const ov = window.getComputedStyle(el).overflowY;
        if (ov === 'auto' || ov === 'scroll' || ov === 'overlay') {
          return true;
        }
      }
      el = el.parentElement;
    }
    return (document.scrollingElement?.scrollTop ?? window.scrollY ?? 0) > 0;
  };

  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
    },
    { passive: true }
  );

  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length !== 1 || !e.cancelable) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const totalDx = currentX - touchStartX;
      const totalDy = currentY - touchStartY;
      const stepDy = currentY - lastTouchY;
      lastTouchY = currentY;

      if (
        stepDy > 0 &&
        totalDy > 0 &&
        Math.abs(totalDy) >= Math.abs(totalDx) &&
        !hasScrolledVerticalAncestor(e.target)
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

createRoot(document.getElementById('root')!).render(<App />);
