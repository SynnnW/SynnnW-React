// Feed publik: hook data + grid kartu asli + lightbox.
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPublicFeed } from '@/lib/menfess/api';
import { cacheGet, cacheSet, TTL, limitFeedCache } from '@/lib/menfess/cache';
import { categoryLabel } from '@/lib/menfess/renderCard';
import { formatRelative } from './utils';
import { Sheet } from './ui/Sheet';
import { Badge, Button, EmptyState, ErrorState, Skeleton } from './ui';
import CardThumb from './ui/CardThumb';
import SongPill from './ui/SongPill';

export function usePublicFeed(pageSize = 12) {
  const [items, setItems] = useState(() => cacheGet('feed:public') || []);
  const [loading, setLoading] = useState(() => !cacheGet('feed:public'));
  const [more, setMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const load = useCallback(async (before = null) => {
    if (before) setMore(true); else if (!cacheGet('feed:public')) setLoading(true);
    setError(false);
    try {
      const rows = await fetchPublicFeed({ limit: pageSize, before });
      if (!alive.current) return;
      if (before) setItems(p => [...p, ...rows]);
      else { setItems(rows); cacheSet('feed:public', limitFeedCache(rows), TTL.feed); }
      setHasMore(rows.length === pageSize);
    } catch { if (alive.current) setError(true); }
    finally { if (alive.current) { setLoading(false); setMore(false); } }
  }, [pageSize]);

  useEffect(() => { load(); }, [load]);
  const loadMore = () => { const last = items[items.length - 1]; if (last) load(last.posted_at); };
  return { items, loading, more, error, hasMore, reload: () => load(), loadMore };
}

export function PostSheet({ post, onClose }) {
  if (!post) return null;
  return (
    <Sheet open onClose={onClose} title={categoryLabel(post.category)}>
      <div className="mf-stack">
        <div className="mf-narrow" style={{ width: 'min(100%,320px)' }}><CardThumb post={post} scale={0.4} eager className="static" /></div>
        <SongPill song={post} />
        <div className="mf-row"><Badge icon="clock">{formatRelative(post.posted_at)}</Badge></div>
        {post.ig_url && <Button href={post.ig_url} target="_blank" rel="noopener noreferrer" icon="external" variant="secondary">Lihat di Instagram</Button>}
      </div>
    </Sheet>
  );
}

export function FeedGrid({ items, limit, onOpen }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <div className="mf-grid-cards">
      {list.map(p => <CardThumb key={p.id} post={p} onClick={() => onOpen(p)} label={`Buka kartu ${categoryLabel(p.category)}`} />)}
    </div>
  );
}

export function FeedStates({ loading, error, empty, reload }) {
  if (loading) return <div className="mf-grid-cards">{[1, 2, 3, 4].map(i => <Skeleton key={i} ratio="4/5" />)}</div>;
  if (error && empty) return <ErrorState onRetry={reload} />;
  if (empty) return <EmptyState icon="feed" title="Belum ada yang tayang">Menfess yang sudah diposting di Instagram akan muncul di sini.</EmptyState>;
  return null;
}
