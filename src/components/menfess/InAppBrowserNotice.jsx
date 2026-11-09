export default function InAppBrowserNotice() {
  function copyLink() {
    try {
      navigator.clipboard.writeText(window.location.href);
      alert('Link disalin! Buka di Chrome atau Safari.');
    } catch {
      alert('Salin link ini: ' + window.location.href);
    }
  }
  return (
    <div className="mf-inapp-notice" role="alert">
      <strong>⚠️ Kamu membuka ini di aplikasi Instagram/Facebook/Line.</strong>
      <p style={{ margin: 0 }}>
        Google <strong>tidak mengizinkan login</strong> di browser bawaan aplikasi ini.
        Buka di <strong>Chrome</strong> atau <strong>Safari</strong> untuk bisa login Google,
        atau pilih Masuk Anonim di bawah.
      </p>
      <button className="mf-btn mf-btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={copyLink}>
        📋 Salin link untuk dibuka di browser
      </button>
    </div>
  );
}
