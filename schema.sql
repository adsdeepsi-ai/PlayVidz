CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);

INSERT OR IGNORE INTO videos
(slug, title, video_url, thumbnail_url, duration, description)
VALUES
(
  'demo-flower-video',
  'Demo Video',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  '',
  '0:05',
  'Demo video. Replace this from the admin panel.'
);
