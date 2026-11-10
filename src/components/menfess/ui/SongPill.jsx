import Icon from './Icon';
import SongPreviewButton from '../SongPreviewButton';

/** Satu tampilan lagu di mana-mana. `song` boleh bentuk post (song_title…) atau objek lagu. */
export default function SongPill({ song, preview = true }) {
  const title = song?.song_title || song?.song;
  if (!title) return null;
  const artist = song.song_artist;
  return (
    <div className="mf-song">
      {song.song_artwork_url
        ? <img src={song.song_artwork_url} alt="" width="40" height="40" loading="lazy" />
        : <span className="mf-song-art"><Icon name="music" size={18} /></span>}
      <div className="mf-grow">
        <div className="mf-song-t">{title}</div>
        {artist && <div className="mf-song-a">{artist}</div>}
      </div>
      {preview && <SongPreviewButton title={title} artist={artist} previewUrl={song.song_preview_url} />}
    </div>
  );
}
