/**
 * Penerima nota untuk Makrab 2026 → menyimpan ke folder Google Drive-mu.
 *
 * CARA PASANG (sekali saja, ±3 menit):
 * 1. Buka https://script.google.com → Project baru → hapus isinya → tempel seluruh file ini.
 * 2. Ganti SECRET di bawah dengan kata sandi acak panjang (simpan, nanti dipakai lagi di langkah 4).
 * 3. Klik Deploy → New deployment → jenis "Web app":
 *      Execute as: Me   |   Who has access: Anyone
 *    Klik Deploy, izinkan akses Drive, lalu salin "Web app URL".
 * 4. Supabase → Edge Functions → Secrets, tambahkan dua secret:
 *      NOTA_DRIVE_WEBAPP_URL = (URL web app tadi)
 *      NOTA_DRIVE_SECRET     = (SECRET yang sama dengan di bawah)
 * Selesai. Tiap pengeluaran baru otomatis disalin ke subfolder per divisi.
 */
const SECRET = 'GANTI_DENGAN_KATA_SANDI_ACAK_PANJANG';
const ROOT_FOLDER_ID = '1mdR1kh-O4ceJcFBHJprNzlxhGJxuvL2X'; // folder Drive nota

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!SECRET || SECRET.indexOf('GANTI_') === 0 || d.secret !== SECRET) return out_({ ok: false, error: 'unauthorized' });
    const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const folderName = String(d.folder || 'Lainnya').slice(0, 80);
    const it = root.getFoldersByName(folderName);
    const folder = it.hasNext() ? it.next() : root.createFolder(folderName);
    const blob = Utilities.newBlob(Utilities.base64Decode(d.base64), d.mimeType, String(d.filename).slice(0, 150));
    const file = folder.createFile(blob);
    return out_({ ok: true, url: file.getUrl() });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
