// Feed publik penuh /26menfess/feed
import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/menfess/rules';
import { usePublicFeed, FeedGrid, FeedStates, PostSheet } from '@/components/menfess/FeedBits';
import { PageHeader } from '@/components/menfess/ui/Shell';
import { Button, Chip, ChipGroup } from '@/components/menfess/ui';

export default function Feed() {
  const feed = usePublicFeed(12);
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(null);
  const shown = useMemo(() => (cat === 'all' ? feed.items : feed.items.filter(p => p.category === cat)), [feed.items, cat]);
  return (
    <div className="mf-stack">
      <PageHeader title="Sudah tayang" />
      <ChipGroup scroll label="Filter kategori">
        <Chip selected={cat === 'all'} onClick={() => setCat('all')}>Semua</Chip>
        {CATEGORIES.map(c => <Chip key={c.value} selected={cat === c.value} onClick={() => setCat(c.value)}>{c.label}</Chip>)}
      </ChipGroup>
      <FeedStates loading={feed.loading} error={feed.error} empty={!shown.length} reload={feed.reload} />
      {shown.length > 0 && <FeedGrid items={shown} onOpen={setOpen} />}
      {feed.hasMore && !feed.loading && !feed.error && (
        <div className="mf-row" style={{ justifyContent: 'center' }}><Button variant="secondary" loading={feed.more} onClick={feed.loadMore}>Muat lebih banyak</Button></div>
      )}
      <PostSheet post={open} onClose={() => setOpen(null)} />
    </div>
  );
}
