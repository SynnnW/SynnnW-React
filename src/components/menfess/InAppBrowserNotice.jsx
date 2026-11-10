import { Button, Callout } from './ui';
import { useMfToast } from './ui/Toast';

export default function InAppBrowserNotice() {
  const toast = useMfToast();
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); toast.show('Link disalin. Tempel di Chrome/Safari.', 'ok'); }
    catch { toast.show('Gagal menyalin. Tahan lama di bilah alamat untuk menyalin.', 'error'); }
  }
  return (
    <Callout kind="warn" icon="alert">
      <b>Kamu membuka lewat aplikasi (Instagram/Facebook/TikTok).</b>
      <p className="mf-small">Google menolak login di browser bawaan aplikasi. Ketuk <b>⋯</b> lalu <b>Buka di browser</b>, atau salin link ini. Login anonim tetap bisa dipakai di sini.</p>
      <Button variant="secondary" size="sm" icon="copy" onClick={copyLink}>Salin link</Button>
    </Callout>
  );
}
