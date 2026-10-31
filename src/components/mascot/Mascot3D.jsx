// Scene 3D maskot "Pico" (React Three Fiber). Dimuat LAZY oleh <Mascot> — three.js tidak masuk bundle awal.
// Jika /public/mascot/mascot.glb valid, model itu dipakai (klip animasi dipetakan dari nama mood).
// Jika tidak, karakter prosedural orisinal di bawah dipakai sebagai placeholder.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Box3, LoopRepeat, LoopOnce, MathUtils, Vector3 } from 'three';
import { loadMascotModel } from '../../lib/mascotModel';
import { normalizeMood } from './moods';

const INK = '#17160F';
const LIME = '#D7FF3A';
const damp = MathUtils.damp;

/* Target pose per mood. Angka = radian / unit scene. */
const POSE = {
  idle:      { armR: -0.3,  armL: 0.3,  tilt: 0,     eye: 1,   brow: 0,    mouth: 'smile', lookY: 0 },
  wave:      { armR: -2.2,  armL: 0.3,  tilt: 0.06,  eye: 1,   brow: 0,    mouth: 'smile', lookY: 0 },
  thinking:  { armR: -2.3,  armL: 0.3,  tilt: 0.12,  eye: 0.9, brow: 0.3,  mouth: 'o',     lookY: 0.12 },
  happy:     { armR: -1.0,  armL: 0.6,  tilt: 0,     eye: 0.3, brow: 0,    mouth: 'open',  lookY: 0 },
  sad:       { armR: -0.1,  armL: 0.1,  tilt: -0.1,  eye: 0.85, brow: -0.35, mouth: 'frown', lookY: -0.1 },
  celebrate: { armR: -2.7,  armL: 2.7,  tilt: 0,     eye: 0.3, brow: 0,    mouth: 'open',  lookY: 0 },
};

function Confetti({ startRef }) {
  const group = useRef();
  const items = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    a: (i / 22) * Math.PI * 2 + (i % 3) * 0.3,
    v: 1.2 + (i % 5) * 0.28,
    c: ['#D7FF3A', '#FF8F7A', '#7CC4F2', '#F2C14E', '#FFFFFF'][i % 5],
    s: 0.05 + (i % 4) * 0.012,
  })), []);
  useFrame(() => {
    const g = group.current; if (!g) return;
    const t = (performance.now() - startRef.current) / 1000;
    g.visible = t >= 0 && t < 1.6;
    if (!g.visible) return;
    g.children.forEach((m, i) => {
      const it = items[i];
      m.position.set(Math.cos(it.a) * it.v * t * 0.9, 0.4 + Math.sin(it.a * 0.5 + 1) * 0.4 * t + it.v * t - 2.2 * t * t, Math.sin(it.a) * 0.3);
      m.rotation.set(t * 6 + i, t * 5, t * 4);
      m.scale.setScalar(Math.max(0, 1 - t / 1.6));
    });
  });
  return (
    <group ref={group} visible={false}>
      {items.map((it, i) => (
        <mesh key={i}><boxGeometry args={[it.s * 1.6, it.s, it.s * 0.3]} /><meshBasicMaterial color={it.c} /></mesh>
      ))}
    </group>
  );
}

function Procedural({ mood, pointer, reduced }) {
  const root = useRef(); const body = useRef(); const armR = useRef(); const armL = useRef();
  const eyeL = useRef(); const eyeR = useRef(); const sprout = useRef();
  const mSmile = useRef(); const mFrown = useRef(); const mOpen = useRef(); const mO = useRef();
  const browL = useRef(); const browR = useRef();
  const cur = useRef({ armR: -0.3, armL: 0.3, tilt: 0, eye: 1, brow: 0, yaw: 0, pitch: 0, lookY: 0 });
  const moodStart = useRef(0);
  const blink = useRef({ next: 2, t: 0 });
  const invalidate = useThree(s => s.invalidate);

  useEffect(() => { moodStart.current = performance.now(); if (reduced) invalidate(); }, [mood, reduced, invalidate]);

  useFrame((state, dt) => {
    const P = POSE[mood] || POSE.idle;
    const c = cur.current;
    const t = state.clock.elapsedTime;
    const k = reduced ? 1000 : 9;
    c.armR = damp(c.armR, P.armR, k, dt);
    c.armL = damp(c.armL, P.armL, k, dt);
    c.tilt = damp(c.tilt, P.tilt, k * 0.6, dt);
    c.brow = damp(c.brow, P.brow, k, dt);
    c.lookY = damp(c.lookY, P.lookY, k, dt);

    // kedip
    let eyeT = P.eye;
    if (!reduced && mood !== 'happy' && mood !== 'celebrate') {
      const b = blink.current;
      if (t > b.next) { b.t = t; b.next = t + 3 + Math.random() * 2.5; }
      const bt = t - b.t;
      if (bt >= 0 && bt < 0.14) eyeT = 0.08;
    }
    c.eye = damp(c.eye, eyeT, 30, dt);

    // lompat saat happy/celebrate: 2 kali lalu diam (reward sekali)
    const since = (performance.now() - moodStart.current) / 1000;
    let hop = 0, squash = 0;
    if (!reduced && (mood === 'celebrate' || mood === 'happy') && since < 1.4) {
      const ph = Math.abs(Math.sin(since * Math.PI * 1.4));
      hop = ph * (mood === 'celebrate' ? 0.34 : 0.2);
      squash = (1 - ph) * 0.05;
    }
    const bob = reduced ? 0 : Math.sin(t * 1.7) * (mood === 'idle' ? 0.03 : 0.015);
    const wave = !reduced && mood === 'wave' ? Math.sin(t * 9) * 0.4 : 0;
    const cheer = !reduced && mood === 'celebrate' && since < 2.2 ? Math.sin(t * 10) * 0.25 : 0;

    // arah pandang mengikuti pointer (halus)
    const yawT = pointer.current.x * 0.4, pitchT = -pointer.current.y * 0.18 + c.lookY;
    c.yaw = damp(c.yaw, yawT, reduced ? 1000 : 5, dt);
    c.pitch = damp(c.pitch, pitchT, reduced ? 1000 : 5, dt);

    if (root.current) { root.current.rotation.y = c.yaw; root.current.rotation.x = c.pitch; root.current.rotation.z = c.tilt; }
    if (body.current) { body.current.position.y = bob + hop; body.current.scale.set(1 + squash, 1 - squash, 1 + squash); }
    if (armR.current) armR.current.rotation.z = c.armR + wave + cheer;
    if (armL.current) armL.current.rotation.z = c.armL - cheer;
    [eyeL, eyeR].forEach(r => { if (r.current) r.current.scale.y = Math.max(0.05, c.eye); });
    if (browL.current) { browL.current.rotation.z = -c.brow; browL.current.visible = Math.abs(c.brow) > 0.05; }
    if (browR.current) { browR.current.rotation.z = c.brow; browR.current.visible = Math.abs(c.brow) > 0.05; }
    if (sprout.current) sprout.current.rotation.z = (mood === 'sad' ? -0.45 : Math.sin(t * 1.8) * 0.12);
    const mouths = { smile: mSmile, frown: mFrown, open: mOpen, o: mO };
    Object.entries(mouths).forEach(([name, r]) => { if (r.current) r.current.visible = name === P.mouth; });
    if (reduced) state.invalidate();
  });

  const lime = <meshStandardMaterial color={LIME} roughness={0.55} metalness={0} />;
  const ink = <meshStandardMaterial color={INK} roughness={0.4} />;

  return (
    <group ref={root} position={[0, -0.1, 0]}>
      <group ref={body}>
        {/* badan */}
        <mesh scale={[1, 1.1, 0.95]}><sphereGeometry args={[0.9, 40, 32]} />{lime}</mesh>
        <mesh position={[0, -0.28, 0.5]} scale={[0.62, 0.55, 0.45]}><sphereGeometry args={[0.9, 24, 20]} /><meshStandardMaterial color="#EBFF8F" roughness={0.7} /></mesh>
        {/* mata */}
        <group ref={eyeL} position={[-0.28, 0.14, 0.8]}>
          <mesh scale={[0.85, 1.15, 0.55]}><sphereGeometry args={[0.105, 20, 16]} />{ink}</mesh>
          <mesh position={[0.03, 0.045, 0.05]}><sphereGeometry args={[0.032, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
        <group ref={eyeR} position={[0.28, 0.14, 0.8]}>
          <mesh scale={[0.85, 1.15, 0.55]}><sphereGeometry args={[0.105, 20, 16]} />{ink}</mesh>
          <mesh position={[0.03, 0.045, 0.05]}><sphereGeometry args={[0.032, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
        <mesh ref={browL} position={[-0.28, 0.4, 0.78]} visible={false}><boxGeometry args={[0.2, 0.035, 0.03]} />{ink}</mesh>
        <mesh ref={browR} position={[0.28, 0.4, 0.78]} visible={false}><boxGeometry args={[0.2, 0.035, 0.03]} />{ink}</mesh>
        {/* pipi */}
        <mesh position={[-0.52, -0.06, 0.68]} scale={[1, 0.65, 0.3]}><sphereGeometry args={[0.1, 14, 10]} /><meshStandardMaterial color="#FF8F7A" roughness={0.8} /></mesh>
        <mesh position={[0.52, -0.06, 0.68]} scale={[1, 0.65, 0.3]}><sphereGeometry args={[0.1, 14, 10]} /><meshStandardMaterial color="#FF8F7A" roughness={0.8} /></mesh>
        {/* mulut — hanya satu yang tampil */}
        <mesh ref={mSmile} position={[0, -0.04, 0.85]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.1, 0.02, 8, 20, Math.PI]} />{ink}</mesh>
        <mesh ref={mFrown} position={[0, -0.16, 0.85]} visible={false}><torusGeometry args={[0.09, 0.02, 8, 20, Math.PI]} />{ink}</mesh>
        <mesh ref={mOpen} position={[0, -0.1, 0.84]} scale={[1, 0.8, 0.3]} visible={false}><sphereGeometry args={[0.13, 18, 14]} />{ink}</mesh>
        <mesh ref={mO} position={[0.06, -0.1, 0.85]} scale={[1, 1.1, 0.3]} visible={false}><sphereGeometry args={[0.05, 14, 10]} />{ink}</mesh>
        {/* tunas */}
        <group position={[0, 0.98, 0]}>
          <group ref={sprout}>
            <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.018, 0.026, 0.3, 8]} /><meshStandardMaterial color="#3E5200" /></mesh>
            <mesh position={[0.13, 0.3, 0]} rotation={[0, 0, -0.5]} scale={[1, 0.45, 0.25]}><sphereGeometry args={[0.15, 14, 10]} /><meshStandardMaterial color="#6E9A00" roughness={0.6} /></mesh>
            <mesh position={[-0.11, 0.24, 0]} rotation={[0, 0, 0.55]} scale={[1, 0.45, 0.25]}><sphereGeometry args={[0.13, 14, 10]} /><meshStandardMaterial color="#8DBA10" roughness={0.6} /></mesh>
          </group>
        </group>
        {/* stetoskop kecil */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.93, 1]}><torusGeometry args={[0.76, 0.026, 8, 40]} />{ink}</mesh>
        <mesh position={[0.6, 0.19, 0.6]} rotation={[2.92, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.64, 6]} />{ink}</mesh>
        <mesh position={[0.6, -0.12, 0.7]}><sphereGeometry args={[0.075, 14, 10]} /><meshStandardMaterial color="#C9CED3" metalness={0.4} roughness={0.35} /></mesh>
        {/* lengan — pivot di bahu */}
        <group ref={armL} position={[-0.86, 0.1, 0]}>
          <mesh position={[0, -0.22, 0]}><capsuleGeometry args={[0.1, 0.26, 6, 12]} /><meshStandardMaterial color="#C4EC24" roughness={0.55} /></mesh>
        </group>
        <group ref={armR} position={[0.86, 0.1, 0]}>
          <mesh position={[0, -0.22, 0]}><capsuleGeometry args={[0.1, 0.26, 6, 12]} /><meshStandardMaterial color="#C4EC24" roughness={0.55} /></mesh>
        </group>
        {/* kaki */}
        <mesh position={[-0.36, -1.02, 0.12]} scale={[1, 0.55, 1.2]}><sphereGeometry args={[0.2, 14, 10]} /><meshStandardMaterial color="#A8CB1A" roughness={0.6} /></mesh>
        <mesh position={[0.36, -1.02, 0.12]} scale={[1, 0.55, 1.2]}><sphereGeometry args={[0.2, 14, 10]} /><meshStandardMaterial color="#A8CB1A" roughness={0.6} /></mesh>
      </group>
      {mood === 'celebrate' && !reduced && <Confetti startRef={moodStart} />}
    </group>
  );
}

/* Model GLB buatan sendiri: dipakai bila file valid ada di /public/mascot/mascot.glb */
function GlbModel({ gltf, mood, pointer, reduced }) {
  const root = useRef();
  const mixer = useRef(null);
  const actions = useRef({});
  const activeRef = useRef(null);
  const invalidate = useThree(s => s.invalidate);

  // normalisasi ukuran: tinggi ≈ 2.3 unit, dasar di bawah, ditengahkan
  const fitted = useMemo(() => {
    const scene = gltf.scene;
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = 2.3 / Math.max(size.y, 0.0001);
    return { scene, s, offset: [-center.x * s, -center.y * s, -center.z * s] };
  }, [gltf]);

  useEffect(() => {
    const m = new AnimationMixer(fitted.scene);
    mixer.current = m;
    (gltf.animations || []).forEach(clip => { actions.current[clip.name.toLowerCase()] = m.clipAction(clip); });
    return () => { m.stopAllAction(); mixer.current = null; actions.current = {}; activeRef.current = null; };
  }, [gltf, fitted]);

  useEffect(() => {
    const a = actions.current[mood] || actions.current.idle || Object.values(actions.current)[0];
    if (!a) return;
    const once = mood !== 'idle' && mood !== 'thinking';
    a.reset(); a.setLoop(once ? LoopOnce : LoopRepeat, once ? 1 : Infinity); Object.assign(a, { clampWhenFinished: true });
    if (reduced) { a.play(); Object.assign(a, { paused: true }); mixer.current?.update(0); invalidate(); }
    else { a.fadeIn(0.2).play(); }
    const prev = activeRef.current;
    if (prev && prev !== a) prev.fadeOut(0.2);
    activeRef.current = a;
  }, [mood, reduced, gltf, invalidate]);

  useFrame((_, dt) => {
    if (!reduced) mixer.current?.update(dt);
    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, reduced ? 0 : pointer.current.x * 0.4, 5, dt);
    }
  });

  return (
    <group ref={root}>
      <group scale={fitted.s} position={fitted.offset}><primitive object={fitted.scene} /></group>
    </group>
  );
}

function Scene({ mood, pointer, reduced }) {
  const [gltf, setGltf] = useState(null);
  useEffect(() => { let on = true; loadMascotModel().then(g => { if (on && g) setGltf(g); }); return () => { on = false; }; }, []);
  return gltf
    ? <GlbModel gltf={gltf} mood={mood} pointer={pointer} reduced={reduced} />
    : <Procedural mood={mood} pointer={pointer} reduced={reduced} />;
}

export default function Mascot3D({ mood = 'idle', active = true, reduced = false, trackPointer = true, onReady, onFail }) {
  const pointer = useRef({ x: 0, y: 0 });
  const m = normalizeMood(mood);

  // pointer tracking: hanya perangkat dengan pointer halus, tidak saat reduced-motion
  useEffect(() => {
    if (!trackPointer || reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let raf = 0; let nx = 0; let ny = 0;
    const onMove = e => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => { pointer.current.x = nx; pointer.current.y = ny; raf = 0; });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, [trackPointer, reduced]);

  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ position: [0, 0.1, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); onFail?.(); });
        onReady?.();
      }}
      style={{ background: 'transparent' }}
    >
      <hemisphereLight args={['#ffffff', '#9aa84a', 1.1]} />
      <directionalLight position={[2.5, 3.5, 4]} intensity={2.1} />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.7} color="#cfe6ff" />
      <Scene mood={m} pointer={pointer} reduced={reduced} />
    </Canvas>
  );
}
