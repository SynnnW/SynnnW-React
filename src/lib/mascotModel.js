// Memuat /public/mascot/mascot.glb bila ada. Mengembalikan glTF yang sudah di-parse, atau null.
// Pada SPA, file yang tidak ada biasanya dijawab index.html (status 200) — jadi isi file
// diperiksa lewat magic bytes "glTF" sebelum dipercaya. Hasil (termasuk "tidak ada") di-cache.
export const MASCOT_GLB_URL = '/mascot/mascot.glb';
let cache = null;

export function loadMascotModel(url = MASCOT_GLB_URL) {
  if (cache) return cache;
  cache = (async () => {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 12) return null;
      const head = new Uint8Array(buf, 0, 4);
      const isGlb = head[0] === 0x67 && head[1] === 0x6c && head[2] === 0x54 && head[3] === 0x46; // "glTF"
      if (!isGlb) return null;
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      return await new Promise(resolve => new GLTFLoader().parse(buf, '', resolve, () => resolve(null)));
    } catch {
      return null;
    }
  })();
  return cache;
}

let webglOk = null;
/** Cek WebGL sekali saja; hasilnya di-cache. */
export function canUseWebGL() {
  if (webglOk !== null) return webglOk;
  try {
    const c = document.createElement('canvas');
    webglOk = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    webglOk = false;
  }
  return webglOk;
}
