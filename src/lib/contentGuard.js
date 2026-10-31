// Light "barrier" against casual copying: long-press menu, image save/drag, text selection and copy.
// This only stops casual attempts; it cannot stop screenshots or dev tools.
const ALLOW = 'input, textarea, select, [contenteditable="true"], .allow-select, .dash, .mk';

const isAllowed = (target) => {
  const el = target instanceof Element ? target : target && target.parentElement;
  return !!(el && el.closest(ALLOW));
};

export function installContentGuard() {
  if (typeof document === 'undefined' || window.__contentGuard) return;
  window.__contentGuard = true;

  // long-press / right-click menu ("Save image", "Copy", etc.)
  document.addEventListener('contextmenu', (e) => { if (!isAllowed(e.target)) e.preventDefault(); });
  // dragging images out of the page
  document.addEventListener('dragstart', (e) => { if (!isAllowed(e.target)) e.preventDefault(); });
  // copy / cut outside forms and private dashboards
  const block = (e) => { if (!isAllowed(e.target)) e.preventDefault(); };
  document.addEventListener('copy', block);
  document.addEventListener('cut', block);
  // start of a text selection (long-press on mobile)
  document.addEventListener('selectstart', block);
}
