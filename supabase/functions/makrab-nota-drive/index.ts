// Menyalin foto nota (Supabase Storage) ke folder Google Drive lewat Google Apps Script web app.
// Aman dipanggil kapan saja: kalau Drive belum dipasang, hasilnya { ok: true, configured: false }.
//
// Secret yang perlu diisi (Supabase → Edge Functions → Secrets):
//   NOTA_DRIVE_WEBAPP_URL  = URL web app dari Apps Script (lihat supabase/nota-drive-appsscript.gs)
//   NOTA_DRIVE_SECRET      = kata sandi acak; harus sama dengan SECRET di Apps Script
import { createClient } from 'npm:@supabase/supabase-js@2';
import { encodeBase64 } from 'jsr:@std/encoding@1/base64';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const hook = Deno.env.get('NOTA_DRIVE_WEBAPP_URL');
    const secret = Deno.env.get('NOTA_DRIVE_SECRET');

    const body = await req.json().catch(() => ({}));
    const id = String(body.expense_id || '');
    if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ ok: false, error: 'expense_id tidak valid' }, 400);

    // Pemanggil hanya boleh memproses pengeluaran yang memang boleh dia lihat (RLS memakai JWT pemanggil)
    const asUser = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: exp, error } = await asUser
      .from('makrab_expenses')
      .select('id, division_id, tanggal, keterangan, jumlah, nota_path, nota_drive_url')
      .eq('id', id)
      .maybeSingle();
    if (error || !exp) return json({ ok: false, error: 'pengeluaran tidak ditemukan' }, 404);
    if (exp.nota_drive_url) return json({ ok: true, configured: true, drive_url: exp.nota_drive_url });
    if (!hook || !secret) return json({ ok: true, configured: false });

    const admin = createClient(url, service);
    const { data: div } = await admin.from('makrab_divisions').select('nama').eq('id', exp.division_id).maybeSingle();
    const { data: file, error: dlErr } = await admin.storage.from('makrab-nota').download(exp.nota_path);
    if (dlErr || !file) return json({ ok: false, error: 'nota tidak ditemukan di penyimpanan' }, 404);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = exp.nota_path.split('.').pop() || 'jpg';
    const safe = String(exp.keterangan).replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 60) || 'nota';
    const filename = `${exp.tanggal} - ${safe} - Rp${exp.jumlah}.${ext}`;

    const res = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret,
        folder: div?.nama || 'Lainnya',
        filename,
        mimeType: file.type || 'application/octet-stream',
        base64: encodeBase64(bytes),
      }),
      redirect: 'follow',
    });
    const out = await res.json().catch(() => null);
    if (!out?.ok || !/^https:\/\/(drive|docs)\.google\.com\//.test(String(out.url))) {
      return json({ ok: false, error: `Drive menolak: ${out?.error ?? res.status}` }, 502);
    }
    await admin.from('makrab_expenses').update({ nota_drive_url: out.url }).eq('id', exp.id);
    return json({ ok: true, configured: true, drive_url: out.url });
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message ?? e) }, 500);
  }
});
