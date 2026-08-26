CREATE TABLE raid_helper_overrides (
  event_id TEXT PRIMARY KEY,
  raid_name TEXT,
  character_name TEXT,
  character_class_name TEXT,
  status TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
