CREATE TABLE custom_events (
  id TEXT PRIMARY KEY,
  raid_name TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  status TEXT NOT NULL,
  character_name TEXT NOT NULL,
  character_class_name TEXT NOT NULL,
  character_spec TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
