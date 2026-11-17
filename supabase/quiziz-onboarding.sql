-- supabase/quiziz-onboarding.sql
-- Jalankan manual di Supabase SQL Editor (pola sama seperti file .sql lain di folder ini).
-- Isi: status onboarding Quiziz (gate login + kuesioner) dan cache penjelasan soal dari Leo AI.

-- ─────────────────────────────────────────────────────────────
-- 1) Onboarding: satu baris per akun. Status nempel ke akun, bukan ke browser.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.quiz_onboarding (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  answers      jsonb       not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.quiz_onboarding enable row level security;

drop policy if exists "quiz_onboarding select own" on public.quiz_onboarding;
create policy "quiz_onboarding select own" on public.quiz_onboarding
  for select using (auth.uid() = user_id);

drop policy if exists "quiz_onboarding insert own" on public.quiz_onboarding;
create policy "quiz_onboarding insert own" on public.quiz_onboarding
  for insert with check (auth.uid() = user_id);

drop policy if exists "quiz_onboarding update own" on public.quiz_onboarding;
create policy "quiz_onboarding update own" on public.quiz_onboarding
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admin (email yang sama dengan ADMIN_EMAIL di useQuizAuth.js) boleh membaca semua jawaban kuesioner.
drop policy if exists "quiz_onboarding admin read" on public.quiz_onboarding;
create policy "quiz_onboarding admin read" on public.quiz_onboarding
  for select using (lower(coalesce(auth.jwt()->>'email','')) = 'aldokraksaan@gmail.com');

-- ─────────────────────────────────────────────────────────────
-- 2) Cache penjelasan soal dari Leo AI (key = id soal).
--    Ditulis HANYA oleh api/leo-chat.js (service role) supaya tidak bisa
--    diracuni dari browser; user login cuma boleh membaca.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.quiz_ai_explanations (
  question_id text primary key,
  explanation text        not null,
  model       text,
  created_at  timestamptz not null default now()
);

alter table public.quiz_ai_explanations enable row level security;

drop policy if exists "quiz_ai_explanations read" on public.quiz_ai_explanations;
create policy "quiz_ai_explanations read" on public.quiz_ai_explanations
  for select to authenticated using (true);

drop policy if exists "quiz_ai_explanations admin all" on public.quiz_ai_explanations;
create policy "quiz_ai_explanations admin all" on public.quiz_ai_explanations
  for all using (lower(coalesce(auth.jwt()->>'email','')) = 'aldokraksaan@gmail.com') with check (lower(coalesce(auth.jwt()->>'email','')) = 'aldokraksaan@gmail.com');
