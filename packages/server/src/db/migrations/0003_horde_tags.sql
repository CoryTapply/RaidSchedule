CREATE TABLE horde_tags (
  raid_helper_event_id TEXT PRIMARY KEY,
  is_horde INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
