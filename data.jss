/* =============================================================
   data.jss — global styles for రుచులు
   If your host does not serve .jss as text/css, rename this file
   to data.css and update the <link> in index.html.
   ============================================================= */

:root { color-scheme: light; }
* { -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  overflow-x: hidden;
  font-family: 'Noto Sans Telugu', 'Gautami', system-ui, -apple-system, sans-serif;
  background: #FFF8F0;
  color: #1A1A1A;
  -webkit-font-smoothing: antialiased;
}
img { background: #FFF0E6; max-width: 100%; height: auto; }

.skip-link {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: #1A1A1A; color: #fff; padding: 12px 20px;
  border-radius: 0 0 12px 0; font-weight: 700; font-size: 14px;
}
.skip-link:focus { left: 0; }

:focus-visible {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
  border-radius: 6px;
}

.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}

@keyframes fadeUp    { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
@keyframes toastIn   { from { opacity: 0; transform: translateY(16px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

.animate-fade-up    { animation: fadeUp    .45s cubic-bezier(.4,0,.2,1) both; }
.animate-fade-in    { animation: fadeIn    .35s ease-out both; }
.animate-slide-down { animation: slideDown .25s ease-out both; }
.toast              { animation: toastIn   .3s cubic-bezier(.4,0,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}

h1, h2, h3, h4, p, span, a, button { overflow-wrap: anywhere; }
