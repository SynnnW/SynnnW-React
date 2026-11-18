#!/usr/bin/env python3
"""
scripts/materi/build.py
Mengubah file markdown di scripts/materi/src/ jadi data per bab di
src/data/quiziz/<slug>/materi/ (bab-*.js + manifest.js).

Pakai:  python3 scripts/materi/build.py
Format blok (dibaca oleh src/components/quiz/MateriKit.jsx):
  {t:'h', x}  {t:'p', x}  {t:'ul'|'ol', items:[]}  {t:'table', head:[], rows:[[]]}
  {t:'box', v:'tip'|'warn'|'ex', x}  {t:'img', src, alt, cap}
  {t:'quiz', id, q, opts:[], ans:<index>, exp?:string}
Teks inline boleh memakai **tebal**, *miring*, `kode`.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.path.join(HERE, '..', '..', 'src', 'data', 'quiziz')

# ── konfigurasi: (file, regex judul "## ...", id bab, label, badge, grup)
KDK_UTS, KDK_UAS = 'Sebelum UTS (TM 1–7)', 'Setelah UTS'
CONFIG = {
  'kdk': {
    'title': 'Konsep Dasar Keperawatan', 'sub': 'Caring, profesi, etika & advokasi',
    'icon': '📋', 'color': 'var(--accent-text)',
    'items': [
      ('materi-kdk-tm02-tm07.md', r'^TM 2 ',  'caring',      'Konsep dan Teori Caring', 'TM 2', KDK_UTS),
      ('materi-kdk-tm02-tm07.md', r'^TM 3 ',  'paradigma',   'Paradigma Keperawatan', 'TM 3', KDK_UTS),
      ('materi-kdk-tm02-tm07.md', r'^TM 4 ',  'pelayanan',   'Pelayanan Keperawatan dalam Sistem Kesehatan', 'TM 4', KDK_UTS),
      ('materi-kdk-tm02-tm07.md', r'^TM 5 ',  'profesi',     'Keperawatan sebagai Profesi', 'TM 5', KDK_UTS),
      ('materi-kdk-tm02-tm07.md', r'^TM 6 ',  'standar',     'Standar Praktik Keperawatan Profesional', 'TM 6', KDK_UTS),
      ('materi-kdk-tm02-tm07.md', r'^TM 7 ',  'kode-etik',   'Kode Etik Keperawatan Internasional (ICN)', 'TM 7', KDK_UTS),
      ('materi-kdk-tambahan.md',  r'^TM 9 ',  'etika-moral', 'Prinsip Moral, Etika, dan Kode Etik', 'TM 9', KDK_UAS),
      ('materi-kdk-tambahan.md',  r'^TM 11 ', 'advokasi',    'Advokasi dalam Keperawatan', 'TM 11', KDK_UAS),
      ('materi-kdk-tambahan.md',  r'^Bahan studi kasus', 'studi-kasus-lkm', 'Studi Kasus LKM 1–3', 'LKM', KDK_UAS),
    ],
  },
  'komdas': {
    'title': 'Komunikasi Dasar Keperawatan', 'sub': 'Komunikasi terapeutik, budaya & multidisiplin',
    'icon': '💬', 'color': 'var(--accent-text)',
    'items': [
      ('materi-komdas.md', r'^TM 1 ',  'konsep-dasar',   'Konsep Dasar Komunikasi', 'TM 1', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 2 ',  'jenis',          'Jenis Komunikasi: Verbal & Non-Verbal', 'TM 2', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 3 ',  'terapeutik',     'Konsep Komunikasi Terapeutik', 'TM 3', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 4 ',  'faktor',         'Faktor yang Memengaruhi Komunikasi Efektif', 'TM 4', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas-tambahan.md', r'^TM 5 ', 'sosial-budaya', 'Komunikasi dalam Konteks Sosial & Budaya', 'TM 5', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 6 ',  'agronursing',    'Nilai, Norma & Komunikasi Budaya Agronursing', 'TM 6', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 7 ',  'multidisiplin',  'Komunikasi dalam Pelayanan Multidisiplin', 'TM 7', 'Sebelum UTS (TM 1–7)'),
      ('materi-komdas.md', r'^TM 9 ',  'tren-isu',       'Perspektif, Tren & Isu Komunikasi Pelayanan Kesehatan', 'TM 9', 'Setelah UTS'),
      ('materi-komdas.md', r'^TM 10 ', 'tren-agronursing','Tren & Isu Komunikasi Agronursing', 'TM 10', 'Setelah UTS'),
      ('materi-komdas.md', r'^TM 11 ', 'klien',          'Komunikasi Efektif dengan Klien', 'TM 11', 'Setelah UTS'),
      ('materi-komdas-tm12-tm13.md', r'^TM 12 ', 'keluarga', 'Komunikasi dengan Keluarga (SOP Praktikum)', 'TM 12', 'Setelah UTS'),
      ('materi-komdas-tm12-tm13.md', r'^TM 13 ', 'kelompok', 'Komunikasi Efektif dengan Kelompok', 'TM 13', 'Setelah UTS'),
    ],
    # halaman materi praktikum (route /quiziz/komdas/praktikum)
    'praktikum': [
      ('materi-komdas-tambahan.md', r'^TM 7 \(Praktikum\)', 'sbar-tbak', 'Komunikasi SBAR & TBAK', 'Praktikum', 'Praktikum Komdas'),
      ('materi-komdas-tm12-tm13.md', r'^TM 12 ', 'sop-keluarga', 'SOP: Komunikasi dengan Keluarga', 'Praktikum', 'Praktikum Komdas'),
    ],
  },
  'ibd': {
    'title': 'Ilmu Biomedik Dasar', 'sub': 'Anatomi & fisiologi 12 sistem tubuh',
    'icon': '🧬', 'color': 'var(--accent-text)',
    'items': [
      ('materi-ibd-uts.md', r'^1\. ', 'konsep-dasar', 'Konsep Dasar Ilmu Biomedik', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^2\. ', 'persarafan',   'Sistem Persarafan', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^3\. ', 'pencernaan',   'Sistem Pencernaan, Biokimia & Gizi', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^4\. ', 'endokrin',     'Sistem Endokrin', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^5\. ', 'rangka',       'Sistem Rangka', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^6\. ', 'otot',         'Sistem Otot', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uts.md', r'^7\. ', 'kardiovaskular','Sistem Kardiovaskular', 'UTS', 'Cakupan UTS'),
      ('materi-ibd-uas.md', r'^1\. ', 'indera',       'Sistem Indera', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-uas.md', r'^2\. ', 'perkemihan',   'Sistem Perkemihan', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-uas.md', r'^3\. ', 'pernapasan',   'Sistem Pernapasan', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-uas.md', r'^4\. ', 'reproduksi',   'Sistem Reproduksi', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-uas.md', r'^5\. ', 'hematologi',   'Hematologi, Limfatik & Imunologi Dasar', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-integumen-cairan.md', r'^Sistem Integumen', 'integumen', 'Sistem Integumen', 'UAS', 'Cakupan UAS'),
      ('materi-ibd-integumen-cairan.md', r'^Keseimbangan Cairan', 'cairan', 'Keseimbangan Cairan, Elektrolit & Asam-Basa', 'UAS', 'Cakupan UAS'),
    ],
    'praktikum': [],  # 10 modul LKP menyusul (lihat catatan di laporan)
  },
  'kesglob': {
    'title': 'Kesehatan Global', 'sub': 'Indikator, AMR, PHC/UHC, ketenagaan',
    'icon': '🌍', 'color': 'var(--accent-text)',
    'items': [
      ('materi-kesglob.md', r'^Minggu 1 ', 'konsep',      'Konsep, Sejarah, Ruang Lingkup & Prinsip', 'Minggu 1', 'Materi dosen'),
      ('materi-kesglob.md', r'^Minggu 2 ', 'indikator',   'Indikator Kesehatan Global, GHO, DALY & UHC Index', 'Minggu 2', 'Materi dosen'),
      ('materi-kesglob.md', r'^Minggu 5 ', 'amr-ipc',     'Resistensi Antimikroba & IPC', 'Minggu 5', 'Materi dosen'),
      ('materi-kesglob.md', r'^Minggu 6 ', 'daur-hidup',  'Daur Kehidupan & Kelompok Rentan', 'Minggu 6', 'Materi dosen'),
      ('materi-kesglob.md', r'^Minggu 7 ', 'phc-uhc',     'Sistem Kesehatan, PHC & UHC', 'Minggu 7', 'Materi dosen'),
      ('materi-kesglob.md', r'^Minggu 9 ', 'ketenagaan',  'Ketenagaan Kesehatan Global', 'Minggu 9', 'Materi dosen'),
    ],
  },
  'ftk': {
    'title': 'Falsafah dan Teori Keperawatan', 'sub': 'Acuan ujian: Buku Teori Keperawatan (dosen)',
    'icon': '🩺', 'color': 'var(--text)',
    'items': [
      ('materi-ftk-tambahan-uas.md', r'^TM 9 ',  'orem',    'Teori Dorothea Orem (ringkasan PPT)', 'PPT TM 9', 'PPT dosen / sumber tambahan'),
      ('materi-ftk-tambahan-uas.md', r'^TM 12 ', 'kolcaba', 'Teori Katharine Kolcaba (ringkasan PPT)', 'PPT TM 12', 'PPT dosen / sumber tambahan'),
    ],
    # BAB 1–14 buku: ditampilkan sebagai daftar "segera" sampai isinya dimasukkan (lihat catatan hak cipta)
    'buku_placeholder': [
      ('bab-01','Pengenalan Jurnal Keperawatan sebagai Referensi'), ('bab-02','Konsep Falsafah Keperawatan'),
      ('bab-03','Konsep Paradigma Keperawatan'), ('bab-04','Holistic Care: Holisme dan Humanisme'),
      ('bab-05','Konsep Teori Keperawatan'), ('bab-06','Teori Florence Nightingale'),
      ('bab-07','Teori Virginia Henderson'), ('bab-08','Teori Dorothea E. Orem'),
      ('bab-09','Teori Sister Callista Roy'), ('bab-10','Teori Betty Neuman'),
      ('bab-11','Teori Katharine Kolcaba'), ('bab-12','Teori Nola J. Pender'),
      ('bab-13','Teori Hildegard E. Peplau'), ('bab-14','Konsep Sistem dan Pendekatan Sistem'),
    ],
  },
}

# ───────────────────────── parser markdown → blok
def split_sections(text):
    secs, cur = [], None
    for line in text.split('\n'):
        m = re.match(r'^## (.*)$', line)
        if m:
            cur = {'title': m.group(1).strip(), 'lines': []}
            secs.append(cur)
        elif cur is not None:
            cur['lines'].append(line)
    return secs

def clean_inline(s):
    s = s.strip()
    s = re.sub(r'\\([\\*_`#])', r'\1', s)
    return s

def is_sep_row(line):
    return re.match(r'^\s*\|?\s*:?-{2,}', line) is not None and set(line.replace('|', '').strip()) <= set('-: ')

def parse_row(line):
    line = line.strip()
    if line.startswith('|'): line = line[1:]
    if line.endswith('|'): line = line[:-1]
    return [clean_inline(c) for c in line.split('|')]

def parse_blocks(lines):
    blocks, i, n = [], 0, len(lines)
    para = []
    def flush():
        nonlocal para
        if para:
            txt = clean_inline(' '.join(p.strip() for p in para))
            if txt:
                if re.match(r'^\*\(.*\)\*$', txt) or re.match(r'^\*[^*].*[^*]\*$', txt) and len(txt) < 400 and txt.startswith('*(') :
                    blocks.append({'t': 'box', 'v': 'tip', 'x': txt.strip('*')})
                else:
                    blocks.append({'t': 'p', 'x': txt})
            para = []
    while i < n:
        line = lines[i]
        s = line.strip()
        if not s:
            flush(); i += 1; continue
        if s == '---' or s.startswith('```'):
            flush(); i += 1; continue
        m = re.match(r'^(#{3,6})\s+(.*)$', s)
        if m:
            flush(); blocks.append({'t': 'h', 'x': clean_inline(m.group(2))}); i += 1; continue
        if s.startswith('|') and i + 1 < n and is_sep_row(lines[i + 1]):
            flush()
            head = parse_row(s); rows = []; i += 2
            while i < n and lines[i].strip().startswith('|'):
                rows.append(parse_row(lines[i])); i += 1
            w = len(head)
            rows = [(r + [''] * w)[:w] for r in rows]
            blocks.append({'t': 'table', 'head': head, 'rows': rows}); continue
        if s.startswith('>'):
            flush(); buf = []
            while i < n and lines[i].strip().startswith('>'):
                buf.append(lines[i].strip().lstrip('>').strip()); i += 1
            blocks.append({'t': 'box', 'v': 'ex', 'x': clean_inline(' '.join(buf))}); continue
        mo = re.match(r'^(\s*)(\d+)[\.\)]\s+(.*)$', line)
        mu = re.match(r'^(\s*)[-*+]\s+(.*)$', line)
        if mo or mu:
            flush(); ordered = bool(mo); items = []
            while i < n:
                l2 = lines[i]
                a = re.match(r'^(\s*)(\d+)[\.\)]\s+(.*)$', l2); b = re.match(r'^(\s*)[-*+]\s+(.*)$', l2)
                if a or b:
                    indent = len((a or b).group(1)); txt = (a.group(3) if a else b.group(2))
                    txt = clean_inline(txt)
                    items.append(('– ' + txt) if indent >= 2 and items else txt); i += 1
                elif l2.strip() and l2.startswith('  ') and items:
                    items[-1] += ' ' + clean_inline(l2); i += 1
                else:
                    break
            blocks.append({'t': 'ol' if ordered else 'ul', 'items': items}); continue
        para.append(line); i += 1
    flush()
    return blocks

def js(obj):
    return json.dumps(obj, ensure_ascii=False, indent=1)

def build():
    cache = {}
    made = {}
    def sections(f):
        if f not in cache: cache[f] = split_sections(open(os.path.join(SRC, f), encoding='utf-8').read())
        return cache[f]
    summary = {}
    for slug, cfg in CONFIG.items():
        base = os.path.join(OUT, slug, 'materi'); os.makedirs(base, exist_ok=True)
        for old in os.listdir(base):
            if old.startswith('bab-') and old.endswith('.js'): os.remove(os.path.join(base, old))
        def make(items, tag):
            entries = []
            for (f, rx, bid, label, badge, group) in items:
                sec = next((s for s in sections(f) if re.search(rx, s['title'])), None)
                if sec is None:
                    print(f'!! tidak ketemu: {f} {rx}', file=sys.stderr); continue
                key = (slug, f, rx)
                if key in made:            # isi sama dengan bab lain: pakai ulang file-nya
                    entries.append((tag + bid, label, badge, group, made[key])); continue
                blocks = parse_blocks(sec['lines'])
                fn = f'bab-{tag}{bid}.js'
                with open(os.path.join(base, fn), 'w', encoding='utf-8') as fh:
                    fh.write('// DIHASILKAN oleh scripts/materi/build.py — jangan edit manual, ubah sumbernya di scripts/materi/src/\n')
                    fh.write('export default ' + js({'id': tag + bid, 'title': label, 'sumber': sec['title'], 'blocks': blocks}) + ';\n')
                made[key] = fn
                entries.append((tag + bid, label, badge, group, fn))
            return entries
        main = make(cfg['items'], '')
        prak = make(cfg.get('praktikum', []), 'p-') if cfg.get('praktikum') is not None else []
        def manifest_js(name, entries, extra=''):
            groups = []
            for (_id, label, badge, group, fn) in entries:
                g = next((x for x in groups if x['category'] == group), None)
                if not g: g = {'category': group, 'babs': []}; groups.append(g)
                g['babs'].append((_id, label, badge, fn))
            out = [f"// DIHASILKAN oleh scripts/materi/build.py", f"const {name} = ["]
            if extra: out.append(extra)
            for g in groups:
                out.append(f"  {{ category: {json.dumps(g['category'], ensure_ascii=False)}, babs: [")
                for (_id, label, badge, fn) in g['babs']:
                    out.append(f"    {{ id: {json.dumps(_id)}, label: {json.dumps(label, ensure_ascii=False)}, badge: {json.dumps(badge, ensure_ascii=False)}, load: () => import('./{fn}') }},")
                out.append('  ] },')
            out.append('];'); out.append(f'export default {name};')
            return '\n'.join(out) + '\n'
        extra = ''
        if slug == 'ftk':
            idx_path = os.path.join(HERE, 'ftk-buku-index.json')
            if os.path.exists(idx_path):      # hasil build-ftk-buku.py: bab buku sungguhan
                idx = json.load(open(idx_path, encoding='utf-8'))
                lines = ["  { category: 'Buku Teori Keperawatan (acuan utama ujian)', babs: ["]
                for e in idx:
                    lines.append(f"    {{ id: {json.dumps(e['id'])}, label: {json.dumps(e['label'], ensure_ascii=False)}, badge: {json.dumps(e['badge'])}, load: () => import('./{e['file']}') }},")
            else:                             # belum ada bukunya: daftar "Segera"
                lines = ["  { category: 'Buku Teori Keperawatan (acuan utama ujian)', segera: true, babs: ["]
                for (bid, label) in cfg['buku_placeholder']:
                    lines.append(f"    {{ id: {json.dumps(bid)}, label: {json.dumps(label, ensure_ascii=False)}, badge: {json.dumps(bid.upper().replace('-', ' '))}, segera: true }},")
            lines.append('  ] },')
            extra = '\n'.join(lines)
        text = manifest_js('manifest', main, extra)
        if slug == 'ftk':  # grup buku tampil di atas grup PPT
            text = text.replace('const manifest = [', 'const manifest = [', 1)
        open(os.path.join(base, 'manifest.js'), 'w', encoding='utf-8').write(text)
        if cfg.get('praktikum') is not None:
            open(os.path.join(base, 'manifest-praktikum.js'), 'w', encoding='utf-8').write(manifest_js('manifestPraktikum', prak))
        summary[slug] = (len(main), len(prak))
    print(summary)

if __name__ == '__main__':
    build()
