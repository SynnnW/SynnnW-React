// Ikon konsisten (Font Awesome) untuk data lama yang menyimpan emoji (mis. ikon mata kuliah).
// Emoji di data tidak diubah; di layar selalu tampil sebagai ikon FA. Emoji tak dikenal → tidak ditampilkan.
const MAP = {
  '📖': 'fa-book-open', '📚': 'fa-book', '🩺': 'fa-stethoscope', '🕌': 'fa-mosque', '🇬🇧': 'fa-language', '🇮🇩': 'fa-landmark',
  '🌍': 'fa-earth-asia', '🧬': 'fa-dna', '💬': 'fa-comments', '📋': 'fa-clipboard-list', '⏱': 'fa-stopwatch', '✍': 'fa-pen-nib',
  '🔒': 'fa-lock', '🏛': 'fa-landmark', '🔢': 'fa-hashtag', '✨': 'fa-wand-magic-sparkles', '🤝': 'fa-handshake', '5': 'fa-5',
  '📝': 'fa-pen-to-square', '🎮': 'fa-gamepad', '🏆': 'fa-trophy', '🔁': 'fa-repeat', '💡': 'fa-lightbulb', '🚀': 'fa-rocket',
};
const norm = e => String(e || '').replace(/\ufe0f|\u200d|\u20e3/g, '');

export default function Ico({ e, className = '' }) {
  const cls = MAP[norm(e)];
  return cls ? <i className={`fa-solid ${cls} ${className}`.trim()} aria-hidden="true" /> : null;
}
