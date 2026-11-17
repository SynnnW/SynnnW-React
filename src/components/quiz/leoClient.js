// src/components/quiz/leoClient.js
// Klien tipis ke /api/leo-chat (API key Gemini TIDAK pernah ada di browser; server yang memegangnya).
// Server mewajibkan sesi login Supabase: token dikirim lewat header Authorization.
import { supabase } from '@/supabaseClient';

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function post(body) {
  const res = await fetch('/api/leo-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.retryAfter = json.retryAfter;
    throw err;
  }
  return json;
}

/** Chat bebas. history = [{role:'user'|'model', text}] (maks 10 terakhir dikirim). */
export const sendChat = ({ message, history, pageContext, materiText }) =>
  post({ mode: 'chat', message, history, pageContext, materiText });

/** Penjelasan soal; server meng-cache per questionId di tabel quiz_ai_explanations. */
export const explainQuestion = ({ questionId, question, options, correctIndex, pageContext }) =>
  post({ mode: 'explain', questionId, question, options, correctIndex, pageContext });
