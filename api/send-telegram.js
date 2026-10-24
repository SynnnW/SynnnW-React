// api/send-telegram.js
// Vercel Serverless Function — proxy Telegram
// Token & Chat ID disimpan di Vercel Environment Variables:
//   TELEGRAM_BOT_TOKEN = token dari BotFather
//   TELEGRAM_CHAT_ID   = chat/group ID tujuan (dari @userinfobot)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Telegram belum dikonfigurasi di Vercel env vars' });
  }

  const body = req.body;
  let text = '';

  // ── Tipe 1: Hasil Quiz ──
  if (!body.type || body.type === 'quiz_result') {
    const { nickname, subject, score, maxScore, correct, total, duration, mode, suggestion } = body;
    const pct   = Math.round((correct / total) * 100);
    const medal = pct >= 80 ? '🏆' : pct >= 60 ? '💪' : pct >= 40 ? '📖' : '😢';
    text = [
      `${medal} *HASIL QUIZ KEPERAWATAN*`,
      ``,
      `👤 *Nama:* ${esc(nickname)}`,
      `📚 *Matkul:* ${esc(subject)}`,
      `🎯 *Skor:* ${esc(score)} / ${esc(maxScore)}`,
      `✅ *Benar:* ${esc(correct)} dari ${esc(total)} soal \\(${pct}%\\)`,
      `⏱️ *Durasi:* ${esc(duration)}`,
      `🎮 *Mode:* ${mode === 'hard' ? '🔴 Timed' : '🟢 Unlimited'}`,
      ``,
      `💡 *Saran:*`,
      esc(suggestion),
      ``,
      `_Dikirim via Quiz Keperawatan SynnnW_`,
    ].join('\n');

  // ── Tipe 2: Saran Website ──
  } else if (body.type === 'saran_website') {
    const { name, message } = body;
    text = [
      `💬 *SARAN WEBSITE*`,
      ``,
      `👤 *Dari:* ${esc(name || 'Anonim')}`,
      ``,
      `📝 *Pesan:*`,
      esc(message),
      ``,
      `_Dikirim via Form Saran SynnnW Website_`,
    ].join('\n');

  } else {
    return res.status(400).json({ error: 'Tipe pesan tidak dikenal' });
  }

  try {
    const r = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'MarkdownV2' }),
      }
    );
    const data = await r.json();
    if (!data.ok) return res.status(400).json({ error: data.description });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// Escape karakter khusus MarkdownV2
function esc(str = '') {
  return String(str).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}
