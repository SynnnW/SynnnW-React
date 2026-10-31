# Maskot Pico — mengganti model 3D

Letakkan model buatan Anda di **`/public/mascot/mascot.glb`**. Tidak perlu mengubah kode:
`<Mascot>` otomatis memakainya jika file valid (diperiksa lewat header `glTF`), dan kembali ke
karakter prosedural + sprite SVG jika file tidak ada atau rusak.

Kontrak model:
- Format `.glb` (glTF 2.0 binary). Target ≤ 1,5 MB. Hindari kompresi Draco/Meshopt (loader tidak dikonfigurasi untuk itu).
- Ukuran & posisi di-normalisasi otomatis (tinggi ≈ 2,3 unit, dipusatkan) — pivot bebas.
- Klip animasi (opsional), dicocokkan dengan **nama klip huruf kecil**:
  `idle`, `wave`, `thinking`, `happy`, `sad`, `celebrate`.
  `idle` dan `thinking` berulang; yang lain dimainkan sekali. Klip yang tidak ada → jatuh ke `idle`.
- Maskot hanya perlu pencahayaan sederhana (hemisphere + directional); tidak butuh environment map.
