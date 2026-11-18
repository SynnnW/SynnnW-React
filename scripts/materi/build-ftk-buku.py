#!/usr/bin/env python3
"""
scripts/materi/build-ftk-buku.py
Docx "Buku Teori Keperawatan (Terkoreksi)" -> src/data/quiziz/ftk/materi/buku-bab-NN.js (+ ftk-buku-index.json).
Pakai:  python3 scripts/materi/build-ftk-buku.py /path/Buku_Teori_Keperawatan_Terkoreksi.docx
Lalu:   python3 scripts/materi/build.py   (menyusun manifest.js)

Aturan integritas: soal hanya ditampilkan kalau opsinya utuh (A, B, C, ... berurutan, minimal 4) dan huruf kunci
ada di antara opsi. Soal yang opsinya rusak di docx dilewati dan dilaporkan, tidak ditebak.
"""
import docx, json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'Buku_Teori_Keperawatan_Terkoreksi.docx'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'src', 'data', 'quiziz', 'ftk', 'materi')
TITLES = {
  1: 'Pengenalan Jurnal Keperawatan sebagai Referensi Utama', 2: 'Konsep Falsafah Keperawatan',
  3: 'Konsep Paradigma Keperawatan', 4: 'Konsep Holistic Care: Holisme dan Humanisme',
  5: 'Konsep Teori Keperawatan', 6: 'Teori Florence Nightingale', 7: 'Teori Virginia Henderson',
  8: 'Teori Dorothea E. Orem', 9: 'Teori Sister Callista Roy', 10: 'Teori Betty Neuman',
  11: 'Teori Katharine Kolcaba', 12: 'Teori Nola J. Pender', 13: 'Teori Hildegard E. Peplau',
  14: 'Konsep Sistem dan Pendekatan Sistem dalam Keperawatan',
}
REFL = 'Refleksi Pembelajaran Mandiri'

D = docx.Document(SRC)
P = [(p.style.name, p.text) for p in D.paragraphs]
T = [t.strip() for _, t in P]
end_main = next(i for i, t in enumerate(T) if t.startswith('Lampiran-lampiran'))
k_start = next(i for i, t in enumerate(T) if t.startswith('Lampiran 1'))
k_end = next(i for i, t in enumerate(T) if t.startswith('Lampiran 2'))

# ── kunci jawaban + rasional (Lampiran 1)
KEY, cur = {}, None
for i in range(k_start, k_end):
    t = T[i]
    m = re.match(r'^Bab\s+([IVX]+|\d+)\s*$', t)
    if m:
        cur = 1 if m.group(1) == 'I' else (int(m.group(1)) if m.group(1).isdigit() else None); KEY.setdefault(cur, {}); continue
    m = re.match(r'^(\d+)\s*[\.\)]\s*([A-E])\s*[-–—]+\s*(.*)$', t)
    if m and cur: KEY[cur][int(m.group(1))] = (m.group(2), m.group(3).strip())

# ── awal tiap BAB
starts = {}
for i in range(end_main):
    m = re.match(r'^BAB\s*(\d+)\b', T[i], re.I)
    if m and int(m.group(1)) not in starts: starts[int(m.group(1))] = i
order = sorted(starts)
bounds = {n: (starts[n], starts[order[j + 1]] if j + 1 < len(order) else end_main) for j, n in enumerate(order)}

def lines_of(lo, hi):
    out = []
    for i in range(lo, hi):
        style, text = P[i]
        for ln in text.split('\n'):
            s = re.sub(r'\s+', ' ', ln).strip()
            if not s or re.fullmatch(r'\d{1,3}', s): continue          # kosong / nomor halaman
            if s.endswith(REFL) and len(s) > len(REFL) + 2:             # "E. ... Refleksi Pembelajaran Mandiri" menyatu
                out.append((style, s[:-len(REFL)].strip())); out.append(('Heading 2', REFL)); continue
            if re.search(r'latihan soal$', s, re.I) and len(s) > 14:     # "... budaya. Latihan Soal" menyatu
                out.append((style, s[:-12].strip())); out.append(('Heading 2', 'Latihan Soal')); continue
            out.append((style, s))
    return out

def is_q_start(L, i):
    """Soal 1 = baris '1. ...' yang disusul (maks 3 baris lanjutan stem) baris opsi 'A.'; daftar ringkasan bernomor tidak lolos."""
    if not re.match(r'^(\d{1,2})\s*[\.\)]\s', L[i][1]): return False
    for j in range(i + 1, min(i + 5, len(L))):
        t = L[j][1]
        if re.match(r'^A\s*[\.\)]\s', t): return True
        if re.match(r'^\d+\s*[\.\)]\s', t) or t.lower() == 'latihan soal': return False
    return False

report = {}
index = []
MARK = {}
ORPHAN = {}
for n in order:
    lo, hi = bounds[n]
    L = lines_of(lo, hi)
    blocks, i = [], 0
    # judul + capaian pembelajaran
    j = next((k for k, (_, t) in enumerate(L[:30]) if t.lower().startswith('pendahuluan') or t.lower().endswith(' pendahuluan')), None)
    head = ' '.join(t for _, t in L[:j + 1]) if j is not None else ''
    m = re.search(r'Capaian Pembelajaran(?: Bab)?\s*(.*?)\s*Pendahuluan\s*$', head, re.I)
    if m and j is not None:
        items = [re.sub(r'^\d+\s*[\.\)]\s*', '', x).strip() for x in re.split(r'(?<=[\.\?])\s+(?=\d+\s*[\.\)]\s)', m.group(1)) if x.strip()]
        if items:
            blocks.append({'t': 'h', 'x': 'Capaian Pembelajaran'}); blocks.append({'t': 'ol', 'items': items})
        blocks.append({'t': 'h', 'x': 'Pendahuluan'}); i = j + 1
    else:
        i = 1  # buang penanda "BAB n"
    state = 'body'; quizzes, skipped = [], []
    has_marker = any(t.lower() == 'latihan soal' for _, t in L); MARK[n] = has_marker
    list_buf = []
    def flush_list():
        global list_buf
        if list_buf: blocks.append({'t': 'ol', 'items': list_buf}); list_buf = []
    while i < len(L):
        style, t = L[i]
        if t == REFL or (style == 'Heading 2' and t.lower().startswith('refleksi pembelajaran')):
            flush_list(); state = 'refl'; blocks.append({'t': 'h', 'x': REFL}); i += 1; continue
        if style == 'Heading 2' and t.lower() == 'referensi':
            flush_list(); state = 'ref'; blocks.append({'t': 'h', 'x': 'Referensi'}); i += 1; continue
        if state == 'body' and t.lower() == 'latihan soal':
            flush_list(); i += 1; continue
        if state == 'body' and is_q_start(L, i):
            flush_list(); state = 'soal'
        if state == 'soal':
            mnum = re.match(r'^(\d{1,2})', L[i][1]); qs, expect, cur_q = [], int(mnum.group(1)), None
            while i < len(L):
                st, tx = L[i]
                if tx.lower() == 'latihan soal': i += 1; continue
                if tx == REFL or (st == 'Heading 2' and tx.lower().startswith(('refleksi pembelajaran', 'referensi'))): break
                mq = re.match(r'^(\d{1,2})\s*[\.\)]\s*(.*)$', tx)
                mo = re.match(r'^([A-E])\s*[\.\)]\s*(.*)$', tx)
                if mq and int(mq.group(1)) == expect and not (cur_q and cur_q['opts'] and mo):
                    cur_q = {'n': expect, 'stem': [mq.group(2)], 'opts': []}; qs.append(cur_q); expect += 1
                elif mo and cur_q is not None:
                    cur_q['opts'].append((mo.group(1), mo.group(2)))
                elif cur_q is not None:
                    if cur_q['opts']: l, v = cur_q['opts'][-1]; cur_q['opts'][-1] = (l, (v + ' ' + tx).strip())
                    else: cur_q['stem'].append(tx)
                i += 1
            kn = KEY.get(n, {})
            for q in qs:
                letters = [l for l, _ in q['opts']]; stem = re.sub(r'\s+', ' ', ' '.join(q['stem'])).strip().replace('\\...', '...')
                key = kn.get(q['n'])
                ok = letters == [chr(65 + x) for x in range(len(letters))] and len(letters) >= 4 and bool(stem) and key and key[0] in letters
                if not ok:
                    why = 'tanpa kunci' if not key else f'opsi tidak utuh ({"".join(letters) or "kosong"})'
                    skipped.append((q['n'], why)); continue
                quizzes.append({'t': 'quiz', 'id': f'ftk-b{n:02d}-q{q["n"]:02d}', 'q': stem, 'opts': [v for _, v in q['opts']],
                                'ans': letters.index(key[0]), 'exp': key[1]})
            have = {int(q['id'].rsplit('q', 1)[1]) for q in quizzes} | {a for a, _ in skipped}
            for k in sorted(set(range(1, 11)) - have): skipped.append((k, 'tidak ada di file buku'))
            skipped.sort()
            blocks.append({'t': 'h', 'x': 'Latihan Soal'})
            blocks.append({'t': 'box', 'v': 'tip', 'x': 'Soal dan kunci dari buku. Pilih jawaban lalu klik Cek Jawaban; penjelasannya diambil dari Lampiran 1 buku.'})
            blocks += quizzes
            if skipped:
                blocks.append({'t': 'box', 'v': 'warn', 'x': 'Soal nomor ' + ', '.join(str(a) for a, _ in skipped) + ' tidak ditampilkan karena opsi jawabannya tidak utuh di file buku.'})
            state = 'body'; continue
        if state == 'ref':
            if not re.fullmatch(r'\d{1,3}', t): blocks[-1:] = blocks[-1:] if blocks[-1]['t'] != 'ul' else blocks[-1:]
            if blocks and blocks[-1]['t'] == 'ul': blocks[-1]['items'].append(t)
            else: blocks.append({'t': 'ul', 'items': [t]})
            i += 1; continue
        if state == 'refl':
            item = re.sub(r'^\d+\s*[\.\)]\s*', '', t)
            if blocks and blocks[-1]['t'] == 'ol' and re.match(r'^\d+\s*[\.\)]\s', t): blocks[-1]['items'].append(item)
            elif re.match(r'^\d+\s*[\.\)]\s', t): blocks.append({'t': 'ol', 'items': [item]})
            else: blocks.append({'t': 'p', 'x': t})
            i += 1; continue
        # body
        if re.match(r'^[A-E]\s*[\.\)]\s', t) and len(t) < 160:
            ORPHAN[n] = ORPHAN.get(n, 0) + 1; i += 1; continue
        if style == 'Heading 2':
            flush_list(); blocks.append({'t': 'h', 'x': t})
        elif re.match(r'^\d+\s*[\.\)]\s+', t) and not (len(t) > 160):
            list_buf.append(re.sub(r'^\d+\s*[\.\)]\s*', '', t))
        else:
            flush_list(); blocks.append({'t': 'p', 'x': t})
        i += 1
    flush_list()
    seen, dd = set(), []
    for b in blocks:
        k = (b['t'], b.get('x') or '|'.join(b.get('items', [])))
        if b['t'] in ('p', 'h') and k in seen: continue
        if b['t'] in ('p', 'h'): seen.add(k)
        dd.append(b)
    blocks = dd
    blocks.insert(0, {'t': 'box', 'v': 'tip', 'x': f'Sumber: Buku Teori Keperawatan (buku ajar dari dosen pengampu FTK), BAB {n}. Ini acuan utama ujian FTK.'})
    bid = f'buku-bab-{n:02d}'
    with open(os.path.join(OUT, bid + '.js'), 'w', encoding='utf-8') as fh:
        fh.write('// DIHASILKAN oleh scripts/materi/build-ftk-buku.py dari Buku Teori Keperawatan (Terkoreksi)\n')
        fh.write('export default ' + json.dumps({'id': bid, 'title': TITLES[n], 'sumber': f'Buku Teori Keperawatan (terkoreksi), BAB {n}', 'blocks': blocks}, ensure_ascii=False, indent=1) + ';\n')
    index.append({'id': bid, 'label': TITLES[n], 'badge': f'BAB {n}', 'file': bid + '.js'})
    report[n] = (len(quizzes), skipped, sum(1 for b in blocks if b['t'] == 'p'))
json.dump(index, open(os.path.join(HERE, 'ftk-buku-index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for n in sorted(report):
    q, sk, np_ = report[n]; print(f'BAB {n:>2}: paragraf={np_:>3} yatim={ORPHAN.get(n,0)} soal_valid={q:>2} dilewati={sk}')
print('total soal valid:', sum(v[0] for v in report.values()), '| bab:', len(report))
