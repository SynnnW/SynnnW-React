// scripts/check-quiziz-routes.mjs
// Menjaga rute Quiziz: setiap path yang bisa dihasilkan registry/navigasi HARUS ada sebagai <Route> di App.jsx,
// dan logika "item aktif" harus konsisten dengan path tersebut. Rute lama tidak boleh hilang tanpa sengaja.
// Pakai: npm run check:quiziz            (opsional: -- --app path/ke/App.jsx untuk menguji file lain)
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const i = process.argv.indexOf('--app');
const appFile = resolve(i > -1 ? process.argv[i + 1] : 'src/App.jsx');
const declared = new Set([...readFileSync(appFile, 'utf8').matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]));

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true } });
let failed = 0;
const fail = (msg) => { failed += 1; console.log(`GAGAL  ${msg}`); };
try {
  const { allPaths, deepLinkBases, SUBJECTS, NAV_ITEMS } = await vite.ssrLoadModule('/src/data/quiziz/registry.js');
  const { activeNav } = await vite.ssrLoadModule('/src/data/quiziz/routes.js');
  const wanted = allPaths();

  // Pangkalan reader boleh dideklarasikan sebagai `<path>/:babId?` (satu rute untuk dashboard dan deep link).
  const has = (p) => declared.has(p) || declared.has(`${p}/:babId?`);
  wanted.filter(([, p]) => !has(p)).forEach(([label, p]) => fail(`rute ${p} (${label}) tidak ada di ${appFile}`));
  deepLinkBases().forEach((b) => { if (!declared.has(`${b}/:babId`) && !declared.has(`${b}/:babId?`)) fail(`deep link ${b}/:babId belum didukung di ${appFile}`); });

  NAV_ITEMS.forEach((n) => {
    const [path, query = ''] = n.to.split('?');
    const got = activeNav(path, query ? `?${query}` : '');
    if (got !== n.id) fail(`item nav "${n.id}" (${n.to}) dianggap aktif sebagai "${got}"`);
  });
  SUBJECTS.forEach((s) => {
    const expect = [[s.paths.latsol, 'latsol'], ...(s.materi ? [[s.materi.path, 'materi']] : []), ...(s.praktikum ? [[s.praktikum.path, 'materi']] : [])];
    if (s.materi) expect.push([`${s.materi.path}/contoh-bab`, 'materi']);
    if (s.praktikum) expect.push([`${s.praktikum.path}/contoh-bab`, 'materi']);
    expect.forEach(([p, id]) => { if (activeNav(p) !== id) fail(`${p} seharusnya mengaktifkan "${id}", hasil "${activeNav(p)}"`); });
  });

  const known = new Set(wanted.flatMap(([, p]) => [p, `${p}/:babId`, `${p}/:babId?`]));
  const orphan = [...declared].filter((p) => (p === '/quizizuas' || p.startsWith('/quiziz')) && !known.has(p));
  console.log(`${wanted.length} path registry/navigasi diperiksa terhadap ${declared.size} rute di ${appFile.split('/').slice(-2).join('/')}`);
  if (orphan.length) console.log(`Info: rute Quiziz di router yang belum ada di registry: ${orphan.join(', ')}`);
  console.log(failed ? `${failed} masalah.` : 'Semua rute lama masih valid.');
} finally {
  await vite.close();
}
process.exit(failed ? 1 : 0);
