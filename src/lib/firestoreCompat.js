// Lapisan kompatibilitas: meniru API firebase/firestore (doc, collection, getDoc,
// getDocs, setDoc, updateDoc, addDoc, deleteDoc, onSnapshot, query, where, orderBy)
// tapi datanya betulan disimpan & dibaca dari Supabase Postgres.
//
// Setiap tabel punya beberapa kolom eksplisit (buat query/order), sisanya
// otomatis disimpan di kolom `data` (jsonb) supaya field apapun yang dipakai
// kode lama (nama field Firestore apapun) tetap tersimpan tanpa perlu
// menyamakan skema kolom satu-satu.
import { supabase } from '../supabaseClient';

const TABLE_MAP = {
  websiteSaran: 'website_saran',
  dashboardContent: 'dashboard_content',
  quizRooms: 'quiz_rooms',
  quizToggles: 'quiz_toggles',
  qzCommunityWrong: 'qz_community_wrong',
};

const PK_MAP = {
  quiz_rooms: 'code',
  briefs: 'id',
  dashboard_content: 'id',
  settings: 'id',
  quiz_toggles: 'id',
  qz_community_wrong: 'id',
};

const EXPLICIT_COLUMNS = {
  users: ['email', 'display_name', 'photo_url', 'role', 'profile_complete'],
  orders: ['user_id', 'status'],
  notifications: ['user_id', 'title', 'message', 'read'],
  activities: ['user_id', 'type'],
  pengeluaran: ['nama', 'jumlah', 'kategori', 'catatan'],
  prices: ['name', 'price', 'description', 'sort_order'],
  price_addons: ['price_id', 'name', 'price'],
  reviews: ['user_id', 'name', 'rating', 'message'],
  website_saran: ['user_id', 'name', 'message'],
  quiz_comments: ['user_id', 'author_name', 'message'],
};

const PURE_DOC_TABLES = new Set([
  'quiz_rooms',
  'briefs',
  'dashboard_content',
  'settings',
  'quiz_toggles',
  'qz_community_wrong',
]);

function resolveTable(rawName) {
  if (rawName.startsWith('quizComments_')) {
    return { table: 'quiz_comments', subjectKey: rawName.slice('quizComments_'.length) };
  }
  if (rawName.startsWith('lb_')) {
    return { table: 'quiz_leaderboards', subjectKey: rawName };
  }
  const table = TABLE_MAP[rawName] || rawName;
  return { table, subjectKey: null };
}

function pkFor(table) {
  return PK_MAP[table] || 'id';
}

function isPureDoc(table) {
  return PURE_DOC_TABLES.has(table) || table === 'quiz_leaderboards';
}

function splitPayload(table, payload) {
  if (isPureDoc(table)) return { explicit: {}, data: payload };
  const known = EXPLICIT_COLUMNS[table] || [];
  const explicit = {};
  const data = {};
  for (const [k, v] of Object.entries(payload)) {
    if (known.includes(k)) explicit[k] = v;
    else data[k] = v;
  }
  return { explicit, data };
}

function flattenRow(table, row) {
  if (!row) return row;
  if (isPureDoc(table)) return { ...(row.data || {}) };
  const { data, ...rest } = row;
  return { ...(data || {}), ...rest };
}

// Dipertahankan supaya pola lama `getFirestore(getApp('quiz'))` / `getFirestore(app)`
// tetap bisa dipanggil — di sini cuma mengembalikan handle db generik, karena cuma
// ada satu koneksi Supabase (tidak ada konsep "app kedua" seperti Firebase).
export function getFirestore() {
  return { __isSupabaseDbHandle: true };
}

export function collection(_db, rawName) {
  const { table, subjectKey } = resolveTable(rawName);
  return { __type: 'collection', table, subjectKey, constraints: [] };
}

export function doc(_db, rawName, id) {
  const { table, subjectKey } = resolveTable(rawName);
  if (table === 'quiz_leaderboards') {
    // id Firestore aslinya cuma uid; di sini di-namespace per papan (subjectKey)
    // supaya unik lintas papan, tapi `.id` yang dibalikin tetap uid aslinya.
    return { __type: 'doc', table, subjectKey, id: `${subjectKey}::${id}`, externalId: id, entryIdCol: true, pk: 'id' };
  }
  return { __type: 'doc', table, subjectKey, id, pk: pkFor(table) };
}

export function query(collRef, ...constraints) {
  return { ...collRef, __type: 'collection', constraints: [...(collRef.constraints || []), ...constraints] };
}

export function where(field, op, value) {
  return { __type: 'where', field, op, value };
}

export function orderBy(field, direction = 'asc') {
  return { __type: 'orderBy', field, direction };
}

export function limit(n) {
  return { __type: 'limit', n };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

// Sentinel-sentinel ala Firestore FieldValue. Diselesaikan (dihitung) di client
// saat setDoc/updateDoc dipanggil (lihat resolveSentinels), bukan atomik di server
// seperti Firestore asli — cukup buat kebutuhan kode lama (skor, counter, dll).
export function increment(value = 1) {
  return { __firestoreOp: 'increment', value };
}
export function arrayUnion(...items) {
  return { __firestoreOp: 'arrayUnion', items };
}

async function resolveSentinels(table, pk, id, payload) {
  const hasSentinel = Object.values(payload).some((v) => v && typeof v === 'object' && v.__firestoreOp);
  if (!hasSentinel) return payload;
  const { data: existingRow } = await supabase.from(table).select('*').eq(pk, id).maybeSingle();
  const resolved = { ...payload };
  for (const [key, val] of Object.entries(payload)) {
    if (!val || typeof val !== 'object' || !val.__firestoreOp) continue;
    const current = existingRow?.[key] ?? existingRow?.data?.[key];
    if (val.__firestoreOp === 'increment') {
      resolved[key] = (typeof current === 'number' ? current : 0) + val.value;
    } else if (val.__firestoreOp === 'arrayUnion') {
      const base = Array.isArray(current) ? current : [];
      resolved[key] = [...new Set([...base, ...val.items])];
    }
  }
  return resolved;
}

function applyConstraints(builder, ref) {
  let b = builder;
  if (ref.subjectKey) b = b.eq('subject_key', ref.subjectKey);
  for (const c of ref.constraints || []) {
    if (c.__type === 'where') {
      const known = EXPLICIT_COLUMNS[ref.table] || [];
      const col = known.includes(c.field) ? c.field : `data->>${c.field}`;
      const opMap = { '==': 'eq', '!=': 'neq', '<': 'lt', '<=': 'lte', '>': 'gt', '>=': 'gte', in: 'in' };
      const op = opMap[c.op] || 'eq';
      b = b[op](col, c.value);
    } else if (c.__type === 'orderBy') {
      const known = EXPLICIT_COLUMNS[ref.table] || [];
      const col = known.includes(c.field) || ['created_at', 'updated_at'].includes(c.field)
        ? c.field
        : `data->${c.field}`;
      b = b.order(col, { ascending: c.direction !== 'desc' });
    } else if (c.__type === 'limit') {
      b = b.limit(c.n);
    }
  }
  return b;
}

export async function getDoc(ref) {
  const { data, error } = await supabase.from(ref.table).select('*').eq(ref.pk, ref.id).maybeSingle();
  if (error) throw error;
  const flat = flattenRow(ref.table, data);
  return {
    exists: () => !!data,
    data: () => flat,
    id: ref.externalId || ref.id,
  };
}

export async function getDocs(ref) {
  let builder = supabase.from(ref.table).select('*');
  builder = applyConstraints(builder, ref);
  const { data, error } = await builder;
  if (error) throw error;
  const pk = pkFor(ref.table);
  const idCol = ref.table === 'quiz_leaderboards' ? 'entry_id' : pk;
  const docs = (data || []).map((row) => ({ id: row[idCol], data: () => flattenRow(ref.table, row) }));
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (fn) => docs.forEach(fn),
  };
}

export async function setDoc(ref, rawPayload, opts = {}) {
  const payload = await resolveSentinels(ref.table, ref.pk, ref.id, rawPayload);
  const { explicit, data } = splitPayload(ref.table, payload);
  let finalData = data;
  if (opts.merge) {
    const { data: existing } = await supabase.from(ref.table).select('data').eq(ref.pk, ref.id).maybeSingle();
    finalData = { ...(existing?.data || {}), ...data };
  }
  const row = { [ref.pk]: ref.id, ...explicit, data: finalData };
  if (ref.subjectKey) row.subject_key = ref.subjectKey;
  if (ref.entryIdCol) row.entry_id = ref.externalId;
  const { error } = await supabase.from(ref.table).upsert(row, { onConflict: ref.pk });
  if (error) throw error;
}

export async function updateDoc(ref, rawPayload) {
  const payload = await resolveSentinels(ref.table, ref.pk, ref.id, rawPayload);
  const { explicit, data } = splitPayload(ref.table, payload);
  const row = { ...explicit };
  if (Object.keys(data).length) {
    const { data: existing } = await supabase.from(ref.table).select('data').eq(ref.pk, ref.id).maybeSingle();
    row.data = { ...(existing?.data || {}), ...data };
  }
  const { error } = await supabase.from(ref.table).update(row).eq(ref.pk, ref.id);
  if (error) throw error;
}

export async function addDoc(collRef, payload) {
  const { explicit, data } = splitPayload(collRef.table, payload);
  const row = { ...explicit, data };
  if (collRef.subjectKey) row.subject_key = collRef.subjectKey;
  const { data: inserted, error } = await supabase.from(collRef.table).insert(row).select().single();
  if (error) throw error;
  const pk = pkFor(collRef.table);
  return { id: inserted[pk] };
}

export async function deleteDoc(ref) {
  const { error } = await supabase.from(ref.table).delete().eq(ref.pk, ref.id);
  if (error) throw error;
}

// writeBatch: subset kecil dari Firestore WriteBatch (set/delete/update + commit),
// dieksekusi sebagai beberapa request berurutan (bukan transaksi atom Postgres,
// tapi cukup buat kasus "hapus/tulis banyak dokumen sekaligus" di kode lama).
export function writeBatch() {
  const ops = [];
  return {
    set(ref, payload, opts) { ops.push(() => setDoc(ref, payload, opts)); return this; },
    update(ref, payload) { ops.push(() => updateDoc(ref, payload)); return this; },
    delete(ref) { ops.push(() => deleteDoc(ref)); return this; },
    async commit() {
      for (const op of ops) await op();
      ops.length = 0;
    },
  };
}

// Meniru onSnapshot: fetch awal + subscribe Supabase Realtime, refetch tiap ada perubahan.
export function onSnapshot(ref, onNext, onError) {
  let cancelled = false;

  const push = async () => {
    try {
      if (ref.__type === 'doc') {
        const snap = await getDoc(ref);
        if (!cancelled) onNext(snap);
      } else {
        const snap = await getDocs(ref);
        if (!cancelled) onNext(snap);
      }
    } catch (err) {
      if (onError) onError(err);
      else console.error('onSnapshot error:', err);
    }
  };

  push();

  const channel = supabase
    .channel(`compat_${ref.table}_${ref.id || ref.subjectKey || 'all'}_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: ref.table }, push)
    .subscribe();

  return () => {
    cancelled = true;
    supabase.removeChannel(channel);
  };
}
