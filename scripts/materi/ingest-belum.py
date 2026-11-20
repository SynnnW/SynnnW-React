#!/usr/bin/env python3
"""
scripts/materi/ingest-belum.py
Membersihkan dokumen dari paket BELUM_DI_PUSH_REPO (hasil FKEP v2) menjadi markdown bersih di scripts/materi/src/,
lalu build.py mengubahnya jadi data bab. Juga menghapus nama dosen bergelar dari sumber yang sudah ada.
Pakai:  python3 scripts/materi/ingest-belum.py /path/BELUM_DI_PUSH_REPO
"""
import os, re, sys, glob

ROOT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')

# (path relatif di paket, nama file tujuan)
PICK = [
  ('belum-di-push/ilmu-biomedik-dasar/lkp/029-modul-dan-lembar-kerja-praktikum-pencernaan-docx.md', 'ibd-prak-pencernaan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/020-modul-dan-lkp-sistem-kardiovaskular-pdf.md', 'ibd-prak-kardiovaskular.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/016-modul-lkp-respirasi-pdf.md', 'ibd-prak-respirasi.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/017-modul-perkemihan-pdf.md', 'ibd-prak-perkemihan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/022-modul-dan-lkp-sistem-penginderaan-revisi-pdf.md', 'ibd-prak-penginderaan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/015-modul-lkp-reproduksi-revisi-pdf.md', 'ibd-prak-reproduksi.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lkp/024-modul-dan-laporan-kerja-praktikum-sistem-integumen.md', 'ibd-prak-integumen.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/031-panduan-pengerjaan-lkp-sistem-endokrin-pdf.md', 'ibd-pandu-endokrin.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/032-panduan-pengerjaan-lkp-sistem-kardiovaskular-pdf.md', 'ibd-pandu-kardiovaskular.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/033-panduan-pengerjaan-lkp-sistem-otot-pdf.md', 'ibd-pandu-otot.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/034-panduan-pengerjaan-lkp-sistem-pencernaan-pdf.md', 'ibd-pandu-pencernaan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/035-panduan-pengerjaan-lkp-sistem-perkemihan-pdf.md', 'ibd-pandu-perkemihan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/036-panduan-pengerjaan-lkp-sistem-pernapasan-pdf.md', 'ibd-pandu-pernapasan.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/037-panduan-pengerjaan-tugas-lkp-docx.md', 'ibd-pandu-umum.md'),
  ('belum-di-push/ilmu-biomedik-dasar/lainnya/038-petunjuk-pengerjaan-lkp-sistem-penginderaan-pdf.md', 'ibd-pandu-penginderaan.md'),
  ('belum-di-push/komunikasi-dasar-keperawatan/soal/034-pr-10-komdas-kasus-docx.md', 'komdas-pr10-kasus.md'),
  ('sebagian-perlu-cek/komunikasi-dasar-keperawatan/praktikum/023-praktikum-tm-5-docx.md', 'komdas-prak-tm5.md'),
  ('sebagian-perlu-cek/komunikasi-dasar-keperawatan/praktikum/025-tahap-24-praktikum-komunikasi-multidisiplin-tm-7-slide-1-7.md', 'komdas-prak-tm7-a.md'),
  ('sebagian-perlu-cek/komunikasi-dasar-keperawatan/praktikum/026-tahap-25-praktikum-komunikasi-multidisiplin-tm-7-slide-8-13.md', 'komdas-prak-tm7-b.md'),
  ('belum-di-push/kesehatan-global/materi/002-emerging-dan-re-emerging-diseases-docx-tanpa-gambar.md', 'kesglob-emerging.md'),
  ('belum-di-push/kesehatan-global/materi/013-penyakit-tidak-menular-docx-tahap-15b.md', 'kesglob-ptm.md'),
  ('belum-di-push/kesehatan-global/referensi/038-panduan-ptm-dan-faktor-risiko-pdf.md', 'kesglob-panduan-ptm.md'),
  ('sebagian-perlu-cek/kesehatan-global/lkm/033-lkm-kg-docx.md', 'kesglob-lkm.md'),
  ('sebagian-perlu-cek/falsafah-dan-teori-keperawatan/lkm/020-lkm-1-3-ftk-2026-pdf.md', 'ftk-lkm.md'),
]

# ───────── penghapus nama (semua berkas yang dipublikasikan)
TITLES = r'(?:S\.\s?Kep|M\.\s?Kep|M\.\s?Ked\.?\s?Trop|M\.\s?Ked|MNS|MNSc|Sp\.\s?[A-Za-z.]+|Bd|M\.\s?Kes|M\.\s?Sc|MPH|Ph\.?\s?D|Ns|S\.\s?ST|M\.\s?Pd|M\.\s?Si|M\.\s?Biomed|SpPD|Apt)'
NAME = r"[A-Z][A-Za-z'’\-]+(?:\s+(?:bin|binti|van|de|al|el)?\s*[A-Z][A-Za-z'’\-]+){0,5}"
RX_TITLED = re.compile(rf"(?:\b(?:Ns|Dr|dr|Prof|Apt)\.\s*)?\b({NAME})\s*,?\s*(?:{TITLES}\.?\s*[,.]?\s*)+")
DROP_LINE = re.compile(r'^\W*(Dosen(?: Pengampu)?(?: Mata kuliah)?|Dosen pengampu|Pembuat slide|Disusun oleh|Penyusun|Oleh|Pemateri|Presentan|Nama(?:/NIM/Kelas| Mahasiswa| Kelompok| anggota)?|Anggota(?: kelompok)?|NIM|Koordinator|Tim (?:pengampu|dosen))\b.{0,12}[:：\-–]', re.I)
PLACE = re.compile(r'\[(?:nama|nomor dihapus)\]', re.I)
EMAIL = re.compile(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+')

def scrub(text, known=()):
    out = []
    for ln in text.split('\n'):
        if DROP_LINE.match(ln) and (PLACE.search(ln) or RX_TITLED.search(ln) or len(ln.strip()) < 70): continue
        ln = EMAIL.sub('', ln)
        ln = RX_TITLED.sub('', ln)
        ln = PLACE.sub('', ln)
        for n in known: ln = re.sub(re.escape(n), '', ln, flags=re.I)
        out.append(ln)
    return '\n'.join(out)

# ───────── pembersih format → markdown rapi
BUL = re.compile(r'^\s*(?:[-*•●▪■◦➢➤✓✔►·❑]|\d+[.)]|\(\d+\))\s+')
def tidy(text):
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.S)                     # front matter
    text = re.sub(r'^# .*\n', '', text, count=1, flags=re.M)                              # judul (kita pakai label sendiri)
    lines = text.replace('\f', '\n\n').split('\n')
    lines = [re.sub(r'^\s*>\s?', '', l) if l.lstrip().startswith('>') else l for l in lines]
    txt = '\n'.join(lines)
    txt = re.sub(r'\*\*Catatan kuratorial.*?(?:\n\n|\Z)', '', txt, flags=re.S)
    txt = re.sub(r'!\[[^\]]*\]\([^)]*\)(\{[^}]*\})?', '', txt)                            # gambar
    txt = re.sub(r'\{[#.][^}]*\}|<!--.*?-->', '', txt, flags=re.S)
    txt = re.sub(r'\\([\\.*_#\[\]()\-+!>|`~])', r'\1', txt)                                 # unescape
    txt = re.sub(r'\[OCR halaman \d+\]', '', txt)
    out, buf, last_list = [], '', False
    def flush():
        nonlocal buf
        if buf.strip(): out.append(buf.strip())
        buf = ''
    for raw in txt.split('\n'):
        if raw.strip().startswith('|'):                       # baris tabel: lewatkan apa adanya
            flush(); out.append(raw.strip()); continue
        s = re.sub(r'[ \t]+', ' ', raw).strip()
        if not s: flush(); out.append(''); continue
        if re.fullmatch(r'[-_=.…\s]{3,}', s): flush(); continue                              # garis/isian kosong
        if re.fullmatch(r'\d{1,3}', s): continue                                              # nomor halaman
        if BUL.match(s):
            flush(); buf = re.sub(r'^\s*[•●▪■◦➢➤✓✔►·❑]\s+', '- ', s); continue
        if buf and (s[0].islower() or buf.endswith((',', '-', ' dan', ' yang', ' atau', ' dengan'))):
            buf += ' ' + s; continue
        flush(); buf = s
    flush()
    res, prev = [], None
    for l in out:                                                                             # beri baris kosong antar paragraf, rapatkan daftar
        isli = bool(re.match(r'^(- |\d+[.)] )', l)); istb = l.startswith('|')
        if prev is not None and l != '' and not ((isli and prev_li) or (istb and prev_tb)): res.append('')
        res.append(l); prev, prev_li, prev_tb = l, isli, istb
    md = '\n'.join(res)
    md = re.sub(r'\n{3,}', '\n\n', md)
    md = re.sub(r'(?m)^\*\*([^*\n]{4,80}?)\*\*:?$', lambda m: '### ' + m.group(1).strip(), md)   # baris tebal sendirian → heading
    def _cap(m):
        words = m.group(1).split(' ')
        return '### ' + ' '.join(w if (len(w) <= 4 and w.isalpha() and len(words) > 1 and w in ('CPMK','LKP','SOP','SSP','SST','ATP','TM','IBD','PTM','UHC','WHO','AMR','DNA','RNA','EKG','HIV','AIDS','TB','ASI','BAB','CO','PR','ABO')) or re.fullmatch(r'[A-Z]{1,3}\d*', w) and len(w) > 1 and w in ('SOP','LKP','TM') else w.capitalize() for w in words)
    md = re.sub(r'(?m)^([A-Z][A-Z0-9 ,/&()\-–:]{6,90})$', lambda m: m.group(1) if m.group(1).startswith('|') else _cap(m), md)  # JUDUL KAPITAL → heading
    return md.strip() + '\n'

def main():
    for rel, dest in PICK:
        t = open(os.path.join(ROOT, rel), encoding='utf-8').read()
        t = scrub(tidy(t))
        ACR = {'Cpmk':'CPMK','Lkp':'LKP','Sop':'SOP','Ptm':'PTM','Uhc':'UHC','Amr':'AMR','Asi':'ASI','Ssp':'SSP','Tm':'TM','Ibd':'IBD','Pr':'PR','Who':'WHO','Ekg':'EKG','Abo':'ABO'}
        t = '\n'.join(re.sub(r'\b(' + '|'.join(ACR) + r')\b', lambda m: ACR[m.group(1)], l) if l.startswith('### ') else l for l in t.split('\n'))
        t = re.sub(r'[ \t]{2,}', ' ', t)
        open(os.path.join(SRC, dest), 'w', encoding='utf-8').write(t)
        print(f'{dest:<32} {len(t.split()):>6} kata')

    # nama dosen bergelar di sumber lama (ringkasan yang kutulis sendiri)
    names = set()
    for f in glob.glob(os.path.join(SRC, '*.md')):
        for m in RX_TITLED.finditer(open(f, encoding='utf-8').read()):
            n = m.group(1).strip()
            if len(n.split()) >= 2 or len(n) >= 8: names.add(n)
    print('nama bergelar terdeteksi:', len(names))
    for f in glob.glob(os.path.join(SRC, '*.md')):
        t = open(f, encoding='utf-8').read(); t2 = scrub(t, names)
        t2 = re.sub(r'\*Sumber:\s*\*', '*Sumber: dosen pengampu*', t2)
        t2 = re.sub(r'\*Sumber: \s*\*', '*Sumber: dosen pengampu*', t2)
        t2 = t2.replace('*Sumber: & tim*', '*Sumber: dosen pengampu & tim*')
        t2 = re.sub(r'\*Sumber: Ns\. [A-Z][\w .\'’-]+\*', '*Sumber: dosen pengampu*', t2)
        t2 = re.sub(r'\*\*Sumber: dosen pengampu\*\*\s*', '**Sumber:** ', t2)
        t2 = re.sub(r' ?\(\s*\)', '', t2)
        if t2 != t: open(f, 'w', encoding='utf-8').write(t2)

if __name__ == '__main__':
    main()
